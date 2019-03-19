import { addRule } from '../'
import { parenthesizedExpression } from '@babel/types'

// Will retain path.node.extra.parenthesized in output
// var x = 2 + (5 * 3) !== var x = 2 + 5 * 3
addRule('BinaryExpression', () => ({
    BinaryExpression(path) {
        // @ts-ignore
        if (path.node.extra && path.node.extra.parenthesized && path.parent.type !== 'ParenthesizedExpression') {
            path.replaceWith(parenthesizedExpression(path.node))
        }
    },

    LogicalExpression(path) {
        // @ts-ignore
        if (path.node.extra && path.node.extra.parenthesized && path.parent.type !== 'ParenthesizedExpression') {
            path.replaceWith(parenthesizedExpression(path.node))
        }
    }
}))
