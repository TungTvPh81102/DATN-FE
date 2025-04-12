import * as acorn from 'acorn'
import * as astring from 'astring'

function isConsoleLog(node: acorn.Statement | acorn.ModuleDeclaration) {
  return (
    node.type === 'ExpressionStatement' &&
    node.expression.type === 'CallExpression' &&
    node.expression.callee.type === 'MemberExpression' &&
    node.expression.callee.object.type === 'Identifier' &&
    node.expression.callee.object.name === 'console' &&
    node.expression.callee.property.type === 'Identifier' &&
    node.expression.callee.property.name === 'log'
  )
}

export function removeConsoleLogs(code: string) {
  const ast = acorn.parse(code, { ecmaVersion: 2020 })

  ast.body = ast.body.filter((node) => !isConsoleLog(node))

  return astring.generate(ast)
}

export function getFunctionName(code: string) {
  try {
    const ast = acorn.parse(code, { ecmaVersion: 2020 })

    if (ast.body.length === 0) return null

    const node = ast.body[0]

    // Case 1: Function Declaration
    if (node.type === 'FunctionDeclaration') {
      return node.id?.name || null
    }

    // Case 2: VariableDeclaration with FunctionExpression or ArrowFunction
    if (
      node.type === 'VariableDeclaration' &&
      node.declarations[0].init &&
      ['FunctionExpression', 'ArrowFunctionExpression'].includes(
        node.declarations[0].init.type
      )
    ) {
      return node.declarations[0].id &&
        node.declarations[0].id.type === 'Identifier'
        ? node.declarations[0].id.name
        : null
    }

    return null
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return null // Lỗi cú pháp
  }
}
