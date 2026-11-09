import { expect, test, beforeEach } from 'vitest'

import { Engine, Variable } from '../engine.ts'
import { LessThanConstraint } from '../constraints/lessThanConstraint.ts'

const engine = new Engine()
const domain = [1, 2, 3]
const varA: Variable = {name: 'A', domain: Array.from(domain)}
const varB: Variable = {name: 'B', domain: Array.from(domain)}
const varC: Variable = {name: 'C', domain: Array.from(domain)}
engine.addVariable(varA)
engine.addVariable(varB)
engine.addVariable(varC)
const list = [varA, varB, varC]
let lessThanConstraint = new LessThanConstraint(engine, varA.name, varB.name)

beforeEach(() => {
  engine.reset()

  engine.addVariable(varA)
  engine.addVariable(varB)
  engine.addVariable(varC)

  lessThanConstraint = new LessThanConstraint(engine, varA.name, varB.name)

  lessThanConstraint.setDomainForVariableInList({name: 'A', domain: domain}, list)
  lessThanConstraint.setDomainForVariableInList({name: 'B', domain: domain}, list)
  lessThanConstraint.setDomainForVariableInList({name: 'C', domain: domain}, list)
})

test('Constraint with empty group', () => {
  expect(() => lessThanConstraint = new LessThanConstraint(engine, '', '')).toThrow()
})

test('Constraint with group with one element', () => {
  expect(() => lessThanConstraint = new LessThanConstraint(engine, varA.name, '')).toThrow()
})

test('Constraint with group with multiple elements', () => {
  expect(() => new LessThanConstraint(engine, varA.name, varB.name)).not.toThrow()
})

test('Variable not in group is ignored', () => {
  expect(lessThanConstraint.applyForVariable('X', list)).toStrictEqual({
    affectedVariables: [],
    solutionStillPossible: true
  })

  expect(lessThanConstraint.getVariableFromList('A', list).domain).toStrictEqual(domain)
  expect(lessThanConstraint.getVariableFromList('B', list).domain).toStrictEqual(domain)
  expect(lessThanConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
})

test('Variable A with single value', () => {
  lessThanConstraint.setDomainForVariableInList({name: 'A', domain: [2]}, list)
  expect(lessThanConstraint.applyForVariable('A', list)).toStrictEqual({
    affectedVariables: ['B'],
    solutionStillPossible: true
  })

  expect(lessThanConstraint.getVariableFromList('A', list).domain).toStrictEqual([2])
  expect(lessThanConstraint.getVariableFromList('B', list).domain).toStrictEqual([3])
  expect(lessThanConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
})

test('Variable A with multiple values', () => {
  expect(lessThanConstraint.applyForVariable('A', list)).toStrictEqual({
    affectedVariables: ['B', 'A'],
    solutionStillPossible: true
  })

  expect(lessThanConstraint.getVariableFromList('A', list).domain).toStrictEqual([1, 2])
  expect(lessThanConstraint.getVariableFromList('B', list).domain).toStrictEqual([2, 3])
  expect(lessThanConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
})

test('Variable B with single value', () => {
  lessThanConstraint.setDomainForVariableInList({name: 'B', domain: [3]}, list)
  expect(lessThanConstraint.applyForVariable('A', list)).toStrictEqual({
    affectedVariables: ['A'],
    solutionStillPossible: true
  })

  expect(lessThanConstraint.getVariableFromList('A', list).domain).toStrictEqual([1, 2])
  expect(lessThanConstraint.getVariableFromList('B', list).domain).toStrictEqual([3])
  expect(lessThanConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
})

test('Variable B with multiple values', () => {
  expect(lessThanConstraint.applyForVariable('B', list)).toStrictEqual({
    affectedVariables: ['A', 'B'],
    solutionStillPossible: true
  })

  expect(lessThanConstraint.getVariableFromList('A', list).domain).toStrictEqual([1, 2])
  expect(lessThanConstraint.getVariableFromList('B', list).domain).toStrictEqual([2, 3])
  expect(lessThanConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
})

