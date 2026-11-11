import { AbstractConstraint } from '../abstractConstraint.ts'
import type { ApplyForVariableResponse } from '../abstractConstraint.ts'
import { type Variable, type Domain } from '../engine.ts'

export class RunLengthConstraint extends AbstractConstraint {
  
  group: string[]
  symbol: string
  runLengths: number[]

  possibleCombinations: (any)[][] = []

  constructor(group: string[], symbol: string, runLengths: number[]) {
    super()

    if(group.length == 0) {
      throw new Error('No variable names in group.')      
    }

    if(symbol.length == 0) {
      throw new Error('No symbol provided')
    }

    if(runLengths.length == 0) {
      throw new Error('No run lenghts provided.')      
    }

    this.group = group
    this.symbol = symbol
    this.runLengths = runLengths

    this.generateAllPossibleCombinations()
  }

  generateAllPossibleCombinations(): void {

    const genereateCombinationsRecursively = (runLengthsLeft: number[], currentCombination: (string | undefined)[]): void => {
      
      if(runLengthsLeft.length === 0) {
        const positionsToFillWithUndefined = this.group.length - currentCombination.length
        for(let i=0; i<positionsToFillWithUndefined; i++) {
          currentCombination.push(undefined)
        }
        this.possibleCombinations.push(Array.from(currentCombination))
        return
      }

      const maximumPositionsToFillWithUndefined = 
        this.group.length - (
          currentCombination.length +
          (runLengthsLeft.reduce((sum, ele) => sum + ele + 1, 0) - 1)
        )
    
      for(let i=0; i<= maximumPositionsToFillWithUndefined; i++) {
        let newCombination = Array.from(currentCombination)
        for(let j=0; j<i; j++) {
          newCombination.push(undefined)
        }
        for(let j=0; j<runLengthsLeft[0]; j++) {
          newCombination.push(this.symbol)
        }
        if(newCombination.length < this.group.length) {
          newCombination.push(undefined)
        }

        let newRunLengthsLeft = runLengthsLeft.slice(1)
        genereateCombinationsRecursively(newRunLengthsLeft, newCombination)
      }
    }

    genereateCombinationsRecursively(Array.from(this.runLengths), [])
  }

  applyForVariable(variableName: string, list: Variable[]): ApplyForVariableResponse {
    
    if(!this.group.includes(variableName)) return { status: 'NOT_APPLICABLE' }

    let matchingCombinations = []
    for(const possibleCombination of this.possibleCombinations) {
      let everyPositionMatches = true
      for(let i=0; i<possibleCombination.length; i++) {
        const variableFromGroup = this.getVariableFromList(this.group[i], list)
        if(
          variableFromGroup.domain.length == 1 &&
          (variableFromGroup.domain[0] == this.symbol || possibleCombination[i]) && 
          variableFromGroup.domain[0] != possibleCombination[i]
        ) {
          everyPositionMatches = false
          break
        }
      }
      if(everyPositionMatches) {
        matchingCombinations.push(Array.from(possibleCombination))
      }
    }

    if(matchingCombinations.length == 0) return { status: 'CONTRADICTION' }

    let commonSymbolPlacements = Array.from(matchingCombinations[0])
    for(let m=1; m<matchingCombinations.length; m++) {
      for(let i=0; i<this.group.length; i++) {
        if(commonSymbolPlacements[i] !== matchingCombinations[m][i]) {
          commonSymbolPlacements[i] = null
        }
      }
    }

    let affectedVariables: string[] = []
    for(let i=0; i<this.group.length; i++) {
      if(commonSymbolPlacements[i] !== null) {
        const variableFromGroup = this.getVariableFromList(this.group[i], list)
        const filteredDomain = variableFromGroup.domain.filter(value => 
          commonSymbolPlacements[i] == this.symbol
            ? value == this.symbol
            : value != this.symbol
        )
        if(filteredDomain.length == 0) return { status: 'CONTRADICTION'}
        if(filteredDomain.length == variableFromGroup.domain.length) continue
        this.setDomainForVariableInList({name: this.group[i], domain: filteredDomain as Domain}, list)
        affectedVariables.push(this.group[i])
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