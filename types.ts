export const TokenIDs = {
  NEWLINE: -2,
  DOT: -1,
  SPACE: 0,
  VARIABLE: 1,
  EQUALS_SIGN: 2,
  TRUE: 3,
  FALSE: 4,
  UNKNOWN: 5,
  QUESTION_MARK: 6,
  EXCLAMATION_MARK: 7,
  XOR: 8,
  AND: 9,
  OR: 10,
  NOT: 11,
  IMP: 12,
  EQU: 13
} as const

export type TokenID = typeof TokenIDs[keyof typeof TokenIDs]

type TokenWithoutDefault = {
  id: TokenID,
  value: string,
  ignore: boolean,
  canBePartOfString: boolean,
}

export type Token = TokenWithoutDefault & {
  default: boolean
}

const nonDefaultTokens: TokenWithoutDefault[] = [
  {id: TokenIDs.NEWLINE, value: '\n', ignore: false, canBePartOfString: false},
  {id: TokenIDs.DOT, value: '.', ignore: false, canBePartOfString: false},
  {id: TokenIDs.SPACE, value: ' ', ignore: true, canBePartOfString: false},
  {id: TokenIDs.EQUALS_SIGN, value: '=', ignore: false, canBePartOfString: false},
  {id: TokenIDs.TRUE, value: 'TRUE', ignore: false, canBePartOfString: true},
  {id: TokenIDs.TRUE, value: 'T', ignore: false, canBePartOfString: true},
  {id: TokenIDs.FALSE, value: 'FALSE', ignore: false, canBePartOfString: true},
  {id: TokenIDs.FALSE, value: 'F', ignore: false, canBePartOfString: true},
  {id: TokenIDs.UNKNOWN, value: 'UNKNOWN', ignore: false, canBePartOfString: true},
  {id: TokenIDs.UNKNOWN, value: 'U', ignore: false, canBePartOfString: true},
  {id: TokenIDs.QUESTION_MARK, value: '?', ignore: false, canBePartOfString: false},
  {id: TokenIDs.XOR, value: 'XOR', ignore: false, canBePartOfString: true},
  {id: TokenIDs.AND, value: 'AND', ignore: false, canBePartOfString: true},
  {id: TokenIDs.OR, value: 'OR', ignore: false, canBePartOfString: true},
  {id: TokenIDs.NOT, value: 'NOT', ignore: false, canBePartOfString: true},
  {id: TokenIDs.IMP, value: 'IMP', ignore: false, canBePartOfString: true},
  {id: TokenIDs.EQU, value: 'EQU', ignore: false, canBePartOfString: true}  
]

const defaultToken: TokenWithoutDefault = 
 {id: TokenIDs.VARIABLE, value: '', ignore: false, canBePartOfString: false}

export const Tokens: Token[] = [
  ...nonDefaultTokens.map(nonDefaultToken => ({
    ...nonDefaultToken,
    default: false
  })), {
    ...defaultToken,
    default: true
  }
]

export const NullableBooleans = {
  TRUE: true,
  FALSE: false,
  UNKNOWN: undefined, 
} as const

export type NullableBoolean = typeof NullableBooleans[keyof typeof NullableBooleans]

export type ASTNode = StatementNode | QueryNode

export type StatementNode = {type: 'statement', formula: FormulaNode, truthValue: boolean}
export type QueryNode = {type: 'query', formula: FormulaNode}

export type FormulaNode = 
  | VariableNode
  | XORNode
  | NotNode
  | AndNode
  | OrNode
  | ImplicationNode
  | EquivalenceNode

export type VariableNode = {type: 'variable', variable: string}
export type XORNode = {type: 'xor', left: FormulaNode, right: FormulaNode}
export type AndNode = {type: 'and', left: FormulaNode, right: FormulaNode}
export type OrNode = {type: 'or', left: FormulaNode, right: FormulaNode}
export type NotNode = {type: 'not', formula: FormulaNode}
export type ImplicationNode = {type: 'imp', left: FormulaNode, right: FormulaNode}
export type EquivalenceNode = {type: 'equ', left: FormulaNode, right: FormulaNode}

export const BinaryOperators = {
  xor: 'xor',
  and: 'and',
  or: 'or',
  not: 'not',
  imp: 'imp',
  equ: 'equ'
} as const

export type BinaryOperator = typeof BinaryOperators[keyof typeof BinaryOperators]

export const TruthTables : {
  operator: BinaryOperator, 
  table: { 
    left: NullableBoolean, 
    right?: NullableBoolean, 
    result: NullableBoolean
  }[] 
}[] = [{
  operator: BinaryOperators.xor,
  table: [
    { left: NullableBooleans.TRUE, right: NullableBooleans.TRUE, result: NullableBooleans.FALSE },    
    { left: NullableBooleans.TRUE, right: NullableBooleans.FALSE, result: NullableBooleans.TRUE },
    { left: NullableBooleans.TRUE, right: NullableBooleans.UNKNOWN, result: NullableBooleans.UNKNOWN },
    { left: NullableBooleans.FALSE, right: NullableBooleans.TRUE, result: NullableBooleans.TRUE },    
    { left: NullableBooleans.FALSE, right: NullableBooleans.FALSE, result: NullableBooleans.FALSE },
    { left: NullableBooleans.FALSE, right: NullableBooleans.UNKNOWN, result: NullableBooleans.UNKNOWN },
    { left: NullableBooleans.UNKNOWN, right: NullableBooleans.TRUE, result: NullableBooleans.UNKNOWN },    
    { left: NullableBooleans.UNKNOWN, right: NullableBooleans.FALSE, result: NullableBooleans.UNKNOWN },
    { left: NullableBooleans.UNKNOWN, right: NullableBooleans.UNKNOWN, result: NullableBooleans.UNKNOWN },
  ]
}, {
  operator: BinaryOperators.and,
  table: [
    { left: NullableBooleans.TRUE, right: NullableBooleans.TRUE, result: NullableBooleans.TRUE },    
    { left: NullableBooleans.TRUE, right: NullableBooleans.FALSE, result: NullableBooleans.FALSE },
    { left: NullableBooleans.TRUE, right: NullableBooleans.UNKNOWN, result: NullableBooleans.UNKNOWN },
    { left: NullableBooleans.FALSE, right: NullableBooleans.TRUE, result: NullableBooleans.FALSE },    
    { left: NullableBooleans.FALSE, right: NullableBooleans.FALSE, result: NullableBooleans.FALSE },
    { left: NullableBooleans.FALSE, right: NullableBooleans.UNKNOWN, result: NullableBooleans.FALSE },
    { left: NullableBooleans.UNKNOWN, right: NullableBooleans.TRUE, result: NullableBooleans.UNKNOWN },    
    { left: NullableBooleans.UNKNOWN, right: NullableBooleans.FALSE, result: NullableBooleans.FALSE },
    { left: NullableBooleans.UNKNOWN, right: NullableBooleans.UNKNOWN, result: NullableBooleans.UNKNOWN },
  ]
}]