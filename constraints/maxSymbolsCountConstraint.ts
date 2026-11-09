import { AbstractConstraint } from '../abstractConstraint.ts'
import { Engine, type Variable } from '../engine.ts'

export class MaxSymbolsCountConstraint extends AbstractConstraint {
  
  engine: Engine
  symbols: string[]
  count: number
  group: string[]

  constructor(engine: Engine, group: string[], symbols: string[], count: number) {
    super()

    if(group.length == 0) {
      throw new Error('No variable names in group.')      
    }

    if(symbols.length == 0) {
      throw new Error('No symbols provided')
    }

    this.engine = engine
    this.symbols = symbols
    this.count = count
    this.group = group
  }

  applyForVariable(variableName: string, list: Variable[]): { solutionStillPossible: boolean, affectedVariables: string[] } {
    
    if(!this.group.includes(variableName)) {
      return {
        solutionStillPossible: true,
        affectedVariables: []        
      }
    }

    const actualCount = this.group.reduce((acc, elem) => {
      const domain = this.getVariableFromList(elem, list).domain
      return domain.every(d => this.symbols.includes(d)) ? acc + 1 : acc
    }, 0)
    
    if(actualCount > this.count) return {
      solutionStillPossible: false,
      affectedVariables: []
    }

    if(actualCount == this.count) {
      let affectedVariables: string[] = []

      for(const groupVariableName of this.group) {
        const groupVariableDomain = this.getVariableFromList(groupVariableName, list).domain
        const hasOtherSymbols = groupVariableDomain.some(d => !this.symbols.includes(d))
        if(hasOtherSymbols) {
          const filteredDomain = groupVariableDomain.filter(d => !this.symbols.includes(d))
          if(groupVariableDomain.length === filteredDomain.length) continue
          this.setDomainForVariableInList({name: groupVariableName, domain: filteredDomain}, list)
          affectedVariables.push(groupVariableName)
        }
      }

      return {
        solutionStillPossible: true,
        affectedVariables: affectedVariables
      }
    }

    const undecidedCount = this.group.reduce((acc, elem) => {
      const domain = this.getVariableFromList(elem, list).domain
      const domainHasSomeSymbols = domain.some(d => this.symbols.includes(d))
      const domainHasOtherSymbols = domain.some(d => !this.symbols.includes(d))
      return domainHasSomeSymbols && domainHasOtherSymbols ? acc + 1 : acc
    }, 0)

    
    
    // Why is this?!

    return {
      solutionStillPossible: true,
      affectedVariables: []
    }      
  }
}