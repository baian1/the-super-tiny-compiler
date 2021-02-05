import { CASTNodes } from "./type";

export function codeGenerator(cAST: CASTNodes): string {
  switch (cAST.type) {
    case "Program": {
      return cAST.body.map(codeGenerator).join("\n");
    }
    case "ExpressionStatement": {
      return codeGenerator(cAST.expression) + ";";
    }
    case "CallExpression": {
      return `${codeGenerator(cAST.callee)}(${codeGenerator(
        cAST.arguments[0]
      )}, ${codeGenerator(cAST.arguments[1])})`;
    }
    case "Identifier": {
      return cAST.name;
    }
    case "NumberLiteral": {
      return cAST.value;
    }
  }
}

const newAst = {
  type: "Program",
  body: [
    {
      type: "ExpressionStatement",
      expression: {
        type: "CallExpression",
        callee: {
          type: "Identifier",
          name: "add",
        },
        arguments: [
          {
            type: "NumberLiteral",
            value: "2",
          },
          {
            type: "CallExpression",
            callee: {
              type: "Identifier",
              name: "subtract",
            },
            arguments: [
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
    },
  ],
};

//@ts-ignore
// const res = codeGenerator(newAst);
// console.log(res);
