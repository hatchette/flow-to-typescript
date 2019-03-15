import { addRule } from '../index'
import { NodePath } from '@babel/traverse'
import { callExpression, identifier } from '@babel/types'

addRule('Super', () => ({
    Super(path: NodePath) {
        const classNode: any = path.parentPath.parentPath.parentPath.parent
        const superCallExpression = path.parentPath

        // @ts-ignore
        if (path.node.type === 'Super' && classNode.type === 'ClassMethod' && classNode.kind === 'constructor' && classNode.params.length > 0 && classNode.params.length <= 2 && superCallExpression.node.arguments.length !== classNode.params.length) {
            const newParams: any = []
            classNode.params.forEach((param: any) => {
                if (param.name.startsWith('props')) {
                    newParams.push(identifier('props'))
                } else if (param.name.startsWith('state')) {
                    newParams.push(identifier('state'))
                }
            })
            superCallExpression.replaceWith(callExpression(path.node, newParams))
        }
    }
}))
