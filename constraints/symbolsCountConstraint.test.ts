import { expect, test, beforeEach, describe } from 'vitest'

import { Engine, Variable } from '../engine.ts'
import { SymbolsCountConstraint } from '../constraints/symbolsCountConstraint.ts'
import { ApplyForVariableResponse } from '../abstractConstraint.ts'

const engine = new Engine()
const domainSingleSymbol = ['X', ' ']
const domainMultipleSymbols = ['X', 'Y', ' ']

beforeEach(() => {
  engine.reset()
})

describe('Input validation', () => {

  test('Constraint with empty group', () => {
    expect(() => new SymbolsCountConstraint([], ['X'], 1)).toThrow()
  })

  test('Constraint with empty symbols', () => {
    expect(() => new SymbolsCountConstraint(['A'], [], 1)).toThrow()
  })

  test('Correct constraint', () => {
    expect(() => new SymbolsCountConstraint(['A'], ['X'], 1)).not.toThrow()
  })

})

describe('Applying the constraint', () => {

  test('Constraint not applicable: variable not in group', () => {
    const varA: Variable = {name: 'A', domain: Array.from(domainSingleSymbol)}
    const varB: Variable = {name: 'B', domain: Array.from(domainSingleSymbol)}
    const varC: Variable = {name: 'C', domain: Array.from(domainSingleSymbol)}
    const varD: Variable = {name: 'D', domain: Array.from(domainSingleSymbol)}
    const list = [varA, varB, varC, varD]
    const group = [varA.name, varB.name, varC.name]
    const runLengthConstraint = new SymbolsCountConstraint(group, ['X'], 1)
    
    let reponse: ApplyForVariableResponse = { status: 'NOT_APPLICABLE' }
    expect(runLengthConstraint.applyForVariable(varD.name, list)).toStrictEqual(reponse)

    expect(runLengthConstraint.getVariableFromList('A', list).domain).toStrictEqual(domainSingleSymbol)
    expect(runLengthConstraint.getVariableFromList('B', list).domain).toStrictEqual(domainSingleSymbol)
    expect(runLengthConstraint.getVariableFromList('C', list).domain).toStrictEqual(domainSingleSymbol)
    expect(runLengthConstraint.getVariableFromList('D', list).domain).toStrictEqual(domainSingleSymbol)    
  })

  test('Constraint is applied - no changes: solution already found', () => {
    const varA: Variable = {name: 'A', domain: Array.from(domainSingleSymbol)}
    const varB: Variable = {name: 'B', domain: Array.from(domainSingleSymbol)}
    const varC: Variable = {name: 'C', domain: Array.from(domainSingleSymbol)}
    const varD: Variable = {name: 'D', domain: Array.from(domainSingleSymbol)}
    const list = [varA, varB, varC, varD]
    const group = [varA.name, varB.name, varC.name]
    const runLengthConstraint = new SymbolsCountConstraint(group, ['X'], 1)
    
    varA.domain = [' ']
    varB.domain = ['X']
    varC.domain = [' ']
    let reponse: ApplyForVariableResponse = { status: 'NO_CHANGES' }
    expect(runLengthConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

    expect(runLengthConstraint.getVariableFromList('A', list).domain).toStrictEqual([' '])
    expect(runLengthConstraint.getVariableFromList('B', list).domain).toStrictEqual(['X'])
    expect(runLengthConstraint.getVariableFromList('C', list).domain).toStrictEqual([' '])
    expect(runLengthConstraint.getVariableFromList('D', list).domain).toStrictEqual(domainSingleSymbol)    
  })

  test('Constraint is applied - no changes: not enough information', () => {
    const varA: Variable = {name: 'A', domain: Array.from(domainSingleSymbol)}
    const varB: Variable = {name: 'B', domain: Array.from(domainSingleSymbol)}
    const varC: Variable = {name: 'C', domain: Array.from(domainSingleSymbol)}
    const varD: Variable = {name: 'D', domain: Array.from(domainSingleSymbol)}
    const list = [varA, varB, varC, varD]
    const group = [varA.name, varB.name, varC.name]
    const runLengthConstraint = new SymbolsCountConstraint(group, ['X'], 1)
    
    varA.domain = [' ']
    let reponse: ApplyForVariableResponse = { status: 'NO_CHANGES' }
    expect(runLengthConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

    expect(runLengthConstraint.getVariableFromList('A', list).domain).toStrictEqual([' '])
    expect(runLengthConstraint.getVariableFromList('B', list).domain).toStrictEqual(domainSingleSymbol)
    expect(runLengthConstraint.getVariableFromList('C', list).domain).toStrictEqual(domainSingleSymbol)
    expect(runLengthConstraint.getVariableFromList('D', list).domain).toStrictEqual(domainSingleSymbol)   
  })

  describe('', () => {
    
    test('Constraint is applied - changes: One symbol: X fills the spot', () => {
      const varA: Variable = {name: 'A', domain: Array.from(domainSingleSymbol)}
      const varB: Variable = {name: 'B', domain: Array.from(domainSingleSymbol)}
      const varC: Variable = {name: 'C', domain: Array.from(domainSingleSymbol)}
      const varD: Variable = {name: 'D', domain: Array.from(domainSingleSymbol)}
      const list = [varA, varB, varC, varD]
      const group = [varA.name, varB.name, varC.name]
      const runLengthConstraint = new SymbolsCountConstraint(group, ['X'], 1)
      
      varA.domain = [' ']
      varC.domain = [' ']
      let reponse: ApplyForVariableResponse = { 
        status: 'CHANGES',
        affectedVariables: ['B']
      }
      expect(runLengthConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

      expect(runLengthConstraint.getVariableFromList('A', list).domain).toStrictEqual([' '])
      expect(runLengthConstraint.getVariableFromList('B', list).domain).toStrictEqual(['X'])
      expect(runLengthConstraint.getVariableFromList('C', list).domain).toStrictEqual([' '])
      expect(runLengthConstraint.getVariableFromList('D', list).domain).toStrictEqual(domainSingleSymbol)   
    })

    test('Constraint is applied - changes: One symbol: All Xs removed', () => {
      const varA: Variable = {name: 'A', domain: Array.from(domainSingleSymbol)}
      const varB: Variable = {name: 'B', domain: Array.from(domainSingleSymbol)}
      const varC: Variable = {name: 'C', domain: Array.from(domainSingleSymbol)}
      const varD: Variable = {name: 'D', domain: Array.from(domainSingleSymbol)}
      const list = [varA, varB, varC, varD]
      const group = [varA.name, varB.name, varC.name]
      const runLengthConstraint = new SymbolsCountConstraint(group, ['X'], 1)
      
      varB.domain = ['X']
      let reponse: ApplyForVariableResponse = { 
        status: 'CHANGES',
        affectedVariables: ['A', 'C']
      }
      expect(runLengthConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

      expect(runLengthConstraint.getVariableFromList('A', list).domain).toStrictEqual([' '])
      expect(runLengthConstraint.getVariableFromList('B', list).domain).toStrictEqual(['X'])
      expect(runLengthConstraint.getVariableFromList('C', list).domain).toStrictEqual([' '])
      expect(runLengthConstraint.getVariableFromList('D', list).domain).toStrictEqual(domainSingleSymbol)   
    })

    test('Constraint is applied - changes: Multiple symbols: Xs and Ys fill the spot', () => {
      const varA: Variable = {name: 'A', domain: Array.from(domainMultipleSymbols)}
      const varB: Variable = {name: 'B', domain: Array.from(domainMultipleSymbols)}
      const varC: Variable = {name: 'C', domain: Array.from(domainMultipleSymbols)}
      const varD: Variable = {name: 'D', domain: Array.from(domainMultipleSymbols)}
      const list = [varA, varB, varC, varD]
      const group = [varA.name, varB.name, varC.name]
      const runLengthConstraint = new SymbolsCountConstraint(group, ['X','Y'], 1)
      
      varA.domain = [' ']
      varC.domain = [' ']
      let reponse: ApplyForVariableResponse = { 
        status: 'CHANGES',
        affectedVariables: ['B']
      }
      expect(runLengthConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

      expect(runLengthConstraint.getVariableFromList('A', list).domain).toStrictEqual([' '])
      expect(runLengthConstraint.getVariableFromList('B', list).domain).toStrictEqual(['X', 'Y'])
      expect(runLengthConstraint.getVariableFromList('C', list).domain).toStrictEqual([' '])
      expect(runLengthConstraint.getVariableFromList('D', list).domain).toStrictEqual(domainMultipleSymbols)   
    })

    test('Constraint is applied - changes: Multiple symbols: All Xs and Ys removed if X', () => {
      const varA: Variable = {name: 'A', domain: Array.from(domainMultipleSymbols)}
      const varB: Variable = {name: 'B', domain: Array.from(domainMultipleSymbols)}
      const varC: Variable = {name: 'C', domain: Array.from(domainMultipleSymbols)}
      const varD: Variable = {name: 'D', domain: Array.from(domainMultipleSymbols)}
      const list = [varA, varB, varC, varD]
      const group = [varA.name, varB.name, varC.name]
      const runLengthConstraint = new SymbolsCountConstraint(group, ['X','Y'], 1)
      
      varB.domain = ['X']
      let reponse: ApplyForVariableResponse = { 
        status: 'CHANGES',
        affectedVariables: ['A', 'C']
      }
      expect(runLengthConstraint.applyForVariable(varB.name, list)).toStrictEqual(reponse)

      expect(runLengthConstraint.getVariableFromList('A', list).domain).toStrictEqual([' '])
      expect(runLengthConstraint.getVariableFromList('B', list).domain).toStrictEqual(['X'])
      expect(runLengthConstraint.getVariableFromList('C', list).domain).toStrictEqual([' '])
      expect(runLengthConstraint.getVariableFromList('D', list).domain).toStrictEqual(domainMultipleSymbols)   
    })

    test('Constraint is applied - changes: Multiple symbols: All Xs and Ys removed if Y', () => {
      const varA: Variable = {name: 'A', domain: Array.from(domainMultipleSymbols)}
      const varB: Variable = {name: 'B', domain: Array.from(domainMultipleSymbols)}
      const varC: Variable = {name: 'C', domain: Array.from(domainMultipleSymbols)}
      const varD: Variable = {name: 'D', domain: Array.from(domainMultipleSymbols)}
      const list = [varA, varB, varC, varD]
      const group = [varA.name, varB.name, varC.name]
      const runLengthConstraint = new SymbolsCountConstraint(group, ['X','Y'], 1)
      
      varB.domain = ['Y']
      let reponse: ApplyForVariableResponse = { 
        status: 'CHANGES',
        affectedVariables: ['A', 'C']
      }
      expect(runLengthConstraint.applyForVariable(varB.name, list)).toStrictEqual(reponse)

      expect(runLengthConstraint.getVariableFromList('A', list).domain).toStrictEqual([' '])
      expect(runLengthConstraint.getVariableFromList('B', list).domain).toStrictEqual(['Y'])
      expect(runLengthConstraint.getVariableFromList('C', list).domain).toStrictEqual([' '])
      expect(runLengthConstraint.getVariableFromList('D', list).domain).toStrictEqual(domainMultipleSymbols)   
    })

    test('Constraint is applied - changes: Multiple symbols: All Xs and Ys removed if X and Y', () => {
      const varA: Variable = {name: 'A', domain: Array.from(domainMultipleSymbols)}
      const varB: Variable = {name: 'B', domain: Array.from(domainMultipleSymbols)}
      const varC: Variable = {name: 'C', domain: Array.from(domainMultipleSymbols)}
      const varD: Variable = {name: 'D', domain: Array.from(domainMultipleSymbols)}
      const list = [varA, varB, varC, varD]
      const group = [varA.name, varB.name, varC.name]
      const runLengthConstraint = new SymbolsCountConstraint(group, ['X','Y'], 1)
      
      varB.domain = ['X', 'Y']
      let reponse: ApplyForVariableResponse = { 
        status: 'CHANGES',
        affectedVariables: ['A', 'C']
      }
      expect(runLengthConstraint.applyForVariable(varB.name, list)).toStrictEqual(reponse)

      expect(runLengthConstraint.getVariableFromList('A', list).domain).toStrictEqual([' '])
      expect(runLengthConstraint.getVariableFromList('B', list).domain).toStrictEqual(['X', 'Y'])
      expect(runLengthConstraint.getVariableFromList('C', list).domain).toStrictEqual([' '])
      expect(runLengthConstraint.getVariableFromList('D', list).domain).toStrictEqual(domainMultipleSymbols)   
    })

    test('Constraint is applied - contradiction is found: actual count > count', () => {
      const varA: Variable = {name: 'A', domain: Array.from(domainMultipleSymbols)}
      const varB: Variable = {name: 'B', domain: Array.from(domainMultipleSymbols)}
      const varC: Variable = {name: 'C', domain: Array.from(domainMultipleSymbols)}
      const varD: Variable = {name: 'D', domain: Array.from(domainMultipleSymbols)}
      const list = [varA, varB, varC, varD]
      const group = [varA.name, varB.name, varC.name]
      const runLengthConstraint = new SymbolsCountConstraint(group, ['X','Y'], 1)
      
      varA.domain = ['X']
      varB.domain = ['X', 'Y']
      let reponse: ApplyForVariableResponse = { status: 'CONTRADICTION' }
      expect(runLengthConstraint.applyForVariable(varB.name, list)).toStrictEqual(reponse)

      expect(runLengthConstraint.getVariableFromList('A', list).domain).toStrictEqual(['X'])
      expect(runLengthConstraint.getVariableFromList('B', list).domain).toStrictEqual(['X', 'Y'])
      expect(runLengthConstraint.getVariableFromList('C', list).domain).toStrictEqual(domainMultipleSymbols)
      expect(runLengthConstraint.getVariableFromList('D', list).domain).toStrictEqual(domainMultipleSymbols)   
    })

    test('Constraint is applied - contradiction is found: actual count + undecided < actual count', () => {
      const varA: Variable = {name: 'A', domain: Array.from(domainMultipleSymbols)}
      const varB: Variable = {name: 'B', domain: Array.from(domainMultipleSymbols)}
      const varC: Variable = {name: 'C', domain: Array.from(domainMultipleSymbols)}
      const varD: Variable = {name: 'D', domain: Array.from(domainMultipleSymbols)}
      const list = [varA, varB, varC, varD]
      const group = [varA.name, varB.name, varC.name]
      const runLengthConstraint = new SymbolsCountConstraint(group, ['X','Y'], 3)
      
      varA.domain = [' ']
      varB.domain = ['X', 'Y']
      let reponse: ApplyForVariableResponse = { status: 'CONTRADICTION' }
      expect(runLengthConstraint.applyForVariable(varB.name, list)).toStrictEqual(reponse)

      expect(runLengthConstraint.getVariableFromList('A', list).domain).toStrictEqual([' '])
      expect(runLengthConstraint.getVariableFromList('B', list).domain).toStrictEqual(['X', 'Y'])
      expect(runLengthConstraint.getVariableFromList('C', list).domain).toStrictEqual(domainMultipleSymbols)
      expect(runLengthConstraint.getVariableFromList('D', list).domain).toStrictEqual(domainMultipleSymbols)   
    })
    
  })

})