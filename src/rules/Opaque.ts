import { typeAlias } from '@babel/types'
import { addRule } from '../'

addRule('Opaque', () => ({
  enter(path) {
    if (path.type === 'OpaqueType') {
      path.replaceWith(
        typeAlias(
          (path.node as any).id,
          (path.node as any).typeParameters,
          (path.node as any).impltype
        )
      )
    }
  }
}))
