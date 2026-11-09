import { expect, test, beforeEach } from 'vitest'

import { Engine, Variable } from './engine.ts'
import { AbstractConstraint } from './abstractConstraint.ts'

const engine = new Engine()

class TestConstraint extends AbstractConstraint {
  constructor() {
    super()
  }

  applyForVariable(variableName: string, variables: Variable[]): { solutionStillPossible: boolean; affectedVariables: string[] } {
    return {
      solutionStillPossible: true,
      affectedVariables: []
    }
  }
}

let testConstraint = new TestConstraint()

beforeEach(() => {
  engine.reset()
})

test('Get Variable From List', () => {
  const varA: Variable = {name: 'A', domain: ['1']}
  const varB: Variable = {name: 'B', domain: ['1', '2']}
  const varC: Variable = {name: 'C', domain: ['1', '2', '3']}

  const list = [varA, varB, varC]

  testConstraint = new TestConstraint()

  // Unknown variable
  expect(() => testConstraint.getVariableFromList('X', list)).toThrow()
  
  // Known variable
  expect(testConstraint.getVariableFromList('B', list)).toStrictEqual({name: 'B', domain: ['1', '2']})
})

test('Set Domain For Variable In List', () => {
  const varA: Variable = {name: 'A', domain: ['1']}
  const varB: Variable = {name: 'B', domain: ['1', '2']}
  const varC: Variable = {name: 'C', domain: ['1', '2', '3']}

  const list = [varA, varB, varC]

  testConstraint = new TestConstraint()

  // Unknown variable
  expect(() => testConstraint.setDomainForVariableInList({name: 'X', domain: ['2']}, list)).toThrow()
  
  // Known variable
  expect(testConstraint.setDomainForVariableInList({name: 'B', domain: ['2']}, list)).toBe(undefined)
  expect(testConstraint.getVariableFromList('B', list)).toStrictEqual({name: 'B', domain: ['2']})
})



