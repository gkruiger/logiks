import { AbstractConstraint } from '../abstractConstraint.ts'
import { Engine, type Variable } from '../engine.ts'

export class LessThanConstraint extends AbstractConstraint {
  
  engine: Engine
  variableA: string
  variableB: string

  constructor(engine: Engine, variableA: string, variableB: string) {
    super()

    this.engine = engine
    this.variableA = variableA
    this.variableB = variableB

    if(variableA.length == 0 || variableB.length == 0) {
      throw new Error('Empty string for variable(s).')
    }
  }

  applyForVariable(variableName: string, list: Variable[]): { solutionStillPossible: boolean, affectedVariables: string[] } {
    
    const variableAFromVariables = this.getVariableFromList(this.variableA, list)
    const variableBFromVariables = this.getVariableFromList(this.variableB, list)

    let affectedVariables: string[] = []

    if(variableName === this.variableA) {
      const minForVariableA = Math.min(...variableAFromVariables.domain)
      const filteredDomainVariableB = variableBFromVariables.domain.filter(value => minForVariableA < value)
      if(filteredDomainVariableB.length == 0) return {
        solutionStillPossible: false,
        affectedVariables: []
      } 

      if(filteredDomainVariableB.length !== variableBFromVariables.domain.length) {
        this.setDomainForVariableInList({name: variableBFromVariables.name, domain: filteredDomainVariableB}, list)
        affectedVariables.push(variableBFromVariables.name)
      }


      if(variableAFromVariables.domain.length > 1) {
        const maxForVariableB = Math.max(...filteredDomainVariableB)
        const filteredDomainVariableA = variableAFromVariables.domain.filter(value => maxForVariableB > value)
        if(filteredDomainVariableA.length == 0) return {
          solutionStillPossible: false,
          affectedVariables: []
        } 

        if(filteredDomainVariableA.length !== variableAFromVariables.domain.length) {
          this.setDomainForVariableInList({name: variableAFromVariables.name, domain: filteredDomainVariableA}, list)
          affectedVariables.push(variableAFromVariables.name)
        }
      }

      return {
        solutionStillPossible: true,
        affectedVariables: affectedVariables
      }
    }
    
    if(variableName === this.variableB) {
      const maxForVariableB = Math.max(...variableBFromVariables.domain)
      const filteredDomainVariableA = variableAFromVariables.domain.filter(value => maxForVariableB > value)
      if(filteredDomainVariableA.length == 0) return {
        solutionStillPossible: false,
        affectedVariables: []
      } 

      if(filteredDomainVariableA.length !== variableAFromVariables.domain.length) {
        this.setDomainForVariableInList({name: variableAFromVariables.name, domain: filteredDomainVariableA}, list)
        affectedVariables.push(variableAFromVariables.name)
      }


      if(variableBFromVariables.domain.length > 1) {
        const minForVariableA = Math.min(...filteredDomainVariableA)
        const filteredDomainVariableB = variableBFromVariables.domain.filter(value => minForVariableA < value)
        if(filteredDomainVariableB.length == 0) return {
          solutionStillPossible: false,
          affectedVariables: []
        } 

        if(filteredDomainVariableB.length !== variableBFromVariables.domain.length) {
          this.setDomainForVariableInList({name: variableBFromVariables.name, domain: filteredDomainVariableB}, list)
          affectedVariables.push(variableBFromVariables.name)
        }
      }

      return {
        solutionStillPossible: true,
        affectedVariables: affectedVariables
      }
    }

    return {
      solutionStillPossible: true,
      affectedVariables: []
    }
  }
}