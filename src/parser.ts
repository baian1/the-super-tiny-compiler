/**
 * [{ type: 'paren', value: '(' }, ...]   =>   { type: 'Program', body: [...] }
 */

import { ProgramNode, CallExpressionNode, NumberLiteralNode } from "./type";
import { tokenizer, Tokens } from "./tokenizer";

/**
 * {
 *   type: 'Program',
 *   body: [{
 *     type: 'CallExpression',
 *     name: 'add',
 *     params: [{
 *       type: 'NumberLiteral',
 *       value: '2',
 *     }, {
 *       type: 'CallExpression',
 *       name: 'subtract',
 *       params: [{
 *         type: 'NumberLiteral',
 *         value: '4',
 *       }, {
 *         type: 'NumberLiteral',
 *         value: '2',
 *       }]
 *     }]
 *   }]
 * }
 */
function parser(tokens: Tokens): ProgramNode {
  let ast: ProgramNode = {
    type: "Program",
    body: [],
  };
  let current = 0;
  function walk(): CallExpressionNode | NumberLiteralNode {
    let token = tokens[current];
    if (token.type === "number") {
      current++;
      return {
        type: "NumberLiteral",
        value: token.value,
      };
    }

    //碰到括号,直接舍去,读取后一位的表达式
    if (token.type === "paren" && token.value === "(") {
      token = tokens[++current];
      let node: CallExpressionNode = {
        type: "CallExpression",
        name: token.value,
        params: [],
      };
      current++;
      node.params.push(walk());
      node.params.push(walk());
      //再次curren++,跳过结束的)
      current++;
      return node;
    }

    throw new Error("unknown token");
  }
  while (current < tokens.length) {
    ast.body.push(walk());
  }
  return ast;
}
