import { AbstractConstraint } from '../abstractConstraint.ts'
import type { ApplyForVariableResponse } from '../abstractConstraint.ts'
import { type Variable, type Domain } from '../engine.ts'

export class SymbolsCountConstraint extends AbstractConstraint {
  
  symbols: string[]
  count: number
  group: string[]

  constructor(group: string[], symbols: string[], count: number) {
    super()

    if(group.length == 0) {
      throw new Error('No variable names in group.')      
    }

    if(symbols.length == 0) {
      throw new Error('No symbols provided')
    }

    this.symbols = symbols
    this.count = count
    this.group = group
  }

  applyForVariable(variableName: string, list: Variable[]): ApplyForVariableResponse {
    
    if(!this.group.includes(variableName)) return { status: 'NOT_APPLICABLE'}

    const actualCount = this.group.reduce((acc, elem) => {
      const domain = this.getVariableFromList(elem, list).domain
      return domain.every(d => this.symbols.includes(d)) ? acc + 1 : acc
    }, 0)
    
    if(actualCount > this.count) return { status: 'CONTRADICTION' } 

    if(actualCount == this.count) {
      let affectedVariables: string[] = []

      for(const groupVariableName of this.group) {
        const groupVariableDomain = this.getVariableFromList(groupVariableName, list).domain
        const hasOtherSymbols = groupVariableDomain.some(d => !this.symbols.includes(d))
        if(hasOtherSymbols) {
          const filteredDomain = groupVariableDomain.filter(d => !this.symbols.includes(d))
          if(groupVariableDomain.length === filteredDomain.length) continue
          this.setDomainForVariableInList({name: groupVariableName, domain: filteredDomain as Domain}, list)
          affectedVariables.push(groupVariableName)
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

    const undecidedCount = this.group.reduce((acc, elem) => {
      const domain = this.getVariableFromList(elem, list).domain
      const domainHasSomeSymbols = domain.some(d => this.symbols.includes(d))
      const domainHasOtherSymbols = domain.some(d => !this.symbols.includes(d))
      return domainHasSomeSymbols && domainHasOtherSymbols ? acc + 1 : acc
    }, 0)

    if(actualCount + undecidedCount < this.count) return { status: 'CONTRADICTION' } 

    if(actualCount + undecidedCount == this.count) {

      let affectedVariables: string[] = []

      for(const groupVariableName of this.group) {
        const groupVariableDomain = this.getVariableFromList(groupVariableName, list).domain
        
        const domainHasSomeSymbols = groupVariableDomain.some(d => this.symbols.includes(d))
        const domainHasSomeNotSymbols = groupVariableDomain.some(d => !this.symbols.includes(d))
        if(!(domainHasSomeSymbols && domainHasSomeNotSymbols)) continue 

        const filteredDomain = groupVariableDomain.filter(d => this.symbols.includes(d))
        if(groupVariableDomain.length === filteredDomain.length) continue

        this.setDomainForVariableInList({name: groupVariableName, domain: filteredDomain as Domain}, list)
        affectedVariables.push(groupVariableName)
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

    // Why is this?!

    return { status: 'NO_CHANGES' }      
  }
}