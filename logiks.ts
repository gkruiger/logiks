export class Interpreter {

  #engine: Engine
  #parser: Parser

  constructor() {
    this.#engine = new Engine()
    this.#parser = new Parser()
  }

  reset() : void {
    this.#engine.reset()
  }

  process(input: string[]) : string  {
    let output: string[] = []

    for(let i=0; i<input.length; i++) {

      let tokens = Tokenize(input[i])
      console.log(input[i], tokens.length)
      if(tokens.length == 0) continue 
      
      try{
        const ast = this.#parser.parse(tokens)

        if (ast.type === 'Fact') {
          this.#engine.addFact({
            subject: ast.subject.value,
            relation: ast.relation.value,
            object: ast.object.value
          })

           output.push('Ok.')
        }

        if (ast.type === 'Query') {
          let outputList: string[] = [] 

          const result = this.#engine.getMatchingFacts({
            subject: ast.subject.type === 'Wildcard' ? undefined : ast.subject.value,
            relation: ast.relation.type === 'Wildcard' ? undefined : ast.relation.value,
            object: ast.object.type === 'Wildcard' ? undefined : ast.object.value
          })

          const numberofWildcards =
            (ast.subject.type === 'Wildcard' ? 1 : 0) +
            (ast.relation.type === 'Wildcard' ? 1 : 0) +
            (ast.object.type === 'Wildcard' ? 1 : 0)
          
          if(numberofWildcards === 0) {
            output.push(result.length > 0 ? 'Yes.' : 'No.')
          } else {
              let wildcardSlot: 'subject' | 'relation' | 'object' | null = null

              if (ast.subject.type === 'Wildcard') wildcardSlot = 'subject'
              if (ast.relation.type === 'Wildcard') wildcardSlot = 'relation'
              if (ast.object.type === 'Wildcard') wildcardSlot = 'object'

              for(let fact of result) {           
              if(numberofWildcards == 1 && wildcardSlot != null) {           
                outputList.push(fact[wildcardSlot])
              }
              if(numberofWildcards >= 2) {
                outputList.push(`${fact.subject} - ${fact.relation} - ${fact.object}`) 
              }
            }

            outputList = [...new Set(outputList)]
            
            output.push(this.formatList(outputList))
          }

        }
      }  catch (e) {
        return `Error parsing line ${i + 1}: ${(e as Error).message}`
      }
    }

    return output.join('\n')
  }
 
  formatList(items: string[]) : string {
    if (items.length === 0) return 'No matches found.'
    if (items.length === 1) return items[0] + '.'
    if (items.length === 2) return `${items[0]} and ${items[1]}.`

    return (
      items.slice(0, -1).join(', ') +
      ' and ' +
      items[items.length - 1] +
      '.'
    )
  }
}

type ASTNode    = FactNode | QueryNode
type FactNode   = { type: 'Fact', subject: FactTerm, relation: FactTerm, object: FactTerm }
type FactTerm   = { type: 'FactTerm', value: string }
type QueryNode  = { type: 'Query', subject: QueryTerm, relation: QueryTerm, object: QueryTerm }
type QueryTerm  = { type: 'Wildcard' } | { type: 'QueryTerm', value: string }

type ParsedTerm = { type: 'Term', value: string } | { type: 'Wildcard' } | { type: 'Variable', value: string }

class Parser {
  private tokens: Token[] = []
  private position = 0

  parse(tokens: Token[]): ASTNode {
    this.tokens = tokens
    this.position = 0

    const statement = this.parseStatement()

    return statement
  }

  parseStatement() : ASTNode {
    const subject = this.parseFactOrQueryTerm('subject expected.')
    this.consume(TokenIDs.CONNECTOR, "'-' expected after subject.")

    const relation = this.parseFactOrQueryTerm(`relation expected after '-'.`)
    this.consume(TokenIDs.CONNECTOR, "'-' expected after relation.")

    const object = this.parseFactOrQueryTerm(`object expected after '-'.`)

    if(this.check(TokenIDs.DOT)) {
      this.consume(TokenIDs.DOT, `expected '.' after object.`)
      return this.parseFact(subject, relation, object)
    } else if(this.check(TokenIDs.QUESTION_MARK)) {
      this.consume(TokenIDs.QUESTION_MARK, `expected '?' after object.`)
      return this.parseQuery(subject, relation, object)
    } else {
      throw new Error(`expected '.', '!' or '?' after object.`)
    }
  }

