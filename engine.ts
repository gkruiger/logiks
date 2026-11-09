import { AbstractConstraint } from './abstractConstraint.ts'

export const Tracks = [
  {symbol: '═', connections: [{x: -1, y:  0}, {x: +1, y:  0}]},
  {symbol: '║', connections: [{x:  0, y: -1}, {x:  0, y:  1}]},
  {symbol: '╔', connections: [{x:  0, y: +1}, {x: +1, y:  0}]},
  {symbol: '╗', connections: [{x: -1, y:  0}, {x:  0, y:  1}]},
  {symbol: '╚', connections: [{x:  0, y: -1}, {x: +1, y:  0}]},
  {symbol: '╝', connections: [{x: -1, y:  0}, {x:  0, y: -1}]}
]

export type Variable = { 
  name: string, 
  domain: Domain,
}

export type Domain = string[] | number[]

type SolverState = {
  variables: Variable[]
  solved: boolean
}

export class Engine {

  private variables: Variable[] = []
  private constraints: AbstractConstraint[] = []

  private guesses: number = 0
  private backTracked: number = 0

  constructor() {
    //
  }

  // Variables

  addVariable(variable: Variable): void {
    if(this.variables.some(v=> v.name === variable.name)) {
      throw new Error(`Variable ${variable.name} already exists.`)
    } 
    
    if(variable.domain.length == 0) {
      throw new Error(`Domain is empty.`)
    }
        
    this.variables.push(variable)
  }

  getDomain(variableName: string): Domain {
    let variable = this.variables.find(v => v.name === variableName)
    if(!variable) throw new Error(`Variable ${variableName} not found`)
    return variable.domain
  }

  // Constraints

  addConstraint(constraint: AbstractConstraint): void {
    this.constraints.push(constraint)
  }

  
  // Solving

  private applyConstraintsForVariable(variableName: string, variables: Variable[]): boolean {
    let affectedVariables: string[] = []
    affectedVariables.push(variableName)

    while(affectedVariables.length > 0) {
      const variableToProcess = affectedVariables.shift() as string
      for(const constaint of this.constraints) {
        let result = constaint.applyForVariable(variableToProcess, variables)
        if(!result.solutionStillPossible) return false
        affectedVariables.push(...result.affectedVariables)
      }
    }

    return true
  }

  solve(): boolean {
    
    const t0 = performance.now()

    let solutionFound = this.solveWithoutGuessing()
    
    if(!solutionFound) {
      let solverState: SolverState = {
        variables: Array.from(this.variables),
        solved: false
      } 
      
      this.guesses = 0
      this.backTracked = 0
      const solution = this.solveWithGuessing(solverState)

      solutionFound = solution.variables.every(v => v.domain.length == 1)
      if(solutionFound) {
        this.variables = solution.variables
      }
    }

    const t1 = performance.now()
    console.log(`${solutionFound ? 'Solved in' : 'No solution found after'} ${Math.round(t1 - t0)} milliseconds.`)
    console.log(`Guesses: ${this.guesses} (backtracked: ${this.backTracked}).`)
  
    return solutionFound
  }

  private solveWithoutGuessing(): boolean {
    for(const variable of this.variables) {
      const result = this.applyConstraintsForVariable(variable.name, this.variables)
      if(!result) return false
    }

    const solutionFound = this.variables.every(v => v.domain.length == 1)
    return solutionFound 
  }

  private solveWithGuessing(solverState: SolverState): SolverState { 

    const solutionFound = solverState.variables.every(v => v.domain.length == 1)
    
    if(solutionFound) {
      return {
        ...solverState,
        solved: true,
      }
    }
   
    const variableWithSmallestDomain = solverState.variables
      .filter(v => v.domain.length > 1)
      .sort((a, b) => a.domain.length - b.domain.length)[0]

    for(const value of variableWithSmallestDomain.domain) {
      this.guesses++

      let updatedVariables = structuredClone(solverState.variables)
      
      const variable = updatedVariables.find(v => v.name === variableWithSmallestDomain.name)
      if(!variable) throw new Error(`Variable ${variableWithSmallestDomain.name} not found`)
      variable.domain = [value] as Domain

      const solutionStillPossible =  this.applyConstraintsForVariable(variableWithSmallestDomain.name, updatedVariables)

      if(!solutionStillPossible) {
        this.backTracked++
        continue
      }

      let result = this.solveWithGuessing({
        ...solverState,
        variables: updatedVariables, 
      })

      if(result.solved) {
        return result
      }
    }

    return solverState
  }

  // Extra functions

  printVariables(): void {
    this.variables.forEach(variable =>
      console.log(`Name: ${variable.name}, domain: ${variable.domain}`)
    )
  }

  reset(): void {
    this.variables = []
    this.constraints = []
  }

}