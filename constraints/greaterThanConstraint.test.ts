import { expect, test, beforeEach } from 'vitest'

import { Engine, Variable } from '../engine.ts'
import { GreaterThanConstraint } from '../constraints/GreaterThanConstraint.ts'

const engine = new Engine()
const domain = [1, 2, 3]
const varA: Variable = {name: 'A', domain: Array.from(domain)}
const varB: Variable = {name: 'B', domain: Array.from(domain)}
const varC: Variable = {name: 'C', domain: Array.from(domain)}
engine.addVariable(varA)
engine.addVariable(varB)
engine.addVariable(varC)
const list = [varA, varB, varC]
let greaterThanConstraint = new GreaterThanConstraint(engine, varA.name, varB.name)

beforeEach(() => {
  engine.reset()

  engine.addVariable(varA)
  engine.addVariable(varB)
  engine.addVariable(varC)

  greaterThanConstraint = new GreaterThanConstraint(engine, varA.name, varB.name)

  greaterThanConstraint.setDomainForVariableInList({name: 'A', domain: domain}, list)
  greaterThanConstraint.setDomainForVariableInList({name: 'B', domain: domain}, list)
  greaterThanConstraint.setDomainForVariableInList({name: 'C', domain: domain}, list)
})

test('Constraint with empty group', () => {
  expect(() => greaterThanConstraint = new GreaterThanConstraint(engine, '', '')).toThrow()
})

test('Constraint with group with one element', () => {
  expect(() => greaterThanConstraint = new GreaterThanConstraint(engine, varA.name, '')).toThrow()
})

test('Constraint with group with multiple elements', () => {
  expect(() => new GreaterThanConstraint(engine, varA.name, varB.name)).not.toThrow()
})

test('Variable not in group is ignored', () => {
  expect(greaterThanConstraint.applyForVariable('X', list)).toStrictEqual({
    affectedVariables: [],
    solutionStillPossible: true
  })

  expect(greaterThanConstraint.getVariableFromList('A', list).domain).toStrictEqual(domain)
  expect(greaterThanConstraint.getVariableFromList('B', list).domain).toStrictEqual(domain)
  expect(greaterThanConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
})

test('Variable A with single value', () => {
  greaterThanConstraint.setDomainForVariableInList({name: 'A', domain: [3]}, list)
  expect(greaterThanConstraint.applyForVariable('A', list)).toStrictEqual({
    affectedVariables: ['B'],
    solutionStillPossible: true
  })

  expect(greaterThanConstraint.getVariableFromList('A', list).domain).toStrictEqual([3])
  expect(greaterThanConstraint.getVariableFromList('B', list).domain).toStrictEqual([1, 2])
  expect(greaterThanConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
})

test('Variable A with multiple values', () => {
  expect(greaterThanConstraint.applyForVariable('A', list)).toStrictEqual({
    affectedVariables: ['B', 'A'],
    solutionStillPossible: true
  })

  expect(greaterThanConstraint.getVariableFromList('A', list).domain).toStrictEqual([2, 3])
  expect(greaterThanConstraint.getVariableFromList('B', list).domain).toStrictEqual([1, 2])
  expect(greaterThanConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
})

test('Variable B with single value', () => {
  greaterThanConstraint.setDomainForVariableInList({name: 'B', domain: [1]}, list)
  expect(greaterThanConstraint.applyForVariable('A', list)).toStrictEqual({
    affectedVariables: ['A'],
    solutionStillPossible: true
  })

  expect(greaterThanConstraint.getVariableFromList('A', list).domain).toStrictEqual([2, 3])
  expect(greaterThanConstraint.getVariableFromList('B', list).domain).toStrictEqual([1])
  expect(greaterThanConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
})

test('Variable B with multiple values', () => {
  expect(greaterThanConstraint.applyForVariable('B', list)).toStrictEqual({
    affectedVariables: ['A', 'B'],
    solutionStillPossible: true
  })

  expect(greaterThanConstraint.getVariableFromList('A', list).domain).toStrictEqual([2, 3])
  expect(greaterThanConstraint.getVariableFromList('B', list).domain).toStrictEqual([1, 2])
  expect(greaterThanConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
})