  parseFactOrQueryTerm(message: string) : ParsedTerm {
    if (this.check(TokenIDs.STRING)) {
      const token = this.consume(TokenIDs.STRING, message)
      return { type: 'Term', value: token.value }      
    } else if (this.check(TokenIDs.STAR)) {
      this.consume(TokenIDs.STAR, "expected '*'.")
      return { type: 'Wildcard' }
    } else if (this.check(TokenIDs.SQUARE_BRACKET_OPEN)){
      this.consume(TokenIDs.SQUARE_BRACKET_OPEN, "expected '<'.")
      const token = this.consume(TokenIDs.STRING, 'expected varianble name after "<".')
      this.consume(TokenIDs.SQUARE_BRACKET_CLOSE, "expected '>'.")
      return { type: 'Variable', value: token.value }
    } else {
      throw new Error(message)
    }
  }

  parseFact(subject: ParsedTerm, relation: ParsedTerm, object: ParsedTerm) : FactNode {
    if (!this.isAtEnd()) {
      throw new Error('unexpected token after fact.')
    }
  
    if (
      subject.type == 'Wildcard' ||
      relation.type == 'Wildcard' ||
      object.type == 'Wildcard'
    ) throw new Error('wildcards are not allowed in facts.')

    if (
      subject.type == 'Variable' ||
      relation.type == 'Variable' ||
      object.type == 'Variable'
    ) throw new Error('variables are not allowed in facts.')

    return {
      type: 'Fact',
      subject: { type: 'FactTerm', value: subject.value },
      relation: { type: 'FactTerm', value: relation.value },
      object: { type: 'FactTerm', value: object.value }
    }  
  }

  parseQuery(subject: ParsedTerm, relation: ParsedTerm, object: ParsedTerm) : QueryNode {
    if (!this.isAtEnd()) {
      throw new Error('unexpected token after query.')
    }

    if (
      subject.type == 'Variable' ||
      relation.type == 'Variable' ||
      object.type == 'Variable'
    ) throw new Error('variables are not allowed in queries.')

    return {
      type: 'Query',
      subject: subject.type === 'Wildcard' ? { type: 'Wildcard' } : { type: 'QueryTerm', value: subject.value },
      relation: relation.type === 'Wildcard' ? { type: 'Wildcard' } : { type: 'QueryTerm', value: relation.value },
      object: object.type === 'Wildcard' ? { type: 'Wildcard' } : { type: 'QueryTerm', value: object.value }
    }
  }

  consume(type: TokenID, message: string) : Token {
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

  isAtEnd() : boolean {
    return this.position >= this.tokens.length
  }

  check(type: TokenID) : boolean {
    return !this.isAtEnd() && this.peek().id === type
  }

  peek() : Token {
    return this.tokens[this.position]
  }

}

type TokenID = typeof TokenIDs[keyof typeof TokenIDs]

type Token = {
  id: TokenID,
  value: string
}

const TokenIDs = {
  SPACE: 0,
  STRING: 1,
  CONNECTOR: 2,
  DOT: 3,
  QUESTION_MARK: 4,
  STAR: 5,
  SQUARE_BRACKET_OPEN: 6,
  SQUARE_BRACKET_CLOSE: 7,
} as const

function Tokenize(input: string) : Token[] {

  const processBuffer = () => {
    if(buffer.length > 0) {
      tokens.push({
        id: TokenIDs.STRING,
        value: buffer
      })
      buffer = ''
    }
  }

  let tokens: Token[] = []

  let buffer = ''
  for(let i=0; i<input.length; i++) {    
    if(input.charAt(i) === ' ') {
      processBuffer()
    } else if (input.charAt(i) === '-') {
      processBuffer()
      tokens.push({
        id: TokenIDs.CONNECTOR,
        value: '-'
      })
    } else if (input.charAt(i) === '.') {
      processBuffer()
      tokens.push({
        id: TokenIDs.DOT,
        value: '.'
      }) 
    } else if (input.charAt(i) === '?') {
      processBuffer()
      tokens.push({
        id: TokenIDs.QUESTION_MARK,
        value: '?'
      }) 
    } else if (input.charAt(i) === '*') {
      processBuffer()
      tokens.push({
        id: TokenIDs.STAR,
        value: '*'
      })
    } else if (input.charAt(i) === '<') {
      processBuffer()
      tokens.push({
        id: TokenIDs.SQUARE_BRACKET_OPEN,
        value: '*'
      })
    } else if (input.charAt(i) === '>') {
      processBuffer()
      tokens.push({
        id: TokenIDs.SQUARE_BRACKET_CLOSE,
        value: '*'
      })
    } else {
      buffer += input.charAt(i)
    }
  }
  processBuffer()

  return tokens
}

type Fact = {
  subject: string,
  relation: string,
  object: string  
}

type Query = {
  subject?: string,
  relation?: string,
  object?: string  
}

type Condition = {
  subject_variable: string,
  relation: string,
  object_variable: string  
}

type Consequence = {
  subject_variable: string,
  relation: string,
  object_variable: string  
}

type Rule = {
  condition: Condition,
  consequence: Consequence  
}

class Engine {

