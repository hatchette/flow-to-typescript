import { parse } from '@babel/parser'
import generate from '@babel/generator'
import traverse, { Node, Visitor } from '@babel/traverse'
import { File } from '@babel/types'
import { sync } from 'glob'
import { dropWhile, pullAt } from 'lodash'
import { EOL } from 'os'
import { relative, resolve } from 'path'

type Warning = [string, string, number, number]
type Rule = (warnings: Warning[]) => Visitor<Node>

let rules = new Map<string, Rule>()

export function addRule(ruleName: string, rule: Rule) {
  if (rules.has(ruleName)) {
    throw `A rule with the name "${ruleName}" is already defined`
  }
  rules.set(ruleName, rule)
}

export async function compile(code: string, filename: string) {
  const parsed = parse(code, {
    plugins: [
        'classProperties',
        'objectRestSpread',
        'optionalChaining',
        'nullishCoalescingOperator',
        'jsx',
        'flow'
    ],
    sourceType: 'module'
  })

  let [warnings, ast] = await convert(parsed)

  warnings.forEach(([message, issueURL, line, column]) => {
    console.log(
      `Warning: ${message} (at ${relative(
        __dirname,
        filename
      )}: line ${line}, column ${column}). See ${issueURL}`
    )
  })

  let converted = generate(stripAtFlowAnnotation(ast)).code
  converted = trimLeadingNewlines(converted)
  converted = addTrailingSpace(converted)

  return converted
}

/**
 * @internal
 */
export async function convert<T extends Node>(ast: T): Promise<[Warning[], T]> {
  // load rules directory
  await Promise.all(
    sync(resolve(__dirname, './rules/*.[t|j]s')).map(_ => import(_))
  )

  let warnings: Warning[] = []
  const order = [
    '$Keys',
    'Bounds',
    'Casting',
    'Exact',
    'Variance',
    'Indexer',
    'TypeAlias'
  ]
    const keys = [...rules.keys()]
    const all = [...order, ...keys.filter(k => order.indexOf(k) < 0)]
    const visitor: { [key: string]: any } = {}
    all.forEach(i => {
        const visGen = rules.get(i)!
        if (!visGen) return
        const vis = visGen(warnings)
        Object.keys(vis).forEach(k => {
            if (!visitor[k]) {
                visitor[k] = (vis as any)[k]
            } else {
                const oldVis = visitor[k]
                visitor[k] = (...args: any[]) => {
                    oldVis(...args)
                    ;(vis as any)[k](...args)
                }
            }
        })
    })
    traverse(ast, visitor)

    return [warnings, ast]
}

function stripAtFlowAnnotation(ast: File): File {
  let { leadingComments } = ast.program.body[0]
  if (leadingComments) {
    let index = leadingComments.findIndex(_ => _.value.trim() === '@flow')
    if (index > -1) {
      pullAt(leadingComments, index)
    }
  }
  return ast
}

function addTrailingSpace(file: string): string {
  if (file.endsWith(EOL)) {
    return file
  }
  return file + EOL
}

function trimLeadingNewlines(file: string): string {
  return dropWhile(file.split(EOL), _ => !_).join(EOL)
}
