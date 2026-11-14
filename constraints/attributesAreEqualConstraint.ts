import { AbstractConstraint } from '../abstractConstraint.ts'
import type { ApplyForVariableResponse } from '../abstractConstraint.ts'
import type { Variable } from '../engine.ts'

export type LookupTable = {
  variable: string,
  attribute: string,
  value: any
}[]

export class AttributesAreEqualConstraint extends AbstractConstraint {

  variableA: string
  attributeA: string
  variableB: string
  attributeB: string
  lookupTable: LookupTable

  constructor(variableA: string, attributeA: string, variableB: string, attributeB: string, lookupTable: LookupTable) {
    super()

    this.variableA = variableA
    this.variableB = variableB
    this.attributeA = attributeA
    this.attributeB = attributeB
    this.lookupTable = lookupTable

    if(variableA.length == 0 || attributeA.length == 0 || variableB.length == 0 || attributeB.length == 0 || lookupTable.length == 0) {
      throw new Error('Empty string for variable(s)/attribute(s) or empty lookup table.')
    }
  }

  getAttributeValue(variable: string, attribute: string): any {
    const attributeValue = this.lookupTable.find(row => 
      row.variable === variable && 
      row.attribute === attribute
    )?.value

    return attributeValue
  }

  applyForVariable(variableName: string, list: Variable[]): ApplyForVariableResponse {
    
    const variableAFromVariables = this.getVariableFromList(this.variableA, list)
    const variableBFromVariables = this.getVariableFromList(this.variableB, list)

    if(
      variableName !== variableAFromVariables.name &&
      variableName !== variableBFromVariables.name 
    ) return {
      status: 'NOT_APPLICABLE'
    }

    const variableA = this.getVariableFromList(this.variableA, list)
    const variableB = this.getVariableFromList(this.variableB, list)
    
    const attributeAKeyValuePairs = variableA.domain.map(d => ({
      variable: d, 
      value: this.getAttributeValue(d, this.attributeA)
    }))
    const attributeBKeyValuePairs = variableB.domain.map(d => ({
      variable: d, 
      value: this.getAttributeValue(d, this.attributeB)
    }))
    
    const filteredDomainA = attributeAKeyValuePairs
      .filter(a => attributeBKeyValuePairs
        .map(a => a.value)
        .includes(a.value)
      )
      .map(a => a.variable)
    const filteredDomainB = attributeBKeyValuePairs
      .filter(a => attributeAKeyValuePairs
        .map(a => a.value)
        .includes(a.value)
      )
      .map(a => a.variable)

    if(
      filteredDomainA.length == 0 || 
      filteredDomainB.length == 0
    ) return { status: 'CONTRADICTION' }

    if(
      filteredDomainA.length == variableA.domain.length && 
      filteredDomainB.length == variableB.domain.length 
    ) return { status: 'NO_CHANGES' }

    let affectedVariables: string[] = []

    if(filteredDomainA.length < variableA.domain.length) {
      this.setDomainForVariableInList({name: this.variableA, domain: filteredDomainA}, list)
      affectedVariables.push(this.variableA)
    }

    if(filteredDomainB.length < variableB.domain.length) {
      this.setDomainForVariableInList({name: this.variableB, domain: filteredDomainB}, list)
      affectedVariables.push(this.variableB)
    }

    return  {
      status: 'CHANGES',
      affectedVariables: affectedVariables
    }
  }
}