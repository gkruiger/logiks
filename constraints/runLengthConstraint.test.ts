import { expect, test, beforeEach, describe } from 'vitest'

import { Engine, Variable } from '../engine.ts'
import { RunLengthConstraint } from '../constraints/runLengthConstraint.ts'
import { ApplyForVariableResponse } from '../abstractConstraint.ts'

const engine = new Engine()

beforeEach(() => {
  engine.reset()
})

describe('Input validation', () => {

  test('Constraint with empty group', () => {
    expect(() => new RunLengthConstraint([], 'X', [1])).toThrow()
  })

  test('Constraint with empty symbol', () => {
    expect(() => new RunLengthConstraint(['A', 'B'], '', [1])).toThrow()
  })

  test('Constraint without run lengths', () => {
    expect(() => new RunLengthConstraint(['A', 'B'], 'X', [])).toThrow()
  })

  test('Correct constraint', () => {
    expect(() => new RunLengthConstraint(['A', 'B'], 'X', [1])).not.toThrow()
  })

})

describe('Applying the constraint', () => {

  test('Constraint not applicable: variable not in group', () => {
    const domain = ['X', ' ']
    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const varD: Variable = {name: 'D', domain: Array.from(domain)}
    const list = [varA, varB, varC, varD]
    const group = [varA.name, varB.name, varC.name]
    const runLengthConstraint = new RunLengthConstraint(group, 'X', [1, 1])
    
    let reponse: ApplyForVariableResponse = { status: 'NOT_APPLICABLE' }
    expect(runLengthConstraint.applyForVariable(varD.name, list)).toStrictEqual(reponse)

    expect(runLengthConstraint.getVariableFromList('A', list).domain).toStrictEqual(domain)
    expect(runLengthConstraint.getVariableFromList('B', list).domain).toStrictEqual(domain)
    expect(runLengthConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
    expect(runLengthConstraint.getVariableFromList('D', list).domain).toStrictEqual(domain)
  })
  
  test('Constraint is applied - no changes: solution already found', () => {
    const domain = ['X', ' ']
    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const varD: Variable = {name: 'D', domain: Array.from(domain)}
    const list = [varA, varB, varC, varD]
    const group = [varA.name, varB.name, varC.name]
    const runLengthConstraint = new RunLengthConstraint(group, 'X', [1, 1])
    
    varA.domain = ['X']
    varB.domain = [' ']
    varC.domain = ['X']
    
    let reponse: ApplyForVariableResponse = { status: 'NO_CHANGES' }
    expect(runLengthConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

    expect(runLengthConstraint.getVariableFromList('A', list).domain).toStrictEqual(['X'])
    expect(runLengthConstraint.getVariableFromList('B', list).domain).toStrictEqual([' '])
    expect(runLengthConstraint.getVariableFromList('C', list).domain).toStrictEqual(['X'])
    expect(runLengthConstraint.getVariableFromList('D', list).domain).toStrictEqual(domain)    
  })

  test('Constraint is applied - no changes: not enough information', () => {
    const domain = ['X', ' ']
    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const varD: Variable = {name: 'D', domain: Array.from(domain)}
    const list = [varA, varB, varC, varD]
    const group = [varA.name, varB.name, varC.name]
    const runLengthConstraint = new RunLengthConstraint(group, 'X', [1])
    
    varB.domain = [' ']
    
    let reponse: ApplyForVariableResponse = { status: 'NO_CHANGES' }
    expect(runLengthConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

    expect(runLengthConstraint.getVariableFromList('A', list).domain).toStrictEqual(domain)
    expect(runLengthConstraint.getVariableFromList('B', list).domain).toStrictEqual([' '])
    expect(runLengthConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)  
  })

  test('Constraint is applied - changes: One solution', () => {
    const domain = ['X', ' ']
    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const varD: Variable = {name: 'D', domain: Array.from(domain)}
    const list = [varA, varB, varC, varD]
    const group = [varA.name, varB.name, varC.name]
    const runLengthConstraint = new RunLengthConstraint(group, 'X', [1, 1])
    
    let reponse: ApplyForVariableResponse = { 
      status: 'CHANGES',
      affectedVariables: ['A', 'B', 'C'] 
    }
    expect(runLengthConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

    expect(runLengthConstraint.getVariableFromList('A', list).domain).toStrictEqual(['X'])
    expect(runLengthConstraint.getVariableFromList('B', list).domain).toStrictEqual([' '])
    expect(runLengthConstraint.getVariableFromList('C', list).domain).toStrictEqual(['X'])
  })

  test('Constraint is applied - changes: Simple box', () => {
    const domain = ['X', ' ']
    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const varD: Variable = {name: 'D', domain: Array.from(domain)}
    const list = [varA, varB, varC, varD]
    const group = [varA.name, varB.name, varC.name]
    const runLengthConstraint = new RunLengthConstraint(group, 'X', [2])
    
    varA.domain = ['X']

    let reponse: ApplyForVariableResponse = { 
      status: 'CHANGES',
      affectedVariables: ['B', 'C'] 
    }
    expect(runLengthConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

    expect(runLengthConstraint.getVariableFromList('A', list).domain).toStrictEqual(['X'])
    expect(runLengthConstraint.getVariableFromList('B', list).domain).toStrictEqual(['X'])
    expect(runLengthConstraint.getVariableFromList('C', list).domain).toStrictEqual([' '])
  })

  test('Constraint is applied - changes: Simple cross', () => {
    const domain = ['X', ' ']
    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const varD: Variable = {name: 'D', domain: Array.from(domain)}
    const list = [varA, varB, varC, varD]
    const group = [varA.name, varB.name, varC.name]
    const runLengthConstraint = new RunLengthConstraint(group, 'X', [2])
    
    let reponse: ApplyForVariableResponse = { 
      status: 'CHANGES',
      affectedVariables: ['B'] 
    }
    expect(runLengthConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

    expect(runLengthConstraint.getVariableFromList('A', list).domain).toStrictEqual(domain)
    expect(runLengthConstraint.getVariableFromList('B', list).domain).toStrictEqual(['X'])
    expect(runLengthConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
  })

  test('Constraint is applied - changes: Overlapping', () => {
    const domain = ['X', ' ']
    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const varD: Variable = {name: 'D', domain: Array.from(domain)}
    const varE: Variable = {name: 'E', domain: Array.from(domain)}
    const list = [varA, varB, varC, varD, varE]
    const group = [varA.name, varB.name, varC.name, varD.name]
    const runLengthConstraint = new RunLengthConstraint(group, 'X', [3])
    
    let reponse: ApplyForVariableResponse = { 
      status: 'CHANGES',
      affectedVariables: ['B', 'C'] 
    }
    expect(runLengthConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

    expect(runLengthConstraint.getVariableFromList('A', list).domain).toStrictEqual(domain)
    expect(runLengthConstraint.getVariableFromList('B', list).domain).toStrictEqual(['X'])
    expect(runLengthConstraint.getVariableFromList('C', list).domain).toStrictEqual(['X'])
    expect(runLengthConstraint.getVariableFromList('D', list).domain).toStrictEqual(domain)
    expect(runLengthConstraint.getVariableFromList('E', list).domain).toStrictEqual(domain)
  })  

  test('Constraint is applied - changes: Spreading', () => {
    const domain = ['X', ' ']
    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const varD: Variable = {name: 'D', domain: Array.from(domain)}
    const varE: Variable = {name: 'E', domain: Array.from(domain)}
    const list = [varA, varB, varC, varD, varE]
    const group = [varA.name, varB.name, varC.name, varD.name]
    const runLengthConstraint = new RunLengthConstraint(group, 'X', [3])
    
    varB.domain = ['X']

    let reponse: ApplyForVariableResponse = { 
      status: 'CHANGES',
      affectedVariables: ['C'] 
    }
    expect(runLengthConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

    expect(runLengthConstraint.getVariableFromList('A', list).domain).toStrictEqual(domain)
    expect(runLengthConstraint.getVariableFromList('B', list).domain).toStrictEqual(['X'])
    expect(runLengthConstraint.getVariableFromList('C', list).domain).toStrictEqual(['X'])
    expect(runLengthConstraint.getVariableFromList('D', list).domain).toStrictEqual(domain)
    expect(runLengthConstraint.getVariableFromList('E', list).domain).toStrictEqual(domain)
  })
  
  test('Constraint is applied - changes: Forcing', () => {
    const domain = ['X', ' ']
    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const varD: Variable = {name: 'D', domain: Array.from(domain)}
    const varE: Variable = {name: 'E', domain: Array.from(domain)}
    const list = [varA, varB, varC, varD, varE]
    const group = [varA.name, varB.name, varC.name, varD.name]
    const runLengthConstraint = new RunLengthConstraint(group, 'X', [2])
    
    varC.domain = [' ']
    varE.domain = [' ']

    let reponse: ApplyForVariableResponse = { 
      status: 'CHANGES',
      affectedVariables: ['A', 'B', 'D'] 
    }
    expect(runLengthConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

    expect(runLengthConstraint.getVariableFromList('A', list).domain).toStrictEqual(['X'])
    expect(runLengthConstraint.getVariableFromList('B', list).domain).toStrictEqual(['X'])
    expect(runLengthConstraint.getVariableFromList('C', list).domain).toStrictEqual([' '])
    expect(runLengthConstraint.getVariableFromList('D', list).domain).toStrictEqual([' '])
    expect(runLengthConstraint.getVariableFromList('E', list).domain).toStrictEqual([' '])
  })

  test('Constraint is applied - changes: Join', () => {
    const domain = ['X', ' ']
    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const varD: Variable = {name: 'D', domain: Array.from(domain)}
    const varE: Variable = {name: 'E', domain: Array.from(domain)}
    const list = [varA, varB, varC, varD, varE]
    const group = [varA.name, varB.name, varC.name, varD.name]
    const runLengthConstraint = new RunLengthConstraint(group, 'X', [3])
    
    varB.domain = ['X']
    varD.domain = ['X']

    let reponse: ApplyForVariableResponse = { 
      status: 'CHANGES',
      affectedVariables: ['A', 'C'] 
    }
    expect(runLengthConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

    expect(runLengthConstraint.getVariableFromList('A', list).domain).toStrictEqual([' '])
    expect(runLengthConstraint.getVariableFromList('B', list).domain).toStrictEqual(['X'])
    expect(runLengthConstraint.getVariableFromList('C', list).domain).toStrictEqual(['X'])
    expect(runLengthConstraint.getVariableFromList('D', list).domain).toStrictEqual(['X'])
    expect(runLengthConstraint.getVariableFromList('E', list).domain).toStrictEqual(['X', ' '])
  })

  test('Constraint is applied - changes: Split', () => {
    const domain = ['X', ' ']
    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const varD: Variable = {name: 'D', domain: Array.from(domain)}
    const varE: Variable = {name: 'E', domain: Array.from(domain)}
    const varF: Variable = {name: 'F', domain: Array.from(domain)}
    const varG: Variable = {name: 'G', domain: Array.from(domain)}
    const list = [varA, varB, varC, varD, varE, varF, varG]
    const group = [varA.name, varB.name, varC.name, varD.name, varE.name, varF.name, varG.name]
    const runLengthConstraint = new RunLengthConstraint(group, 'X', [2, 2])
    
    varC.domain = ['X']
    varE.domain = ['X']

    let reponse: ApplyForVariableResponse = { 
      status: 'CHANGES',
      affectedVariables: ['A', 'B', 'D', 'F', 'G'] 
    }
    expect(runLengthConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

    expect(runLengthConstraint.getVariableFromList('A', list).domain).toStrictEqual([' '])
    expect(runLengthConstraint.getVariableFromList('B', list).domain).toStrictEqual(['X'])
    expect(runLengthConstraint.getVariableFromList('C', list).domain).toStrictEqual(['X'])
    expect(runLengthConstraint.getVariableFromList('D', list).domain).toStrictEqual([' '])
    expect(runLengthConstraint.getVariableFromList('E', list).domain).toStrictEqual(['X'])
    expect(runLengthConstraint.getVariableFromList('F', list).domain).toStrictEqual(['X'])
    expect(runLengthConstraint.getVariableFromList('G', list).domain).toStrictEqual([' '])
  })

  test('Constraint is applied - contradiction is found', () => {
    const domain = ['X', ' ']
    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const list = [varA, varB, varC]
    const group = [varA.name, varB.name, varC.name]
    const runLengthConstraint = new RunLengthConstraint(group, 'X', [1, 1])
    
    varB.domain = ['X']

    let reponse: ApplyForVariableResponse = { status: 'CONTRADICTION' }
    expect(runLengthConstraint.applyForVariable(varB.name, list)).toStrictEqual(reponse)

    expect(runLengthConstraint.getVariableFromList('A', list).domain).toStrictEqual(domain)
    expect(runLengthConstraint.getVariableFromList('B', list).domain).toStrictEqual(['X'])
    expect(runLengthConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
  })

})