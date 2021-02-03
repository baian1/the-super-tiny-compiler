/**
 * tokenizer
 */
interface CToken {
  type: string;
  value: string;
}
export interface ParenCToken extends CToken {
  type: "paren";
}
export interface NumberCToken extends CToken {
  type: "number";
}
export interface NameCToken extends CToken {
  type: "name";
}

/**
 * ast Node
 */
export interface ProgramNode {
  type: "Program";
  body: (CallExpressionNode | NumberLiteralNode)[];
}
export interface CallExpressionNode {
  type: "CallExpression";
  name: string;
  params: (CallExpressionNode | NumberLiteralNode)[];
}
export interface NumberLiteralNode {
  type: "NumberLiteral";
  value: string;
}

export type ASTNodes = ProgramNode | CallExpressionNode | NumberLiteralNode;

type ASTFN<P, T = undefined> = Partial<
  Record<"enter" | "exit", (node: P, parent: T) => void>
>;

export interface ASTTraverseFn {
  Program?: ASTFN<ProgramNode, null>;
  CallExpression?: ASTFN<CallExpressionNode, ProgramNode>;
  NumberLiteral?: ASTFN<NumberLiteralNode, CallExpressionNode>;
}
