import { expect, test, beforeEach } from 'vitest'

import { Engine, Variable } from '../engine.ts'
import { RunLengthConstraint } from '../constraints/RunLengthConstraint.ts'

const engine = new Engine()
const domain = ['X', ' ']

beforeEach(() => {
  engine.reset()
})

test('Constraint with empty group', () => {
  expect(() => new RunLengthConstraint(engine, [], 'X', [1])).toThrow()
})

test('Constraint with empty symbol', () => {
  expect(() => new RunLengthConstraint(engine, ['A', 'B'], '', [1])).toThrow()
})

test('Constraint without run lengths', () => {
  expect(() => new RunLengthConstraint(engine, ['A', 'B'], 'X', [])).toThrow()
})

test('Correct constraint', () => {
  expect(() => new RunLengthConstraint(engine, ['A', 'B'], 'X', [1])).not.toThrow()
})

test('One solution', () => {
  const varA: Variable = {name: 'A', domain: Array.from(domain)}
  const varB: Variable = {name: 'B', domain: Array.from(domain)}
  const varC: Variable = {name: 'C', domain: Array.from(domain)}

  const runLengthConstraint = new RunLengthConstraint(engine, [varA.name, varB.name, varC.name], 'X', [1, 1])

  const list = [varA, varB, varC]
  
  runLengthConstraint.applyForVariable('A', list)
  
  expect(varA.domain).toStrictEqual(['X'])
  expect(varB.domain).toStrictEqual([' '])
  expect(varC.domain).toStrictEqual(['X'])
})

test('Simple box', () => {
  const varA: Variable = {name: 'A', domain: Array.from(domain)}
  const varB: Variable = {name: 'B', domain: Array.from(domain)}
  const varC: Variable = {name: 'C', domain: Array.from(domain)}

  const runLengthConstraint = new RunLengthConstraint(engine, [varA.name, varB.name, varC.name], 'X', [2])

  const list = [varA, varB, varC]
  runLengthConstraint.setDomainForVariableInList({name: 'A', domain: ['X',]}, list)
  
  runLengthConstraint.applyForVariable('A', list)
  
  expect(varA.domain).toStrictEqual(['X'])
  expect(varB.domain).toStrictEqual(['X'])
  expect(varC.domain).toStrictEqual([' '])
})

test('Simple cross', () => {
  const varA: Variable = {name: 'A', domain: Array.from(domain)}
  const varB: Variable = {name: 'B', domain: Array.from(domain)}
  const varC: Variable = {name: 'C', domain: Array.from(domain)}
  const varD: Variable = {name: 'D', domain: Array.from(domain)}

  const runLengthConstraint = new RunLengthConstraint(engine, [varA.name, varB.name, varC.name, varD.name], 'X', [2])

  const list = [varA, varB, varC, varD]
  runLengthConstraint.setDomainForVariableInList({name: 'B', domain: ['X',]}, list)
  
  runLengthConstraint.applyForVariable('B', list)
  
  expect(varA.domain).toStrictEqual(['X', ' '])
  expect(varB.domain).toStrictEqual(['X'])
  expect(varC.domain).toStrictEqual(['X', ' '])
  expect(varD.domain).toStrictEqual([' '])
})

test('Overlapping', () => {
  const varA: Variable = {name: 'A', domain: Array.from(domain)}
  const varB: Variable = {name: 'B', domain: Array.from(domain)}
  const varC: Variable = {name: 'C', domain: Array.from(domain)}
  const varD: Variable = {name: 'D', domain: Array.from(domain)}

  const runLengthConstraint = new RunLengthConstraint(engine, [varA.name, varB.name, varC.name, varD.name], 'X', [3])

  const list = [varA, varB, varC, varD]
  
  runLengthConstraint.applyForVariable('A', list)
  
  expect(varA.domain).toStrictEqual(['X', ' '])
  expect(varB.domain).toStrictEqual(['X'])
  expect(varC.domain).toStrictEqual(['X'])
  expect(varD.domain).toStrictEqual(['X', ' '])
})

