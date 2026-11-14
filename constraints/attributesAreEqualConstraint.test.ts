import { expect, test, describe } from 'vitest'

import { type Variable } from '../engine'
import { type ApplyForVariableResponse } from '../abstractConstraint'
import { type LookupTable, AttributesAreEqualConstraint } from './attributesAreEqualConstraint'

describe('Input validation', () => {

  test('Constraint with empty variable - left side', () => {
    expect(() => new AttributesAreEqualConstraint('', 'X', 'B', 'Y', [{variable: 'X', attribute: '1', value: true}])).toThrow()
  })

  test('Constraint with empty atribute - left side', () => {
    expect(() => new AttributesAreEqualConstraint('A', '', 'B', 'Y', [{variable: 'X', attribute: '1', value: true}])).toThrow()
  })

  test('Constraint with empty variable - right side', () => {
    expect(() => new AttributesAreEqualConstraint('A', 'X', '', 'Y', [{variable: 'X', attribute: '1', value: true}])).toThrow()
  })

  test('Constraint with empty variable - right side', () => {
    expect(() => new AttributesAreEqualConstraint('A', 'X', 'B', '', [{variable: 'X', attribute: '1', value: true}])).toThrow()
  })

  test('Constraint with empty lookup table', () => {
    expect(() => new AttributesAreEqualConstraint('A', 'X', 'B', 'Y', [])).toThrow()
  })

  test('Correct constraint', () => {
    expect(() => new AttributesAreEqualConstraint('A', 'X', 'B', 'Y', [{variable: 'X', attribute: '1', value: true}])).not.toThrow()
  })

})

