import { addRule } from '../index'
import { NodePath } from '@babel/traverse'

addRule('ClassProperty', () => ({
    ClassProperty(path: NodePath) {
        const classNode: any = path.parentPath.parent

        if (path.node.type === 'ClassProperty' && classNode.superClass.name === 'Component') {
            path.remove()
        }
    }
}))
