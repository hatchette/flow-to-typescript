import { addRule } from '../'

function removeDuplicateCommentFromPreviousSibling(path: any) {
  if (path.node.leadingComments && path.node.leadingComments.length === 1) {
    const parentNode: any = path.parentPath.node
    const parentNodeIndex = parentNode.body.findIndex((n: any) => n === path.node)
    if (parentNodeIndex > 0) {
      const previousNode = parentNode.body[parentNodeIndex - 1]
      if (previousNode.trailingComments.length === 1 && path.node.leadingComments[0] === previousNode.trailingComments[0]) {
        previousNode.trailingComments = []
      }
    }
  }
}

addRule('CommentFixer', () => ({
  FunctionParent(path) {
    removeDuplicateCommentFromPreviousSibling(path)
  },

  ReturnStatement(path) {
    removeDuplicateCommentFromPreviousSibling(path)
  }
}))