describe('Applying the constraint', () => {

  test('Constraint is not applicable: variable not in group', () => {
    type Track = {symbol: string, north: boolean, east: boolean, south: boolean, west: boolean}

    const Tracks: Track[] = [
      {symbol: '═', north: false, east: true, south: false, west: true},
      {symbol: '║', north: true, east: false, south: true, west: false},
      {symbol: '╔', north: false, east: true, south: true, west: false},
      {symbol: '╗', north: false, east: false, south: true, west: true},
      {symbol: '╚', north: true, east: true, south: false, west: false},
      {symbol: '╝', north: true, east: false, south: false, west: true}
    ]

    const lookupTable: LookupTable = Tracks.flatMap(track => [
      {variable: track.symbol, attribute: 'north', value: track.north},
      {variable: track.symbol, attribute: 'east', value: track.east},
      {variable: track.symbol, attribute: 'south', value: track.south},
      {variable: track.symbol, attribute: 'west', value: track.west}
    ])

    const domain = Tracks.map(track => track.symbol)

    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const list = [varA, varB, varC]
    const attributesAreEqualConstraint = new AttributesAreEqualConstraint(
      varA.name,
      'north',
      varB.name,
      'south',
      lookupTable
    )
    
    let reponse: ApplyForVariableResponse = { 
      status: 'NOT_APPLICABLE',
    }
    expect(attributesAreEqualConstraint.applyForVariable(varC.name, list)).toStrictEqual(reponse)

    expect(attributesAreEqualConstraint.getVariableFromList('A', list).domain).toStrictEqual(domain)
    expect(attributesAreEqualConstraint.getVariableFromList('B', list).domain).toStrictEqual(domain)
    expect(attributesAreEqualConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
  })

  test('Constraint is applied - no changes: left and right single value', () => {
    type Track = {symbol: string, north: boolean, east: boolean, south: boolean, west: boolean}

    const Tracks: Track[] = [
      {symbol: '═', north: false, east: true, south: false, west: true},
      {symbol: '║', north: true, east: false, south: true, west: false},
      {symbol: '╔', north: false, east: true, south: true, west: false},
      {symbol: '╗', north: false, east: false, south: true, west: true},
      {symbol: '╚', north: true, east: true, south: false, west: false},
      {symbol: '╝', north: true, east: false, south: false, west: true}
    ]

    const lookupTable: LookupTable = Tracks.flatMap(track => [
      {variable: track.symbol, attribute: 'north', value: track.north},
      {variable: track.symbol, attribute: 'east', value: track.east},
      {variable: track.symbol, attribute: 'south', value: track.south},
      {variable: track.symbol, attribute: 'west', value: track.west}
    ])

    const domain = Tracks.map(track => track.symbol)

    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const list = [varA, varB, varC]
    
    const attributesAreEqualConstraint = new AttributesAreEqualConstraint(
      varA.name,
      'north',
      varB.name,
      'south',
      lookupTable
    )
    
    varA.domain = ['║']
    varB.domain = ['╔']

    let reponse: ApplyForVariableResponse = { 
      status: 'NO_CHANGES',
    }
    expect(attributesAreEqualConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

    expect(attributesAreEqualConstraint.getVariableFromList('A', list).domain).toStrictEqual(['║'])
    expect(attributesAreEqualConstraint.getVariableFromList('B', list).domain).toStrictEqual(['╔'])
    expect(attributesAreEqualConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
  })

  test('Constraint is applied - no changes: left single value, right multiple values', () => {
    type Track = {symbol: string, north: boolean, east: boolean, south: boolean, west: boolean}

    const Tracks: Track[] = [
      {symbol: '═', north: false, east: true, south: false, west: true},
      {symbol: '║', north: true, east: false, south: true, west: false},
      {symbol: '╔', north: false, east: true, south: true, west: false},
      {symbol: '╗', north: false, east: false, south: true, west: true},
      {symbol: '╚', north: true, east: true, south: false, west: false},
      {symbol: '╝', north: true, east: false, south: false, west: true}
    ]

    const lookupTable: LookupTable = Tracks.flatMap(track => [
      {variable: track.symbol, attribute: 'north', value: track.north},
      {variable: track.symbol, attribute: 'east', value: track.east},
      {variable: track.symbol, attribute: 'south', value: track.south},
      {variable: track.symbol, attribute: 'west', value: track.west}
    ])

    const domain = Tracks.map(track => track.symbol)

    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const list = [varA, varB, varC]
    
    const attributesAreEqualConstraint = new AttributesAreEqualConstraint(
      varA.name,
      'north',
      varB.name,
      'south',
      lookupTable
    )
    
    varA.domain = ['║']
    varB.domain = ['╔', '║']

    let reponse: ApplyForVariableResponse = { 
      status: 'NO_CHANGES',
    }
    expect(attributesAreEqualConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

    expect(attributesAreEqualConstraint.getVariableFromList('A', list).domain).toStrictEqual(['║'])
    expect(attributesAreEqualConstraint.getVariableFromList('B', list).domain).toStrictEqual(['╔', '║'])
    expect(attributesAreEqualConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
  })

  test('Constraint is applied - no changes: left multiple values, right single value', () => {
    type Track = {symbol: string, north: boolean, east: boolean, south: boolean, west: boolean}

    const Tracks: Track[] = [
      {symbol: '═', north: false, east: true, south: false, west: true},
      {symbol: '║', north: true, east: false, south: true, west: false},
      {symbol: '╔', north: false, east: true, south: true, west: false},
      {symbol: '╗', north: false, east: false, south: true, west: true},
      {symbol: '╚', north: true, east: true, south: false, west: false},
      {symbol: '╝', north: true, east: false, south: false, west: true}
    ]

    const lookupTable: LookupTable = Tracks.flatMap(track => [
      {variable: track.symbol, attribute: 'north', value: track.north},
      {variable: track.symbol, attribute: 'east', value: track.east},
      {variable: track.symbol, attribute: 'south', value: track.south},
      {variable: track.symbol, attribute: 'west', value: track.west}
    ])

    const domain = Tracks.map(track => track.symbol)

    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const list = [varA, varB, varC]
    
    const attributesAreEqualConstraint = new AttributesAreEqualConstraint(
      varA.name,
      'north',
      varB.name,
      'south',
      lookupTable
    )
    
    varA.domain = ['║', '╚']
    varB.domain = ['║']

    let reponse: ApplyForVariableResponse = { 
      status: 'NO_CHANGES',
    }
    expect(attributesAreEqualConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

    expect(attributesAreEqualConstraint.getVariableFromList('A', list).domain).toStrictEqual(['║', '╚'])
    expect(attributesAreEqualConstraint.getVariableFromList('B', list).domain).toStrictEqual(['║'])
    expect(attributesAreEqualConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
  })

  test('Constraint is applied - no changes: left and right multiple values', () => {
    type Track = {symbol: string, north: boolean, east: boolean, south: boolean, west: boolean}

    const Tracks: Track[] = [
      {symbol: '═', north: false, east: true, south: false, west: true},
      {symbol: '║', north: true, east: false, south: true, west: false},
      {symbol: '╔', north: false, east: true, south: true, west: false},
      {symbol: '╗', north: false, east: false, south: true, west: true},
      {symbol: '╚', north: true, east: true, south: false, west: false},
      {symbol: '╝', north: true, east: false, south: false, west: true}
    ]

    const lookupTable: LookupTable = Tracks.flatMap(track => [
      {variable: track.symbol, attribute: 'north', value: track.north},
      {variable: track.symbol, attribute: 'east', value: track.east},
      {variable: track.symbol, attribute: 'south', value: track.south},
      {variable: track.symbol, attribute: 'west', value: track.west}
    ])

    const domain = Tracks.map(track => track.symbol)

    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const list = [varA, varB, varC]
    
    const attributesAreEqualConstraint = new AttributesAreEqualConstraint(
      varA.name,
      'north',
      varB.name,
      'south',
      lookupTable
    )
    
    varA.domain = ['║', '╚']
    varB.domain = ['║', '╔']

    let reponse: ApplyForVariableResponse = { 
      status: 'NO_CHANGES',
    }
    expect(attributesAreEqualConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

    expect(attributesAreEqualConstraint.getVariableFromList('A', list).domain).toStrictEqual(['║', '╚'])
    expect(attributesAreEqualConstraint.getVariableFromList('B', list).domain).toStrictEqual(['║', '╔'])
    expect(attributesAreEqualConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
  })

  test('Constraint is applied - changes: left single value, right multiple values', () => {
    type Track = {symbol: string, north: boolean, east: boolean, south: boolean, west: boolean}

    const Tracks: Track[] = [
      {symbol: '═', north: false, east: true, south: false, west: true},
      {symbol: '║', north: true, east: false, south: true, west: false},
      {symbol: '╔', north: false, east: true, south: true, west: false},
      {symbol: '╗', north: false, east: false, south: true, west: true},
      {symbol: '╚', north: true, east: true, south: false, west: false},
      {symbol: '╝', north: true, east: false, south: false, west: true}
    ]

    const lookupTable: LookupTable = Tracks.flatMap(track => [
      {variable: track.symbol, attribute: 'north', value: track.north},
      {variable: track.symbol, attribute: 'east', value: track.east},
      {variable: track.symbol, attribute: 'south', value: track.south},
      {variable: track.symbol, attribute: 'west', value: track.west}
    ])

    const domain = Tracks.map(track => track.symbol)

    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const list = [varA, varB, varC]
    
    varA.domain = ['║']

    const attributesAreEqualConstraint = new AttributesAreEqualConstraint(
      varA.name,
      'north',
      varB.name,
      'south',
      lookupTable
    )
    
    let reponse: ApplyForVariableResponse = { 
      status: 'CHANGES',
      affectedVariables: ['B']
    }
    expect(attributesAreEqualConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

    expect(attributesAreEqualConstraint.getVariableFromList('A', list).domain).toStrictEqual(['║'])
    expect(attributesAreEqualConstraint.getVariableFromList('B', list).domain).toStrictEqual(['║', '╔', '╗'])
    expect(attributesAreEqualConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
  })

  test('Constraint is applied - changes: left multiple values, right single value', () => {
    type Track = {symbol: string, north: boolean, east: boolean, south: boolean, west: boolean}

    const Tracks: Track[] = [
      {symbol: '═', north: false, east: true, south: false, west: true},
      {symbol: '║', north: true, east: false, south: true, west: false},
      {symbol: '╔', north: false, east: true, south: true, west: false},
      {symbol: '╗', north: false, east: false, south: true, west: true},
      {symbol: '╚', north: true, east: true, south: false, west: false},
      {symbol: '╝', north: true, east: false, south: false, west: true}
    ]

    const lookupTable: LookupTable = Tracks.flatMap(track => [
      {variable: track.symbol, attribute: 'north', value: track.north},
      {variable: track.symbol, attribute: 'east', value: track.east},
      {variable: track.symbol, attribute: 'south', value: track.south},
      {variable: track.symbol, attribute: 'west', value: track.west}
    ])

    const domain = Tracks.map(track => track.symbol)

    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const list = [varA, varB, varC]
    
    varB.domain = ['║']

    const attributesAreEqualConstraint = new AttributesAreEqualConstraint(
      varA.name,
      'north',
      varB.name,
      'south',
      lookupTable
    )
    
    let reponse: ApplyForVariableResponse = { 
      status: 'CHANGES',
      affectedVariables: ['A']
    }
    expect(attributesAreEqualConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

    expect(attributesAreEqualConstraint.getVariableFromList('A', list).domain).toStrictEqual(['║', '╚', '╝'])
    expect(attributesAreEqualConstraint.getVariableFromList('B', list).domain).toStrictEqual(['║'])
    expect(attributesAreEqualConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
  })

  test('Constraint is applied - changes: left and right multiple values', () => {
    type Track = {symbol: string, north: boolean, east: boolean, south: boolean, west: boolean}

    const Tracks: Track[] = [
      {symbol: '═', north: false, east: true, south: false, west: true},
      {symbol: '║', north: true, east: false, south: true, west: false},
      {symbol: '╔', north: false, east: true, south: true, west: false},
      {symbol: '╗', north: false, east: false, south: true, west: true},
      {symbol: '╚', north: true, east: true, south: false, west: false},
      {symbol: '╝', north: true, east: false, south: false, west: true}
    ]

    const lookupTable: LookupTable = Tracks.flatMap(track => [
      {variable: track.symbol, attribute: 'north', value: track.north},
      {variable: track.symbol, attribute: 'east', value: track.east},
      {variable: track.symbol, attribute: 'south', value: track.south},
      {variable: track.symbol, attribute: 'west', value: track.west}
    ])

    const domain = Tracks.map(track => track.symbol)

    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const list = [varA, varB, varC]
    
    varA.domain = ['║', '╚', '╝']
    varB.domain = ['═', '║', '╔', '╗', '╚', '╝']

    const attributesAreEqualConstraint = new AttributesAreEqualConstraint(
      varA.name,
      'north',
      varB.name,
      'south',
      lookupTable
    )
    
    let reponse: ApplyForVariableResponse = { 
      status: 'CHANGES',
      affectedVariables: ['B']
    }
    expect(attributesAreEqualConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

    expect(attributesAreEqualConstraint.getVariableFromList('A', list).domain).toStrictEqual(['║', '╚', '╝'])
    expect(attributesAreEqualConstraint.getVariableFromList('B', list).domain).toStrictEqual(['║', '╔', '╗'])
    expect(attributesAreEqualConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
  })

  test('Constraint is applied - changes: left and right multiple values (other way around)', () => {
    type Track = {symbol: string, north: boolean, east: boolean, south: boolean, west: boolean}

    const Tracks: Track[] = [
      {symbol: '═', north: false, east: true, south: false, west: true},
      {symbol: '║', north: true, east: false, south: true, west: false},
      {symbol: '╔', north: false, east: true, south: true, west: false},
      {symbol: '╗', north: false, east: false, south: true, west: true},
      {symbol: '╚', north: true, east: true, south: false, west: false},
      {symbol: '╝', north: true, east: false, south: false, west: true}
    ]

    const lookupTable: LookupTable = Tracks.flatMap(track => [
      {variable: track.symbol, attribute: 'north', value: track.north},
      {variable: track.symbol, attribute: 'east', value: track.east},
      {variable: track.symbol, attribute: 'south', value: track.south},
      {variable: track.symbol, attribute: 'west', value: track.west}
    ])

    const domain = Tracks.map(track => track.symbol)

    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const list = [varA, varB, varC]
    
    varA.domain = ['═', '║', '╔', '╗', '╚', '╝']
    varB.domain = ['║', '╔', '╗']

    const attributesAreEqualConstraint = new AttributesAreEqualConstraint(
      varA.name,
      'north',
      varB.name,
      'south',
      lookupTable
    )
    
    let reponse: ApplyForVariableResponse = { 
      status: 'CHANGES',
      affectedVariables: ['A']
    }
    expect(attributesAreEqualConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

    expect(attributesAreEqualConstraint.getVariableFromList('A', list).domain).toStrictEqual(['║', '╚', '╝'])
    expect(attributesAreEqualConstraint.getVariableFromList('B', list).domain).toStrictEqual(['║', '╔', '╗'])
    expect(attributesAreEqualConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
  })

  test('Constraint is applied - contradiction is found', () => {
    type Track = {symbol: string, north: boolean, east: boolean, south: boolean, west: boolean}

    const Tracks: Track[] = [
      {symbol: '═', north: false, east: true, south: false, west: true},
      {symbol: '║', north: true, east: false, south: true, west: false},
      {symbol: '╔', north: false, east: true, south: true, west: false},
      {symbol: '╗', north: false, east: false, south: true, west: true},
      {symbol: '╚', north: true, east: true, south: false, west: false},
      {symbol: '╝', north: true, east: false, south: false, west: true}
    ]

    const lookupTable: LookupTable = Tracks.flatMap(track => [
      {variable: track.symbol, attribute: 'north', value: track.north},
      {variable: track.symbol, attribute: 'east', value: track.east},
      {variable: track.symbol, attribute: 'south', value: track.south},
      {variable: track.symbol, attribute: 'west', value: track.west}
    ])

    const domain = Tracks.map(track => track.symbol)

    const varA: Variable = {name: 'A', domain: Array.from(domain)}
    const varB: Variable = {name: 'B', domain: Array.from(domain)}
    const varC: Variable = {name: 'C', domain: Array.from(domain)}
    const list = [varA, varB, varC]
    
    varA.domain = ['║', '╚', '╝']
    varB.domain = ['═', '╚', '╝']

    const attributesAreEqualConstraint = new AttributesAreEqualConstraint(
      varA.name,
      'north',
      varB.name,
      'south',
      lookupTable
    )
    
    let reponse: ApplyForVariableResponse = { 
      status: 'CONTRADICTION',
    }
    expect(attributesAreEqualConstraint.applyForVariable(varA.name, list)).toStrictEqual(reponse)

    expect(attributesAreEqualConstraint.getVariableFromList('A', list).domain).toStrictEqual(['║', '╚', '╝'])
    expect(attributesAreEqualConstraint.getVariableFromList('B', list).domain).toStrictEqual(['═', '╚', '╝'])
    expect(attributesAreEqualConstraint.getVariableFromList('C', list).domain).toStrictEqual(domain)
  })




})
