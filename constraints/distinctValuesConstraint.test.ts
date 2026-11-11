import { expect, test, describe } from 'vitest'

import { type Variable } from '../engine'
import { type ApplyForVariableResponse } from '../abstractConstraint'
import { DistinctValuesConstraint } from '../constraints/distinctValuesConstraint'

describe('Input validation', () => {

  test('Constraint with empty group', () => {
    expect(() => new DistinctValuesConstraint([])).toThrow()
  })

  test('Constraint with group with one element', () => {
    expect(() => new DistinctValuesConstraint(['A'])).toThrow()
  })

  test('Constraint with group with multiple elements', () => {
    expect(() => new DistinctValuesConstraint(['A', 'B'])).not.toThrow()
  })

})

describe('Applying the constraint', () => {

  test('Constraint is not applicable: variable not in group', () => {

    const domain = [1, 2, 3]
    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const list = [varA, varB, varC]
    const group = [varA.name, varB.name]
    const distinctValuesConstraint = new DistinctValuesConstraint(group)
    
    let reponse: ApplyForVariableResponse = { status: 'NOT_APPLICABLE' }
    expect(distinctValuesConstraint.applyForVariable(varC.name, list)).toStrictEqual(reponse)

    expect(distinctValuesConstraint.getVariableFromList('A', list).domain).toStrictEqual(domain)
    expect(distinctValuesConstraint.getVariableFromList('B', list).domain).toStrictEqual(domain)
    expect(distinctValuesConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
  })

  test('Constraint is applied - no changes: already filtered single value', () => {
    const domain = [1, 2, 3]
    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const list = [varA, varB, varC]
    const group = [varA.name, varB.name]
    const distinctValuesConstraint = new DistinctValuesConstraint(group)
    
    varA.domain = [1]
    varB.domain = [2]
    let reponse: ApplyForVariableResponse = { status: 'NO_CHANGES' }
    expect(distinctValuesConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

    expect(distinctValuesConstraint.getVariableFromList('A', list).domain).toStrictEqual([1])
    expect(distinctValuesConstraint.getVariableFromList('B', list).domain).toStrictEqual([2])
    expect(distinctValuesConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
  })

  test('Constraint is applied - no changes: variable has multiple values', () => {
    const domain = [1, 2, 3]
    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const list = [varA, varB, varC]
    const group = [varA.name, varB.name]
    const distinctValuesConstraint = new DistinctValuesConstraint(group)
    
    varA.domain = [1, 2]
    let reponse: ApplyForVariableResponse = { status: 'NO_CHANGES' }
    expect(distinctValuesConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

    expect(distinctValuesConstraint.getVariableFromList('A', list).domain).toStrictEqual([1, 2])
    expect(distinctValuesConstraint.getVariableFromList('B', list).domain).toStrictEqual(domain)
    expect(distinctValuesConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
  })

  test('Constraint is applied - changes: other variables have a filtered domain ', () => {
    const domain = [1, 2, 3]
    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const varD: Variable = {name: 'D', domain: Array.from(domain)}
    const list = [varA, varB, varC, varD]
    const group = [varA.name, varB.name, varC.name] 
    const distinctValuesConstraint = new DistinctValuesConstraint(group)
    
    varA.domain = [1]
    let reponse: ApplyForVariableResponse = { 
      status: 'CHANGES',
      affectedVariables: ['B', 'C'] 
    }
    expect(distinctValuesConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

    expect(distinctValuesConstraint.getVariableFromList('A', list).domain).toStrictEqual([1])
    expect(distinctValuesConstraint.getVariableFromList('B', list).domain).toStrictEqual([2, 3])
    expect(distinctValuesConstraint.getVariableFromList('C', list).domain).toStrictEqual([2, 3])
    expect(distinctValuesConstraint.getVariableFromList('D', list).domain).toStrictEqual(domain)
  })

  test('Constraint is applied - contradiction is found', () => {
    const domain = [1, 2, 3]
    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const list = [varA, varB, varC]
    const group = [varA.name, varB.name]
    const distinctValuesConstraint = new DistinctValuesConstraint(group)
    
    varA.domain = [1]
    varB.domain = [1]
    let reponse: ApplyForVariableResponse = { 
      status: 'CONTRADICTION',
    }
    expect(distinctValuesConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

    expect(distinctValuesConstraint.getVariableFromList('A', list).domain).toStrictEqual([1])
    expect(distinctValuesConstraint.getVariableFromList('B', list).domain).toStrictEqual([])
    expect(distinctValuesConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
  })

})
