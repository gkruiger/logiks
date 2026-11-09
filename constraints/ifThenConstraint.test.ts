import { expect, test, beforeEach } from 'vitest'

import { Engine, Variable } from '../engine.ts'
import { IfThenConstraint } from './ifThenConstraint.ts'

const engine = new Engine()
let ifThenConstraint =  new IfThenConstraint(
  engine, 
  [{type: 'variableIsEqualTo', variable: 'A', value: 'C'}], 
  [{type: 'setDomain', variable: 'B', domain: ['Q']}]
)

beforeEach(() => {
  engine.reset()
})

test('Constraint with empty conditions', () => {
  expect(() => new IfThenConstraint(
    engine, 
    [], 
    [{type: 'setDomain', variable: 'B', domain: ['Q']}])
  ).toThrow()
})

test('Constraint with empty consequences', () => {
  expect(() => new IfThenConstraint(
    engine, 
    [{type: 'variableIsEqualTo', variable: 'A', value: 'C'}], 
    [])
  ).toThrow()
})

test('Correct constraint', () => {
  expect(() => new IfThenConstraint(
    engine, 
    [{type: 'variableIsEqualTo', variable: 'A', value: 'C'}], 
    [{type: 'setDomain', variable: 'B', domain: ['Q']}])
  ).not.toThrow()
})

test('Correct constraint', () => {
  const varA: Variable = {name: 'A', domain: ['1', '2', '3']}
  const varB: Variable = {name: 'B', domain: ['1', '2', '3']}

  ifThenConstraint = new IfThenConstraint(
    engine, 
    [{type: 'variableIsEqualTo', variable: 'A', value: '1'}], 
    [{type: 'setDomain', variable: 'B', domain: ['3']}]
  )  

  const list = [varA, varB]
  ifThenConstraint.setDomainForVariableInList({name: 'A', domain: ['1']}, list)
  ifThenConstraint.applyForVariable('A', list)

  expect(ifThenConstraint.getVariableFromList('B', list).domain).toStrictEqual(['3'])

})
