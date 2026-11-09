import { AbstractConstraint } from '../abstractConstraint.ts'
import type { ApplyForVariableResponse } from '../abstractConstraint.ts'
import type { Variable } from '../engine.ts'

export class LessThanConstraint extends AbstractConstraint {

  variableA: string
  variableB: string

  constructor(variableA: string, variableB: string) {
    super()

    this.variableA = variableA
    this.variableB = variableB
  
    if(variableA.length == 0 || variableB.length == 0) {
      throw new Error('Empty string for variable(s).')
    }
  }

  applyForVariable(variableName: string, list: Variable[]): ApplyForVariableResponse {
    
    const variableAFromVariables = this.getVariableFromList(this.variableA, list)
    const variableBFromVariables = this.getVariableFromList(this.variableB, list)

    if(!(
      variableAFromVariables.domain.every(d => typeof d === 'number') &&
      variableBFromVariables.domain.every(d => typeof d === 'number')
    )) return {
      status: 'NOT_APPLICABLE'
    }

    if(
      variableName !== this.variableA &&
      variableName !== this.variableB 
    ) return {
      status: 'NOT_APPLICABLE'
    }

    let affectedVariables: string[] = []

    if(variableName === this.variableA) {
      const maxForVariableA = Math.min(...variableAFromVariables.domain)
      const filteredDomainVariableB = variableBFromVariables.domain.filter(value => maxForVariableA < value)
      if(filteredDomainVariableB.length == 0) return { status: 'CONTRADICTION' }

      if(filteredDomainVariableB.length !== variableBFromVariables.domain.length) {
        this.setDomainForVariableInList({name: variableBFromVariables.name, domain: filteredDomainVariableB}, list)
        affectedVariables.push(variableBFromVariables.name)
      }

      if(variableAFromVariables.domain.length > 1) {
        const minForVariableB = Math.max(...filteredDomainVariableB)
        const filteredDomainVariableA = variableAFromVariables.domain.filter(value => minForVariableB > value)
        if(filteredDomainVariableA.length == 0) return { status: 'CONTRADICTION' }

        if(filteredDomainVariableA.length !== variableAFromVariables.domain.length) {
          this.setDomainForVariableInList({name: variableAFromVariables.name, domain: filteredDomainVariableA}, list)
          affectedVariables.push(variableAFromVariables.name)
        }
      }
    }
    
    if(variableName === this.variableB) {
      const minForVariableB = Math.max(...variableBFromVariables.domain)
      const filteredDomainVariableA = variableAFromVariables.domain.filter(value => minForVariableB > value)
      if(filteredDomainVariableA.length == 0) return { status: 'CONTRADICTION' }

      if(filteredDomainVariableA.length !== variableAFromVariables.domain.length) {
        this.setDomainForVariableInList({name: variableAFromVariables.name, domain: filteredDomainVariableA}, list)
        affectedVariables.push(variableAFromVariables.name)
      }


      if(variableBFromVariables.domain.length > 1) {
        const maxForVariableA = Math.min(...filteredDomainVariableA)
        const filteredDomainVariableB = variableBFromVariables.domain.filter(value => maxForVariableA < value)
        if(filteredDomainVariableB.length == 0) return { status: 'CONTRADICTION' }

        if(filteredDomainVariableB.length !== variableBFromVariables.domain.length) {
          this.setDomainForVariableInList({name: variableBFromVariables.name, domain: filteredDomainVariableB}, list)
          affectedVariables.push(variableBFromVariables.name)
        }
      }
    }

    if(affectedVariables.length > 0) {
      return  {
        status: 'CHANGES',
        affectedVariables: affectedVariables
      }
    } else {
      return {
        status: 'NO_CHANGES'
      }
    }
  }
}