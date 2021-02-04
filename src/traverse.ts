/**
 *
 * traverse(ast, {
 *  Program: {
 *    enter(node, parent) {
 *      // ...
 *    },
 *    exit(node, parent) {
 *      // ...
 *    },
 *  },
 *
 *  CallExpression: {
 *    enter(node, parent) {
 *      // ...
 *    },
 *    exit(node, parent) {
 *      // ...
 *    },
 *  },
 *
 *  NumberLiteral: {
 *    enter(node, parent) {
 *      // ...
 *    },
 *    exit(node, parent) {
 *      // ...
 *    },
 *  },
 * });
 */

import { ASTNodes, ASTTraverseFn, ProgramNode } from "./type";

export function traverse(ast: ProgramNode, visitor: ASTTraverseFn) {
  function traverseArray(array: ASTNodes[], parent: ASTNodes) {
    array.forEach((child) => {
      traverseNode(child, parent);
    });
  }
  function traverseNode(node: ASTNodes, parent: ASTNodes | null) {
    const type = node.type;
    const method = visitor[type];

    if (method?.enter) {
      //@ts-ignore
      method.enter(node, parent);
    }
    switch (node.type) {
      case "CallExpression": {
        traverseArray(node.params, node);
        break;
      }
      case "NumberLiteral": {
        break;
      }
      case "Program": {
        traverseArray(node.body, node);
        break;
      }
      default:
        throw new Error(`未知节点类型:${type}`);
    }
    if (method?.exit) {
      //@ts-ignore
      method.exit(node, parent);
    }
  }

  traverseNode(ast, null);
}

// traverse(
//   {
//     type: "Program",
//     body: [
//       {
//         type: "CallExpression",
//         name: "add",
//         params: [
//           {
//             type: "NumberLiteral",
//             value: "2",
//           },
//           {
//             type: "CallExpression",
//             name: "subtract",
//             params: [
//               {
//                 type: "NumberLiteral",
//                 value: "4",
//               },
//               {
//                 type: "NumberLiteral",
//                 value: "2",
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     Program: {
//       enter(node) {
//         console.log("Program enter:", node);
//       },
//       exit(node) {
//         console.log("Program exit:", node);
//       },
//     },
//     NumberLiteral: {
//       enter(node) {
//         console.log("NumberLiteral enter:", node);
//       },
//       exit(node) {
//         console.log("NumberLiteral exit:", node);
//       },
//     },
//     CallExpression: {
//       enter(node) {
//         console.log("CallExpression enter:", node);
//       },
//       exit(node) {
//         console.log("CallExpression exit:", node);
//       },
//     },
//   }
// );