test('Spreading', () => {
  const varA: Variable = {name: 'A', domain: Array.from(domain)}
  const varB: Variable = {name: 'B', domain: Array.from(domain)}
  const varC: Variable = {name: 'C', domain: Array.from(domain)}
  const varD: Variable = {name: 'D', domain: Array.from(domain)}
  const varE: Variable = {name: 'E', domain: Array.from(domain)}

  const runLengthConstraint = new RunLengthConstraint(engine, [varA.name, varB.name, varC.name, varD.name, varE.name], 'X', [3])

  const list = [varA, varB, varC, varD, varE]
  runLengthConstraint.setDomainForVariableInList({name: 'B', domain: ['X',]}, list)

  runLengthConstraint.applyForVariable('B', list)
  
  expect(varA.domain).toStrictEqual(['X', ' '])
  expect(varB.domain).toStrictEqual(['X'])
  expect(varC.domain).toStrictEqual(['X'])
  expect(varD.domain).toStrictEqual(['X', ' '])
  expect(varE.domain).toStrictEqual([' '])
})

test('Forcing', () => {
  const varA: Variable = {name: 'A', domain: Array.from(domain)}
  const varB: Variable = {name: 'B', domain: Array.from(domain)}
  const varC: Variable = {name: 'C', domain: Array.from(domain)}
  const varD: Variable = {name: 'D', domain: Array.from(domain)}
  const varE: Variable = {name: 'E', domain: Array.from(domain)}

  const runLengthConstraint = new RunLengthConstraint(engine, [varA.name, varB.name, varC.name, varD.name, varE.name], 'X', [2])

  const list = [varA, varB, varC, varD, varE]
  runLengthConstraint.setDomainForVariableInList({name: 'C', domain: [' ']}, list)
  runLengthConstraint.setDomainForVariableInList({name: 'E', domain: [' ']}, list)

  runLengthConstraint.applyForVariable('C', list)
  
  expect(varA.domain).toStrictEqual(['X'])
  expect(varB.domain).toStrictEqual(['X'])
  expect(varC.domain).toStrictEqual([' '])
  expect(varD.domain).toStrictEqual([' '])
  expect(varE.domain).toStrictEqual([' '])
})

test('Join', () => {
  const varA: Variable = {name: 'A', domain: Array.from(domain)}
  const varB: Variable = {name: 'B', domain: Array.from(domain)}
  const varC: Variable = {name: 'C', domain: Array.from(domain)}
  const varD: Variable = {name: 'D', domain: Array.from(domain)}
  const varE: Variable = {name: 'E', domain: Array.from(domain)}

  const runLengthConstraint = new RunLengthConstraint(engine, [varA.name, varB.name, varC.name, varD.name, varE.name], 'X', [3])

  const list = [varA, varB, varC, varD, varE]
  runLengthConstraint.setDomainForVariableInList({name: 'B', domain: ['X']}, list)
  runLengthConstraint.setDomainForVariableInList({name: 'D', domain: ['X']}, list)

  runLengthConstraint.applyForVariable('C', list)
  
  expect(varA.domain).toStrictEqual([' '])
  expect(varB.domain).toStrictEqual(['X'])
  expect(varC.domain).toStrictEqual(['X'])
  expect(varD.domain).toStrictEqual(['X'])
  expect(varE.domain).toStrictEqual([' '])
})

test('Split', () => {
  const varA: Variable = {name: 'A', domain: Array.from(domain)}
  const varB: Variable = {name: 'B', domain: Array.from(domain)}
  const varC: Variable = {name: 'C', domain: Array.from(domain)}
  const varD: Variable = {name: 'D', domain: Array.from(domain)}
  const varE: Variable = {name: 'E', domain: Array.from(domain)}

  const runLengthConstraint = new RunLengthConstraint(engine, [varA.name, varB.name, varC.name, varD.name, varE.name], 'X', [2, 2])

  const list = [varA, varB, varC, varD, varE]
  runLengthConstraint.setDomainForVariableInList({name: 'B', domain: ['X']}, list)
  runLengthConstraint.setDomainForVariableInList({name: 'D', domain: ['X']}, list)

  runLengthConstraint.applyForVariable('C', list)
  
  expect(varA.domain).toStrictEqual(['X'])
  expect(varB.domain).toStrictEqual(['X'])
  expect(varC.domain).toStrictEqual([' '])
  expect(varD.domain).toStrictEqual(['X'])
  expect(varE.domain).toStrictEqual(['X'])
})
