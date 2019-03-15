import {
  importDeclaration,
  importSpecifier,
  ExportNamedDeclaration,
  exportNamedDeclaration,
  ImportSpecifier
} from '@babel/types'
import { addRule } from '../'

addRule('TypeImport', () => ({
  ImportDeclaration(path) {
    const importKind = (path as any).node.importKind
    if (importKind === 'type') {
      path.replaceWith(
        importDeclaration(path.node.specifiers, path.node.source)
      )
    } else if (importKind === 'value') {
      const newSpecifiers: any[] = []
      path.node.specifiers.forEach(specifier => {
        if (specifier.type === 'ImportSpecifier') {
          newSpecifiers.push(importSpecifier(specifier.local, specifier.imported))
        } else {
          newSpecifiers.push(specifier)
        }
      })

      path.replaceWith(
          importDeclaration(newSpecifiers, path.node.source)
      )
    }
  },
  ExportNamedDeclaration(path) {
    const node = path.node as ExportNamedDeclaration
    if ((node as any).exportKind === 'type') {
      path.replaceWith(
        exportNamedDeclaration(node.declaration, node.specifiers)
      )
    }
  },
  ImportSpecifier(path) {
    const node = path.node as ImportSpecifier
    if (node.importKind === 'type') {
      path.replaceWith(importSpecifier(node.local, node.imported))
    }
  }
}))
