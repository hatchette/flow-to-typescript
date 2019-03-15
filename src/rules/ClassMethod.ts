import { addRule } from '../index'
import {
    ClassMethod,
    classMethod,
    identifier
} from '@babel/types'

addRule('ClassMethod', () => ({
    ClassMethod(path) {
        const classNode: any = path.parentPath.parent

        if (path.node.type === 'ClassMethod' && path.node.kind === 'constructor' && classNode.superClass.name === 'Component' && classNode.superTypeParameters.params.length > 0 && path.node.params.length !== classNode.superTypeParameters.params.length) {
            const newParams: any = []
            let first = true
            classNode.superTypeParameters.params.forEach((param: any) => {
                // @ts-ignore
                const value: string = param.id.name
                let name = first ? 'props' : 'state'
                first = false
                newParams.push(identifier(`${name}: ${value}`))
            })
            const c: ClassMethod = path.node

            path.replaceWith(classMethod(c.kind, c.key, newParams, c.body, c.computed, c.static))
        }
    }
}))
