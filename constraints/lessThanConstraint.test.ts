import { expect, test, describe } from 'vitest'

import { type Variable } from '../engine'
import { type ApplyForVariableResponse } from '../abstractConstraint'
import { LessThanConstraint } from '../constraints/lessThanConstraint'

describe('Input validation', () => {

  test('Constraint with missing left side variable', () => {
    expect(() => new LessThanConstraint('', 'B')).toThrow()
  })

  test('Constraint with missing left side variable', () => {
    expect(() => new LessThanConstraint('A', '')).toThrow()
  })

  test('Constraint with both left and right side variable', () => {
    expect(() => new LessThanConstraint('A', 'B')).not.toThrow()
  })

})

describe('Applying the constraint', () => {

  test('Constraint is not applicable: Left side variable has a domain with non-numbers', () => {
    const domain = [1, 2, 3]
    const varA: Variable = {name: 'A', domain: Array.from(['1', '2', 'three'])}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const list = [varA, varB, varC]
    const lessThanConstraint = new LessThanConstraint('A', 'B')
    
    let reponse: ApplyForVariableResponse = { status: 'NOT_APPLICABLE' }
    expect(lessThanConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)
  })

  test('Constraint is not applicable: Right side variable has a domain with non-numbers', () => {
    const domain = [1, 2, 3]
    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(['1', '2', 'three'])}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const list = [varA, varB, varC]
    const lessThanConstraint = new LessThanConstraint('A', 'B')
    
    let reponse: ApplyForVariableResponse = { status: 'NOT_APPLICABLE' }
    expect(lessThanConstraint.applyForVariable(varB.name, list)).toStrictEqual(reponse)
  })

  test('Constraint is not applicable: Variable is neither the left or the right side variable', () => {
    const domain = [1, 2, 3]
    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const list = [varA, varB, varC]
    const lessThanConstraint = new LessThanConstraint('A', 'B')
    
    let reponse: ApplyForVariableResponse = { status: 'NOT_APPLICABLE' }
    expect(lessThanConstraint.applyForVariable(varC.name, list)).toStrictEqual(reponse)
  })

})

test('Constraint is applied - no changes, left and right single value', () => {
    const domain = [1, 2, 3]
    const varA: Variable = {name: 'A', domain: Array.from([1])}
    const varB: Variable = {name: 'B', domain: Array.from([2])}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const list = [varA, varB, varC]
    const lessThanConstraint = new LessThanConstraint('A', 'B')
    
    let reponse: ApplyForVariableResponse = { status: 'NO_CHANGES' }
    expect(lessThanConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)
})

test('Constraint is applied - no changes, left and right multiple values', () => {
    const domain = [1, 2, 3]
    const varA: Variable = {name: 'A', domain: Array.from([1, 2])}
    const varB: Variable = {name: 'B', domain: Array.from([2, 3])}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const list = [varA, varB, varC]
    const lessThanConstraint = new LessThanConstraint('A', 'B')
    
    let reponse: ApplyForVariableResponse = { status: 'NO_CHANGES' }
    expect(lessThanConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)
})

test('Constraint is applied - no changes, left single value, right multiple', () => {
    const domain = [1, 2, 3]
    const varA: Variable = {name: 'A', domain: Array.from([1, 2])}
    const varB: Variable = {name: 'B', domain: Array.from([3])}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const list = [varA, varB, varC]
    const lessThanConstraint = new LessThanConstraint('A', 'B')
    
    let reponse: ApplyForVariableResponse = { status: 'NO_CHANGES' }
    expect(lessThanConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)
})

test('Constraint is applied - no changes, left multiple value, right single', () => {
    const domain = [1, 2, 3]
    const varA: Variable = {name: 'A', domain: Array.from([1])}
    const varB: Variable = {name: 'B', domain: Array.from([2, 3])}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const list = [varA, varB, varC]
    const lessThanConstraint = new LessThanConstraint('A', 'B')
    
    let reponse: ApplyForVariableResponse = { status: 'NO_CHANGES' }
    expect(lessThanConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)
})