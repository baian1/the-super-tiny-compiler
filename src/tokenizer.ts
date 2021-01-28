interface CToken {
  type: string;
  value: string;
}
interface ParenCToken extends CToken {
  type: "paren";
}
interface NumberCToken extends CToken {
  type: "number";
}
interface NameCToken extends CToken {
  type: "name";
}

export type Tokens = Array<ParenCToken | NumberCToken | NameCToken>;
/**
 *
 * (add 2 (subtract 4 2))
 *
 * [
 *     { type: 'paren',  value: '('        },
 *     { type: 'name',   value: 'add'      },
 *     { type: 'number', value: '2'        },
 *     { type: 'paren',  value: '('        },
 *     { type: 'name',   value: 'subtract' },
 *     { type: 'number', value: '4'        },
 *     { type: 'number', value: '2'        },
 *     { type: 'paren',  value: ')'        },
 *     { type: 'paren',  value: ')'        },
 * ]
 */
export function tokenizer(code: string) {
  const tokens: Tokens = [];
  for (let count = 0; count < code.length; ) {
    let char = code[count];
    const WHITESPACE = /\s/;
    if (char.match(WHITESPACE)) {
      count++;
      continue;
    }

    if (char === "(" || char === ")") {
      tokens.push({ type: "paren", value: char });
      count++;
      continue;
    }

    const LETTERS = /[a-z]/i;
    if (char.match(LETTERS)) {
      let currentToken = "";
      while (char.match(LETTERS)) {
        currentToken += char;
        char = code[++count];
      }
      tokens.push({ type: "name", value: currentToken });
      currentToken = "";
      continue;
    }

    const NUMBER = /[0-9]/i;
    if (char.match(NUMBER)) {
      let currentToken = "";
      while (char.match(NUMBER)) {
        currentToken += char;
        char = code[++count];
      }
      tokens.push({ type: "number", value: currentToken });
      currentToken = "";
      continue;
    }

    throw new TypeError("I dont know what this character is: " + char);
  }
  return tokens;
}
