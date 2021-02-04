import { traverse } from "./traverse";
import {
  ASTNodes,
  CASTNodes,
  CCallExpressionNode,
  CExpressionStatementNode,
  CProgramNode,
  ProgramNode,
} from "./type";

/**
 * ----------------------------------------------------------------------------
 *   Original AST                     |   Transformed AST
 * ----------------------------------------------------------------------------
 *   {                                |   {
 *     type: 'Program',               |     type: 'Program',
 *     body: [{                       |     body: [{
 *       type: 'CallExpression',      |       type: 'ExpressionStatement',
 *       name: 'add',                 |       expression: {
 *       params: [{                   |         type: 'CallExpression',
 *         type: 'NumberLiteral',     |         callee: {
 *         value: '2'                 |           type: 'Identifier',
 *       }, {                         |           name: 'add'
 *         type: 'CallExpression',    |         },
 *         name: 'subtract',          |         arguments: [{
 *         params: [{                 |           type: 'NumberLiteral',
 *           type: 'NumberLiteral',   |           value: '2'
 *           value: '4'               |         }, {
 *         }, {                       |           type: 'CallExpression',
 *           type: 'NumberLiteral',   |           callee: {
 *           value: '2'               |             type: 'Identifier',
 *         }]                         |             name: 'subtract'
 *       }]                           |           },
 *     }]                             |           arguments: [{
 *   }                                |             type: 'NumberLiteral',
 *                                    |             value: '4'
 * ---------------------------------- |           }, {
 *                                    |             type: 'NumberLiteral',
 *                                    |             value: '2'
 *                                    |           }]
 *  (sorry the other one is longer.)  |         }
 *                                    |       }
 *                                    |     }]
 *                                    |   }
 */
function transform(ast: ProgramNode) {
  let cAst: CProgramNode = {
    type: "Program",
    body: [],
  };

  //遍历新树的时候构造老树
  //需要 新树与老树的节点间 存在对应关系
  //才能在遍历时构建新树

  //存储对应关系
  const nodeMap = new Map<ASTNodes, CASTNodes>();

  nodeMap.set(ast, cAst);

  traverse(ast, {
    NumberLiteral: {
      enter(node, parent) {
        const cParentNode = nodeMap.get(parent);
        if (cParentNode && "callee" in cParentNode) {
          cParentNode.arguments.push({
            type: "NumberLiteral",
            value: node.value,
          });
        }
      },
    },
    CallExpression: {
      enter(node, parent) {
        const cParentNode = nodeMap.get(parent);
        if (!cParentNode) {
          return;
        }
        if (parent.type === "Program" && "body" in cParentNode) {
          const expressStateNode: CExpressionStatementNode = {
            type: "ExpressionStatement",
            expression: {
              type: "CallExpression",
              callee: {
                type: "Identifier",
                name: node.name,
              },
              arguments: [],
            },
          };
          cParentNode.body.push(expressStateNode);
          nodeMap.set(node, expressStateNode.expression);
        }
        if (parent.type === "CallExpression" && "callee" in cParentNode) {
          const callExpressionNode: CCallExpressionNode = {
            type: "CallExpression",
            callee: {
              type: "Identifier",
              name: node.name,
            },
            arguments: [],
          };
          cParentNode.arguments.push(callExpressionNode);
          nodeMap.set(node, callExpressionNode);
        }
      },
    },
  });

  return cAst;
}

const oldAst = {
  type: "Program",
  body: [
    {
      type: "CallExpression",
      name: "add",
      params: [
        {
          type: "NumberLiteral",
          value: "2",
        },
        {
          type: "CallExpression",
          name: "subtract",
          params: [
            {
              type: "NumberLiteral",
              value: "4",
            },
            {
              type: "NumberLiteral",
              value: "2",
            },
          ],
        },
      ],
    },
  ],
};

// const res = transform(oldAst as any);
// console.log(res);