  facts: Fact[] = []
  rules: Rule[] = []

  constructor() {
    //
  }

  reset() : void {
    this.facts = []
    this.rules = []
  }
  
  addFact(fact: Fact) : void {
    this.facts.push({
      subject: fact.subject,
      relation: fact.relation,
      object: fact.object
    })
  }

  getMatchingFacts(query: Query, previousQueries: Query[] = []) : Fact[] {
    
    let results: Fact[] = []

    for(let possibleMatchingFact of this.facts) {
      if(
        (query.subject == undefined || query.subject == possibleMatchingFact.subject) &&
        (query.relation == undefined || query.relation == possibleMatchingFact.relation) &&
        (query.object == undefined || query.object == possibleMatchingFact.object)
      ) {
        results.push(possibleMatchingFact)
      } 
    }
    
    /*
    if(previousQueries.some(previousQuery => 
      query.subject == previousQuery.subject &&
      query.relation == previousQuery.relation &&
      query.object == previousQuery.object
    )) {
      return results      
    }

    let newPreviousQueries = [...previousQueries, query]
  
    for(let rule of this.rules) {
      if(
        rule.consequence.subject_variable &&
        rule.consequence.relation == query.relation &&
        rule.consequence.object_variable
      ) {
        if(this.getMatchingFacts({
          subject: query.object,
          relation: rule.condition.relation,
          object: query.subject
        }, newPreviousQueries).length > 0) {
          results.push({
            subject: query.subject ?? '',
            relation: rule.consequence.relation ?? '',
            object: query.object ?? ''
          })
        }
      }
    }
    */

    return results
  }

  /*
  addRule(condition: Condition, consequence: Consequence) : void {
    if(condition.subject_variable.length == 0) throw new Error('Subject variable of condition needs to be at least one character long.')
    if(condition.relation.length == 0) throw new Error('Relation of condition needs to be at least one character long.')
    if(condition.object_variable.length == 0) throw new Error('Object variable of condition needs to be at least one character long.')
    if(consequence.subject_variable.length == 0) throw new Error('Subject variable of consequence needs to be at least one character long.')
    if(consequence.relation.length == 0) throw new Error('Relation of consequence needs to be at least one character long.')
    if(consequence.object_variable.length == 0) throw new Error('Object variable of consequence needs to be at least one character long.')

    if(
      consequence.subject_variable != condition.object_variable &&
      consequence.subject_variable != condition.subject_variable
    ) {
      throw new Error('Subject variable of consequence is neither subject variable or object variable of condition.')
    }

    if(
      consequence.object_variable != condition.object_variable &&
      consequence.object_variable != condition.subject_variable
    ) {
      throw new Error('Object variable of consequence is neither subject variable or object variable of condition.')
    }

    this.rules.push({
      condition: {
        subject_variable: condition.subject_variable,
        relation: condition.relation,
        object_variable: condition.object_variable
      },
      consequence: {
        subject_variable: consequence.subject_variable,
        relation: consequence.relation,
        object_variable: consequence.object_variable
      }
    })
  }
  */
}