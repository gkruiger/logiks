import { expect, test, beforeEach } from 'vitest'

import { Engine, Variable } from '../engine.ts'
import { SymbolsCountConstraint } from '../constraints/symbolsCountConstraint.ts'

const engine = new Engine()
const domainSingleSymbol = ['X', ' ']
const domainMultipleSymbols = ['X', 'Y', ' ']

beforeEach(() => {
  engine.reset()
})

test('Constraint with empty group', () => {
  expect(() => new SymbolsCountConstraint(engine, [], ['X'], 1)).toThrow()
})

test('Constraint with empty symbols', () => {
  expect(() => new SymbolsCountConstraint(engine, ['A'], [], 1)).toThrow()
})

test('Correct constraint', () => {
  expect(() => new SymbolsCountConstraint(engine, ['A'], ['X'], 1)).not.toThrow()
})

test('One symbol: X fills the spot', () => {
  const varA: Variable = {name: 'A', domain: Array.from(domainSingleSymbol)}
  const varB: Variable = {name: 'B', domain: Array.from(domainSingleSymbol)}
  const varC: Variable = {name: 'C', domain: Array.from(domainSingleSymbol)}

  const symbolsCountConstraint = new SymbolsCountConstraint(engine, [varA.name, varB.name, varC.name], ['X'], 1)

  const list = [varA, varB, varC]

  symbolsCountConstraint.setDomainForVariableInList({name: 'A', domain: [' ']}, list)
  symbolsCountConstraint.setDomainForVariableInList({name: 'C', domain: [' ']}, list)
  
  symbolsCountConstraint.applyForVariable('A', list)
  
  expect(varA.domain).toStrictEqual([' '])
  expect(varB.domain).toStrictEqual(['X'])
  expect(varC.domain).toStrictEqual([' '])
})

test('One symbol: All Xs removed', () => {
  const varA: Variable = {name: 'A', domain: Array.from(domainSingleSymbol)}
  const varB: Variable = {name: 'B', domain: Array.from(domainSingleSymbol)}
  const varC: Variable = {name: 'C', domain: Array.from(domainSingleSymbol)}

  const symbolsCountConstraint = new SymbolsCountConstraint(engine, [varA.name, varB.name, varC.name], ['X'], 1)

  const list = [varA, varB, varC]

  symbolsCountConstraint.setDomainForVariableInList({name: 'B', domain: ['X']}, list)
  
  symbolsCountConstraint.applyForVariable('B', list)
  
  expect(varA.domain).toStrictEqual([' '])
  expect(varB.domain).toStrictEqual(['X'])
  expect(varC.domain).toStrictEqual([' '])
})

test('Multiple symbols: Xs and Ys fill the spot', () => {
  const varA: Variable = {name: 'A', domain: Array.from(domainMultipleSymbols)}
  const varB: Variable = {name: 'B', domain: Array.from(domainMultipleSymbols)}
  const varC: Variable = {name: 'C', domain: Array.from(domainMultipleSymbols)}

  const symbolsCountConstraint = new SymbolsCountConstraint(engine, [varA.name, varB.name, varC.name], ['X', 'Y'], 1)

  const list = [varA, varB, varC]

  symbolsCountConstraint.setDomainForVariableInList({name: 'A', domain: [' ']}, list)
  symbolsCountConstraint.setDomainForVariableInList({name: 'C', domain: [' ']}, list)
  
  symbolsCountConstraint.applyForVariable('A', list)
  
  expect(varA.domain).toStrictEqual([' '])
  expect(varB.domain).toStrictEqual(['X', 'Y'])
  expect(varC.domain).toStrictEqual([' '])
})

test('Multiple symbols: All Xs and Ys removed if X', () => {
  const varA: Variable = {name: 'A', domain: Array.from(domainMultipleSymbols)}
  const varB: Variable = {name: 'B', domain: Array.from(domainMultipleSymbols)}
  const varC: Variable = {name: 'C', domain: Array.from(domainMultipleSymbols)}

  const symbolsCountConstraint = new SymbolsCountConstraint(engine, [varA.name, varB.name, varC.name], ['X', 'Y'], 1)

  const list = [varA, varB, varC]

  symbolsCountConstraint.setDomainForVariableInList({name: 'B', domain: ['X']}, list)

  symbolsCountConstraint.applyForVariable('B', list)

  expect(varA.domain).toStrictEqual([' '])
  expect(varB.domain).toStrictEqual(['X'])
  expect(varC.domain).toStrictEqual([' '])
})

test('Multiple symbols: All Xs and Ys removed if Y', () => {
  const varA: Variable = {name: 'A', domain: Array.from(domainMultipleSymbols)}
  const varB: Variable = {name: 'B', domain: Array.from(domainMultipleSymbols)}
  const varC: Variable = {name: 'C', domain: Array.from(domainMultipleSymbols)}

  const symbolsCountConstraint = new SymbolsCountConstraint(engine, [varA.name, varB.name, varC.name], ['X', 'Y'], 1)

  const list = [varA, varB, varC]

  symbolsCountConstraint.setDomainForVariableInList({name: 'B', domain: ['Y']}, list)

  symbolsCountConstraint.applyForVariable('B', list)

  expect(varA.domain).toStrictEqual([' '])
  expect(varB.domain).toStrictEqual(['Y'])
  expect(varC.domain).toStrictEqual([' '])
})

test('Multiple symbols: All Xs and Ys removed if X and Y', () => {
  const varA: Variable = {name: 'A', domain: Array.from(domainMultipleSymbols)}
  const varB: Variable = {name: 'B', domain: Array.from(domainMultipleSymbols)}
  const varC: Variable = {name: 'C', domain: Array.from(domainMultipleSymbols)}

  const symbolsCountConstraint = new SymbolsCountConstraint(engine, [varA.name, varB.name, varC.name], ['X', 'Y'], 1)

  const list = [varA, varB, varC]

  symbolsCountConstraint.setDomainForVariableInList({name: 'B', domain: ['X', 'Y']}, list)

  symbolsCountConstraint.applyForVariable('B', list)

  expect(varA.domain).toStrictEqual([' '])
  expect(varB.domain).toStrictEqual(['X', 'Y'])
  expect(varC.domain).toStrictEqual([' '])
})

