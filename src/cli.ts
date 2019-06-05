#!/usr/bin/env node

import minimist = require('minimist')
import { readFile, readFileSync, writeFileSync, writeFile } from 'mz/fs'
import { resolve } from 'path'
const stdin = require('stdin')
import { compile } from './index'
import { sync } from 'glob'
import { exec } from 'child_process'

main(
  minimist(process.argv.slice(2), {
    alias: {
      renameOnly: ['n'],
      workingDirectory: ['d'],
      globPattern: ['r'],
      help: ['h'],
      input: ['i'],
      output: ['o']
    }
  })
)

async function main(argv: minimist.ParsedArgs) {
  if (argv.help) {
    printHelp()
    process.exit(0)
  }

  if (argv.globPattern) {
    try {
      await compileAll(argv.d, argv.r, argv.n)
      process.exit(0)
      return
    } catch (e) {
      console.error(e)
      process.stderr.write(e.message)
      process.exit(1)
    }
  }

  const argIn: string = argv._[0] || argv.input
  const argOut: string = argv._[1] || argv.output

  try {
    const flow = await readInput(argIn)
    const ts = await compile(flow, argIn)
    await writeOutput(ts, argOut)
  } catch (e) {
    process.stderr.write(e.message)
    process.exit(1)
  }
}

async function compileAll(workingDir: string, globPattern: string, renameOnly: boolean) {
  const x = resolve(process.cwd(), workingDir, globPattern)
  const files = sync(x)

  for (let i = 0; i < files.length; i++){
    const file: string = files[i]

    await convertFile(workingDir, file, renameOnly)
  }
}

async function convertFile(workingDir: string, inFile: string, renameOnly: boolean) {
  const outFile = inFile.substring(0, inFile.length - '.js'.length) + '.tsx'
  if (renameOnly) {
    await exec(`git -C ${workingDir} mv ${inFile} ${outFile}`)
    console.log(`Rename: ${inFile} ===>> ${outFile}  (${workingDir})`)
    return
  }

  try {
    const flow = readFileSync(inFile, 'utf-8')
    console.log(`${inFile} ===>> ${outFile}  (${workingDir})`)
    const ts = await compile(flow, inFile)
    
    if (ts && ts !== flow) {
      writeFileSync(inFile, ts)
      if (inFile.endsWith('.js')) {
        await exec(`git -C ${workingDir} mv ${inFile} ${outFile}`)
      }
    } else {
      console.log('Did Nothing.')
    }

  } catch (e) {
    console.error(`Error ${e} --- ${inFile} `)
  }
}

function readInput(argIn?: string) {
  if (!argIn) {
    return new Promise<string>(stdin)
  }
  return readFile(resolve(process.cwd(), argIn), 'utf-8')
}

function writeOutput(ts: string, argOut: string): Promise<void> {
  if (!argOut) {
    try {
      process.stdout.write(ts)
      return Promise.resolve()
    } catch (err) {
      return Promise.reject(err)
    }
  }
  return writeFile(argOut, ts)
}

function printHelp() {
  const pkg = require('../package.json')

  process.stdout.write(
    `
${pkg.name} ${pkg.version}
Usage: flow2ts [--input, -i] [IN_FILE] [--output, -o] [OUT_FILE]

With no IN_FILE, or when IN_FILE is -, read standard input.
With no OUT_FILE and when IN_FILE is specified, create .ts file in the same directory.
With no OUT_FILE nor IN_FILE, write to standard output.
`
  )
}
