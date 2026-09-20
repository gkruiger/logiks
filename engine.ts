import { Tokenizer } from "./tokenizer.ts"
import { Parser } from "./parser.ts"
import { 
  type StatementNode, 
  type FormulaNode, 
  type NullableBoolean, 
  NullableBooleans, 
  TruthTables,
  BinaryOperators
} from "./types.ts"

export class Engine {
  
  statements: StatementNode[] = []
  
  constructor() {
    //
  }

  process(input: string | string[]) : NullableBoolean | NullableBoolean[]{

    let inputAsArray = []    

    if(typeof input === 'string') {
      inputAsArray.push(input)
    } else {
      inputAsArray.push(...input)
    }

    let result: NullableBoolean[] = []

    for(const i of inputAsArray) {
      const tokens = new Tokenizer().tokenize(i)
      const parsedNodes = new Parser().parse(tokens)

      for(const parseResult of parsedNodes) {
        if(parseResult.type === 'statement') {
          if(this.statementIsConsistent(parseResult)) {
            this.statements.push(parseResult)
          } else {
            throw new Error('Statement not consistent with previous statements.')
          }
        }
        
        if(parseResult.type === 'query') {
          result.push(this.evaluateFormula(parseResult.formula))
        }
      }
    }

    if(result.length === 0) { return }
    if(result.length === 1) { return result[0]}
    if(result.length > 1) {return result}
  } 

  private statementIsConsistent(statement: StatementNode) : boolean {
    const evaluatedTruthValue = this.evaluateFormula(statement.formula)

    const isConsistent = !(
      (evaluatedTruthValue == NullableBooleans.TRUE && statement.truthValue != NullableBooleans.TRUE) ||
      (evaluatedTruthValue == NullableBooleans.FALSE && statement.truthValue != NullableBooleans.FALSE)
    )

    return isConsistent!  
  }

  private evaluateFormula(formula: FormulaNode) : NullableBoolean {
    const existingStatement = this.getStatementByFormula(formula)
    
    if(existingStatement) {
      return existingStatement.truthValue
    }

    if(
      formula.type === BinaryOperators.xor ||
      formula.type === BinaryOperators.and
    ) {
      return this.getTruthFromTruthTable(formula.type, this.evaluateFormula(formula.left), this.evaluateFormula(formula.right))
    } 

    if(formula.type === 'variable') {
      return this.getTruthByBackwardsChaining(formula.variable)
    }

    return NullableBooleans.UNKNOWN
  }

  private getTruthByBackwardsChaining(variable: string) : NullableBoolean {
    for (const statement of this.statements) {
      
      if(statement.formula.type === 'variable') {
        continue
      } 

      if(
        statement.formula.type === BinaryOperators.xor ||
        statement.formula.type === BinaryOperators.and
      ) {

        const formula = statement.formula

        let matchLeft = formula.left.type === 'variable' && formula.left.variable === variable
        let matchRight = formula.right.type === 'variable' && formula.right.variable === variable

        if(matchLeft || matchRight) {  
          const truthTable = TruthTables.find(row => 
            row.operator === statement.formula.type
          )?.table

          if(truthTable === undefined) {
            throw new Error('Operator not supported by truth table.')
          }

          const situation = truthTable.filter(row =>
            (
              (matchLeft && row.right === this.evaluateFormula(formula.right)) ||
              (matchRight && row.left === this.evaluateFormula(formula.left))
            ) &&
            row.result == statement.truthValue
          )

          if(situation.length == 1) {
            if(matchLeft) return situation[0].left
            if(matchRight) return situation[0].right
          }

          return undefined    
        }
      }
    }

    return undefined
  }

  private getTruthFromTruthTable(operator: string, left: NullableBoolean, right: NullableBoolean) : NullableBoolean {    
    const truthTable = TruthTables.find(row => 
      row.operator === operator
    )?.table

    if(truthTable === undefined) {
      throw new Error('Operator not supported by truth table.')
    }

    const situation = truthTable.find(row =>
      row.left === left &&
      row.right === right
    )

    if(situation === undefined) {
      throw new Error('Specific situation not supported by truth table.')
    }

    return situation.result
  }

  private getStatementByFormula(formula: FormulaNode) : StatementNode | undefined {
    for (const statement of this.statements) {   
      if(this.formulasAreTheSame(formula, statement.formula)) return statement
    }

    return undefined
  }

  private formulasAreTheSame(formulaA: FormulaNode, formulaB: FormulaNode) : boolean {
    if(formulaA.type === 'variable' && formulaB.type === 'variable') {
      if(formulaA.variable === formulaB.variable) return true        
    }

    if(
      (formulaA.type === BinaryOperators.xor && formulaB.type === BinaryOperators.xor) ||
      (formulaA.type === BinaryOperators.and && formulaB.type === BinaryOperators.and) 
    ) {
      if((
        this.formulasAreTheSame(formulaA.left, formulaB.left) &&
        this.formulasAreTheSame(formulaA.right, formulaB.right)
      ) || (
        this.formulasAreTheSame(formulaA.left, formulaB.right) &&
        this.formulasAreTheSame(formulaA.right, formulaB.left)
      )) return true
    }

    return false
  }

  printStatements() : void {
    console.log('Statements:')
    for (const statement of this.statements) {
      if(statement.formula.type === 'variable') {
        console.log(`  ${statement.formula.variable} = ${statement.truthValue}`)
      }
    }
  }

  reset() {
    this.statements = []
  }
}