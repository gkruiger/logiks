import { 
  type Token, 
  type TokenID, 
  TokenIDs, 
  type NullableBoolean, 
  NullableBooleans, 
  type ASTNode, 
  type FormulaNode, 
  type VariableNode 
} from './types.ts'

export class Parser {
  private tokens: Token[] = []
  private position = 0

  parse(tokens: Token[]): ASTNode[] {
    this.tokens = tokens
    this.position = 0
    let parsedNodes: ASTNode[] = []

    while(!this.isAtEnd()) { 
      parsedNodes.push(
        this.parseStatementOrQuery()
      )
    }

    return parsedNodes
  }

  private parseStatementOrQuery() : ASTNode {

    const formula = this.parseFormula('Formula expected.')

    if(this.check(TokenIDs.EQUALS_SIGN)) {
      this.consume(TokenIDs.EQUALS_SIGN, 'Equals sign expected.') 
      
      const truthValue = this.parseTrueOrFalse('Truthvalue expected.')

      if(!this.isAtEnd()) {
        if(this.check(TokenIDs.DOT)) {
          this.consume(TokenIDs.DOT, 'Unexpected token after truthvalue.')
        } else if(this.check(TokenIDs.NEWLINE)) {
          this.consume(TokenIDs.NEWLINE, 'Unexpected token after truthvalue.')
        } else {
          throw new Error('Unexpected token after truthvalue.')
        }

        if(this.check(TokenIDs.NEWLINE)) {
          this.consume(TokenIDs.NEWLINE, 'Unexpected token after truthvalue.')
        }
      }

      return {
        type: 'statement',
        formula: formula,
        truthValue: truthValue
      }
    }

    if(this.check(TokenIDs.QUESTION_MARK)) {
      this.consume(TokenIDs.QUESTION_MARK, 'Question mark expected.') 

      if(this.check(TokenIDs.NEWLINE)) {
        this.consume(TokenIDs.NEWLINE, 'Unexpected token after truthvalue.')
      }

      return {
        type: 'query',
        formula: formula
      }
    }

    if(this.isAtEnd()) {
      throw new Error('Equals sign or question mark expected.')
    }
    
    throw new Error('Unexpected token after formula. Equals sign or question mark expected.')
  }

  private parseFormula(errorMessage: string) : FormulaNode {
    /*
    if(this.check(TokenIDs.EXCLAMATION_MARK)) {
      this.consume(TokenIDs.EXCLAMATION_MARK, 'Exclamation mark expected.')

      const formula = this.parseFormula('Formula expected.')

      return {
        type: 'not',
        formula: formula
      }
    }
    */

    if(this.check(TokenIDs.VARIABLE)) {
      const formula = this.parseVariable('Variable expected.')

      if(this.check(TokenIDs.XOR)) {
        this.consume(TokenIDs.XOR, 'XOR expected.')
      
        return {
          type: 'xor',
          left: formula,
          right: this.parseFormula('Formula expected.')
        }
      }

      if(this.check(TokenIDs.AND)) {
        this.consume(TokenIDs.AND, 'AND expected.')
      
        return {
          type: 'and',
          left: formula,
          right: this.parseFormula('Formula expected.')
        }
      }

      /*
      /*

      Rest of the operators here, just like the XOR

      */

      return {
        type: 'variable',
        variable: formula.variable
      }
    }

    throw new Error(errorMessage)
  }

  private parseVariable(errorMessage: string) : VariableNode {
    if(this.check(TokenIDs.VARIABLE)) {
      const token = this.consume(TokenIDs.VARIABLE, errorMessage)
      return {
        type: 'variable',
        variable: token.value
      }
    }
    
    throw new Error(errorMessage)
  }

  private parseTrueOrFalse(errorMessage: string) : boolean {
    if(this.check(TokenIDs.TRUE)) {
      this.consume(TokenIDs.TRUE, errorMessage)
      return true
    }
    
    if(this.check(TokenIDs.FALSE)) {
      this.consume(TokenIDs.FALSE, errorMessage)
      return false
    }
       
    throw new Error(errorMessage)
  }

  private check(type: TokenID) : boolean {
    return !this.isAtEnd() && this.peek().id === type
  }

  private isAtEnd() : boolean {
    return this.position >= this.tokens.length
  }

  private consume(type: TokenID, message: string) : Token {
    if(
      !this.isAtEnd() &&
      this.tokens[this.position].id == type
    ) {
      this.position++
      return this.tokens[this.position - 1]
    } else {
      throw new Error(message)
    }
  }

  private peek() : Token {
    return this.tokens[this.position]
  }
}
