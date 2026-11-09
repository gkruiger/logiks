import { type Variable, type Domain } from './engine.ts'

export type ApplyForVariableResponse =
  | { status: 'NOT_APPLICABLE' }
  | { status: 'NO_CHANGES' }
  | { status: 'CHANGES', affectedVariables: string[] }
  | { status: 'CONTRADICTION' }

export abstract class AbstractConstraint {
  
  constructor() {
    //
  }

  getVariableFromList(variableName: string, list: Variable[]): Variable {
    let variable = list.find(v => v.name === variableName)
    if(!variable) throw new Error(`Variable ${variableName} not found`)
    return variable
  }

  setDomainForVariableInList(variableToSet: Variable, list: Variable[]): void {
    this.getVariableFromList(variableToSet.name, list).domain = variableToSet.domain
  }
 
  removeValueOfDomainForVariableInList(variableName: string, filterValue: any, list: Variable[]): number {
    const variable = this.getVariableFromList(variableName, list)
    const filteredDomain = variable.domain.filter(value => value !== filterValue)
    
    if(filteredDomain.length < variable.domain.length) {
      variable.domain = filteredDomain as Domain
    }
    return filteredDomain.length
  }

  abstract applyForVariable(variableName: string, variables: Variable[]): ApplyForVariableResponse
}
  