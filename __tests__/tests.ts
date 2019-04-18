import { readFile } from 'mz/fs'
import { resolve } from 'path'
import { compile } from '../src'

const compareInputOutput = async(folder: string) => {
    let filein = resolve(folder, 'input.txt')
    let input = await readFile(filein, 'utf-8')
    let output = await compile(input, filein)

    let expectedOutput = await readFile(resolve(folder, 'output.txt'), 'utf-8')

    expect(output).toEqual(expectedOutput)
}

describe('rules', () => {
    it('$Exact', async() => {
        await compareInputOutput('./__tests__/rules/$Exact')
    })

    it('$Keys', async() => {
        await compareInputOutput('./__tests__/rules/$Keys')
    })

    it('$ReadOnly', async() => {
        await compareInputOutput('./__tests__/rules/$ReadOnly')
    })

    it('$Values', async() => {
        await compareInputOutput('./__tests__/rules/$Values')
    })

    it('BinaryExpressions', async() => {
        await compareInputOutput('./__tests__/rules/BinaryExpressions')
    })

    it('Bounds', async() => {
        await compareInputOutput('./__tests__/rules/Bounds')
    })

    it('Casting', async() => {
        await compareInputOutput('./__tests__/rules/Casting')
    })

    it('Exact', async() => {
        await compareInputOutput('./__tests__/rules/Exact')
    })

    it('Functions', async() => {
        await compareInputOutput('./__tests__/rules/Functions')
    })

    it('Indexers', async() => {
        await compareInputOutput('./__tests__/rules/Indexers')
    })

    it('Maybe', async() => {
        await compareInputOutput('./__tests__/rules/Maybe')
    })

    it('Mixed', async() => {
        await compareInputOutput('./__tests__/rules/Mixed')
    })

    it('MixedOperators', async() => {
        await compareInputOutput('./__tests__/rules/MixedOperators')
    })

    it('NullableType', async() => {
        await compareInputOutput('./__tests__/rules/NullableType')
    })

    it('ObjectIsArray', async() => {
        await compareInputOutput('./__tests__/rules/NullableType')
    })

    it('Opaque', async() => {
        await compareInputOutput('./__tests__/rules/Opaque')
    })

    it('ReactComponent', async() => {
        await compareInputOutput('./__tests__/rules/ReactComponent')
    })

    it('TypeImport', async() => {
        await compareInputOutput('./__tests__/rules/TypeImport')
    })

    it('Undefined', async() => {
        await compareInputOutput('./__tests__/rules/Undefined')
    })

    it('Variance', async() => {
        await compareInputOutput('./__tests__/rules/Variance')
    })

    it('OptionalChaining', async() => {
        await compareInputOutput('./__tests__/rules/OptionalChaining')
    })
})


describe('unit', () => {
    it('Types', async() => {
       await compareInputOutput('./__tests__/unit/Types')
    })

    it('Union', async() => {
        await compareInputOutput('./__tests__/unit/Union')
    })
})
