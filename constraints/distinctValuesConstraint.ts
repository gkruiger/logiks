import { AbstractConstraint } from '../abstractConstraint.ts'
import type { ApplyForVariableResponse } from '../abstractConstraint'
import type { Variable } from '../engine'

export class DistinctValuesConstraint extends AbstractConstraint {
  
  group: string[]

  constructor(group: string[]) {
    super()

    if(group.length < 2) {
      throw new Error('DistinctValuesConstraint needs to have a group of multiple variables.')
    }

    this.group = group
  }

  applyForVariable(variableName: string, variables: Variable[]): ApplyForVariableResponse {
    
    if(!this.group.includes(variableName)) return { status: 'NOT_APPLICABLE' }

    let affectedVariables: string[] = []
    
    for(const groupVariableNameA of this.group) {
      if(groupVariableNameA !== variableName) continue

      let groupVariableA = this.getVariableFromList(groupVariableNameA, variables)
      if(groupVariableA.domain.length > 1) continue

      for(const groupVariableNameB of this.group) {
        let groupVariableB = this.getVariableFromList(groupVariableNameB, variables)
        if(groupVariableA.name === groupVariableB.name) continue
        const oldDomainLength = groupVariableB.domain.length
        const newDomainLength = this.removeValueOfDomainForVariableInList(groupVariableNameB, groupVariableA.domain[0], variables)
        if(newDomainLength === oldDomainLength) continue
        if(newDomainLength == 0) return { status: 'CONTRADICTION' }
        affectedVariables.push(groupVariableNameB)
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