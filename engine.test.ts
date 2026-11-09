import { expect, describe, test, beforeEach } from 'vitest'

import { Engine, Variable } from './engine.ts'
import { AbstractConstraint } from './abstractConstraint.ts'

describe(`Engine`, () => {
  
  const engine = new Engine()

  beforeEach(() => {
    engine.reset()
  })

  test('Add variable', () => {
    // No domain
    expect(() => engine.addVariable({name: 'A', domain: []})).toThrow()  

    // Domain with a single element
    expect(engine.addVariable({name: 'B', domain: [0]})).toBe(undefined)  
    expect(engine.addVariable({name: 'C', domain: [true]})).toBe(undefined)  
    expect(engine.addVariable({name: 'D', domain: ['red']})).toBe(undefined)

    // Domain with multiple elements
    expect(engine.addVariable({name: 'E', domain: [1, 8, 3]})).toBe(undefined)  
    expect(engine.addVariable({name: 'F', domain: [true, false]})).toBe(undefined)  
    expect(engine.addVariable({name: 'G', domain: ['red', 'green']})).toBe(undefined)
    
    // Mixed domain
    expect(engine.addVariable({name: 'H', domain: [0, true, 'red']})).toBe(undefined)
  
    // Adding existing variable
    expect(engine.addVariable({name: 'I', domain: [123]})).toBe(undefined)
    expect(() => engine.addVariable({name: 'I', domain: [123]})).toThrow()
  })

  test('Get variable', () => {
    // No variable with that name
    expect(() => engine.getDomain('C')).toThrow()

    // Known variable
    expect(engine.addVariable({name: 'A', domain: ['1', '2', '3']})).toBe(undefined)
    expect(engine.getDomain('A')).toStrictEqual(['1', '2', '3'])
  })

  test('Add constraint', () => {
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

    expect(engine.addConstraint(new TestConstraint())).toBe(undefined)
  })

  test('Solve', () => {
    engine.addVariable({name: 'A', domain: ['1', 2, true]})
    engine.solve()

    expect(engine.getDomain('A')).toStrictEqual(['1'])
  })

})