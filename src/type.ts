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
  CallExpression?: ASTFN<CallExpressionNode, ProgramNode | CallExpressionNode>;
  NumberLiteral?: ASTFN<NumberLiteralNode, CallExpressionNode>;
}

/**
 * out AST
 */
export interface CProgramNode {
  type: "Program";
  body: CExpressionStatementNode[];
}

export interface CExpressionStatementNode {
  type: "ExpressionStatement";
  expression: CCallExpressionNode;
}

export interface CCallExpressionNode {
  type: "CallExpression";
  callee: CIdentifierNode;
  arguments: (CNumberLiteralNode | CCallExpressionNode)[];
}

export interface CNumberLiteralNode {
  type: "NumberLiteral";
  value: string;
}
export interface CIdentifierNode {
  type: "Identifier";
  name: string;
}

export type CASTNodes =
  | CProgramNode
  | CExpressionStatementNode
  | CCallExpressionNode
  | CNumberLiteralNode
  | CIdentifierNode;
