import { expect, test, beforeEach, describe } from 'vitest'

import { Engine, Variable } from '../engine.ts'
import { DistinctValuesConstraint } from '../constraints/DistinctValuesConstraint.ts'

const engine = new Engine()


beforeEach(() => {
  engine.reset()
})

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

  test('Variable not in group is ignored', () => {

    const domain = [1, 2, 3]
    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    engine.addVariable(varA)
    engine.addVariable(varB)
    engine.addVariable(varC)
    const list = [varA, varB, varC]
    const group = [varA.name, varB.name]
    const distinctValuesConstraint = new DistinctValuesConstraint(group)
    
    expect(distinctValuesConstraint.applyForVariable(varC.name, list)).toStrictEqual({status: 'NOT_APPLICABLE'})

    expect(distinctValuesConstraint.getVariableFromList('A', list).domain).toStrictEqual(domain)
    expect(distinctValuesConstraint.getVariableFromList('B', list).domain).toStrictEqual(domain)
    expect(distinctValuesConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
  })



  /*

  test('Variable without single value is ignored', () => {
    const distinctValuesConstraint = new DistinctValuesConstraint(group)
    expect(distinctValuesConstraint.applyForVariable('A', list)).toStrictEqual({
      affectedVariables: [],
      solutionStillPossible: true
    })

    expect(distinctValuesConstraint.getVariableFromList('A', list).domain).toStrictEqual(domain)
    expect(distinctValuesConstraint.getVariableFromList('B', list).domain).toStrictEqual(domain)
    expect(distinctValuesConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
    expect(distinctValuesConstraint.getVariableFromList('D', list).domain).toStrictEqual(domain)
    expect(distinctValuesConstraint.getVariableFromList('E', list).domain).toStrictEqual(domain)
  })

  test('Value is filtered for the rest of the group', () => {
    const distinctValuesConstraint = new DistinctValuesConstraint(group)
    distinctValuesConstraint.setDomainForVariableInList({name: 'A', domain: [1]}, list)

    expect(distinctValuesConstraint.applyForVariable('A', list)).toStrictEqual({
      solutionStillPossible: true,
      affectedVariables: ['B', 'C']
    })

    expect(distinctValuesConstraint.getVariableFromList('A', list).domain).toStrictEqual([1])
    expect(distinctValuesConstraint.getVariableFromList('B', list).domain).toStrictEqual([2, 3])
    expect(distinctValuesConstraint.getVariableFromList('C', list).domain).toStrictEqual([2, 3])
    expect(distinctValuesConstraint.getVariableFromList('D', list).domain).toStrictEqual(domain)
    expect(distinctValuesConstraint.getVariableFromList('E', list).domain).toStrictEqual(domain)
  })

  test('Value is already filtered for the rest of the group', () => {
    const distinctValuesConstraint = new DistinctValuesConstraint(group)
    distinctValuesConstraint.setDomainForVariableInList({name: 'A', domain: [1]}, list)
    distinctValuesConstraint.setDomainForVariableInList({name: 'B', domain: [2, 3]}, list)
    distinctValuesConstraint.setDomainForVariableInList({name: 'C', domain: [2, 3]}, list)

    expect(distinctValuesConstraint.applyForVariable('A', list)).toStrictEqual({
      solutionStillPossible: true,
      affectedVariables: []
    })

    expect(distinctValuesConstraint.getVariableFromList('A', list).domain).toStrictEqual([1])
    expect(distinctValuesConstraint.getVariableFromList('B', list).domain).toStrictEqual([2, 3])
    expect(distinctValuesConstraint.getVariableFromList('C', list).domain).toStrictEqual([2, 3])
    expect(distinctValuesConstraint.getVariableFromList('D', list).domain).toStrictEqual(domain)
    expect(distinctValuesConstraint.getVariableFromList('E', list).domain).toStrictEqual(domain)
  })

  test('Domain empty: No solution possible: ', () => {
    const distinctValuesConstraint = new DistinctValuesConstraint(group)
    distinctValuesConstraint.setDomainForVariableInList({name: 'A', domain: [1]}, list)
    distinctValuesConstraint.setDomainForVariableInList({name: 'B', domain: [2]}, list)
    distinctValuesConstraint.setDomainForVariableInList({name: 'C', domain: [1]}, list)

    expect(distinctValuesConstraint.applyForVariable('A', list)).toStrictEqual({
      solutionStillPossible: false,
      affectedVariables: []
    })
  })
    */

})
