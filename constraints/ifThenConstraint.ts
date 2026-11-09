import { AbstractConstraint } from '../abstractConstraint.ts'
import { Engine, type Variable } from '../engine.ts'

type Condition =
  | { type: 'variableIsEqualTo', variable: string, value: string }

type Consequence = 
  | { type: 'setDomain', variable: string, domain: string[] }

export class IfThenConstraint extends AbstractConstraint {
  
  engine: Engine
  conditions: Condition[]
  consequences: Consequence[]

  constructor(engine: Engine, conditions: Condition[], consequences: Consequence[]) {
    super()

    if(conditions.length == 0) {
      throw new Error('No conditions.')      
    }

    if(consequences.length == 0) {
      throw new Error('No consequences.')
    }

    this.engine = engine
    this.conditions = conditions
    this.consequences = consequences
  }

  applyForVariable(variableName: string, list: Variable[]): { solutionStillPossible: boolean, affectedVariables: string[] } {   
    let allConditionsApply = true
    for(const condition of this.conditions) {
      if(condition.type == 'variableIsEqualTo') {
        if(condition.variable !== variableName) {
          allConditionsApply = false
          continue
        }
        const variable = this.getVariableFromList(condition.variable, list)
        if(variable.domain.length == 1) {
          if(variable.domain[0] !== condition.value) {
            allConditionsApply = false
          }
        } else {
          allConditionsApply = false
        }
      } else {
        throw new Error('Condition type not supported.')
      }
    }

    if(allConditionsApply) {
      let affectedVariables: string[] = []
      for(const consequence of this.consequences) {
        if(consequence.type === 'setDomain') {
          if(consequence.domain.length == 0) return {
            solutionStillPossible: false,
            affectedVariables: []
          }
          const variable = this.getVariableFromList(consequence.variable, list)
          let filteredDomain = variable.domain.filter(value => consequence.domain.includes(value))
          if(filteredDomain.length == 0) return {
            solutionStillPossible: false,
            affectedVariables: []
          }
          if(filteredDomain.length === variable.domain.length) continue
          this.setDomainForVariableInList({name: consequence.variable, domain: filteredDomain}, list)
          affectedVariables.push(consequence.variable)
        } else {
          throw new Error('Consequence type not supported.')
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