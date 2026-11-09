// These types are used to call the engine

export type InputConstraintRow =
  | { type: 'distinctValues'}
  | { type: 'runLengths', symbol: string, runLengths: number[], row: number }
  | { type: 'filledCells', symbols: string[], filledCells: number, row: number }

export type InputConstraintColumn =
  | { type: 'distinctValues'}
  | { type: 'runLengths', symbol: string, runLengths: number[], column: number }
  | { type: 'filledCells', symbols: string[], filledCells: number, column: number }
  
export type InputConstraintDiagonalDown =
  | { type: 'maxFilledCells', symbols: string[], maxFilledCells: number, diagonal: number }

export type InputConstraintDiagonalUp =
  | { type: 'maxFilledCells', symbols: string[], maxFilledCells: number, diagonal: number }

export type InputConstraintTable = 
  | { type: 'distinctValuesForTheWholeTable'}
  | { type: 'distinctValuesForSpecificCells', cels: {row: number, column: number}[]}
  | { type: 'adjacentCellsDifferent' }
  | { type: 'greaterThan', celA: {row: number, column: number}, celB: {row: number, column: number} }
  | { type: 'lessThan', celA: {row: number, column: number}, celB: {row: number, column: number} }
  | { type: 'connectedTracks' }
  | { type: 'filledAdjacentCells', symbols: string[], filledCells: number, row: number, column: number }

export const Tracks = [
  {symbol: '═', connections: [{x: -1, y:  0}, {x: +1, y:  0}]},
  {symbol: '║', connections: [{x:  0, y: -1}, {x:  0, y:  1}]},
  {symbol: '╔', connections: [{x:  0, y: +1}, {x: +1, y:  0}]},
  {symbol: '╗', connections: [{x: -1, y:  0}, {x:  0, y:  1}]},
  {symbol: '╚', connections: [{x:  0, y: -1}, {x: +1, y:  0}]},
  {symbol: '╝', connections: [{x: -1, y:  0}, {x:  0, y: -1}]}
]

// Types used internally by the engine

type Variable = { name: string, domain: Domain }
export type Domain = any[]
type Table = { columns: number, rows: number }

type DistinctValuesConstraint = { type: 'distinctValues', variables: string[] }
type GreaterThanConstraint = { type: 'greaterThan', variableA: string, variableB: string }
type LessThanConstraint = { type: 'lessThan', variableA: string, variableB: string }
type RunLengthsConstraint = { type: 'runLengths', symbol: string, runLengths: number[], group: string[] }
type SymbolCountConstraint = { type: 'symbolCount', symbols: string[], count: number, group: string[] }
type MaxSymbolCountConstraint = { type: 'maxSymbolCount', symbols: string[], maxCount: number, group: string[] }
type IfThenConstraint = { type: 'ifthen', conditions: Condition[], consequences: Consequence[] }

type Condition = { type: 'variableIsEqualTo', variable: string, value: string }
type Consequence = { type: 'setDomain', variable: string, domain: string[] }

type Constraint = 
  | DistinctValuesConstraint
  | GreaterThanConstraint
  | LessThanConstraint
  | RunLengthsConstraint
  | SymbolCountConstraint
  | IfThenConstraint
  | MaxSymbolCountConstraint

type SolverState = {
  variables: Variable[]
  solved: boolean
}

export class Engine {

  variables: Variable[] = []
  constraints: Constraint[] = []
  table: Table | undefined

  guesses: number = 0
  backTracked: number = 0

  constructor() {
    
  }

  setTable(table: {
    table: any[][], 
    domain: Domain,
    rowConstraints?: InputConstraintRow[],
    columnConstraints?: InputConstraintColumn[],
    diagonalDownConstraints?: InputConstraintDiagonalDown[],
    diagonalUpConstraints?: InputConstraintDiagonalUp[],
    tableConstraints?: InputConstraintTable[]
  }): void {

    const rows = table.table.length
    const columns = table.table[0].length
    this.table = {rows: rows, columns: columns}

    for(let r=0; r<rows; r++) {
      for(let c=0; c<columns; c++) {
        this.addTableVariable(r, c, table.domain)
        const value = table.table[r][c]
        if(value !== undefined) {
          this.setTableVariable(r, c, [value])
        }
      }
    }
    
    if(table.rowConstraints) {
      for(const rowConstraint of table.rowConstraints) {
        if(rowConstraint.type === 'distinctValues') {
          for(let r=0; r<rows; r++) {
            let groupVariables = []
            for(let c=0; c<columns; c++) {
              groupVariables.push(
                this.getVariableNameForCell(r, c)
              )
            }
            this.addConstraint({type: 'distinctValues', variables: groupVariables})
          }
        } else if(rowConstraint.type === 'runLengths') {
          let groupVariables = []
          for(let column=0; column<columns; column++) {
            groupVariables.push(
              this.getVariableNameForCell(rowConstraint.row, column)
            )
          }
          this.addConstraint({
            type: 'runLengths', 
            group: groupVariables, 
            symbol: rowConstraint.symbol,
            runLengths: rowConstraint.runLengths
          })
        } else if(rowConstraint.type === 'filledCells') {
          let groupVariables = []
          for(let column=0; column<columns; column++) {
            groupVariables.push(
              this.getVariableNameForCell(rowConstraint.row, column)
            )
          }          
          this.addConstraint({type: 'symbolCount', symbols: rowConstraint.symbols, count: rowConstraint.filledCells, group: groupVariables})
        } else {
          throw new Error('Row constraint type not supported.')
        }
      }
    }
      
    if(table.columnConstraints) {
      for(const columnConstraint of table.columnConstraints) {
        if(columnConstraint.type == 'distinctValues') {
          for(let c=0; c<columns; c++) {
            let groupVariables = []
            for(let r=0; r<rows; r++) {
              groupVariables.push(
                this.getVariableNameForCell(r, c)
              )
            }
            this.addConstraint({type: 'distinctValues', variables: groupVariables})
          }
        } else if(columnConstraint.type === 'runLengths') {
          let groupVariables = []
          for(let row=0; row<rows; row++) {
            groupVariables.push(
              this.getVariableNameForCell(row, columnConstraint.column)
            )
          }
          this.addConstraint({
            type: 'runLengths', 
            group: groupVariables, 
            symbol: columnConstraint.symbol,
            runLengths: columnConstraint.runLengths
          })
        } else if(columnConstraint.type === 'filledCells') {
          let groupVariables = []
          for(let row=0; row<rows; row++) {
            groupVariables.push(
              this.getVariableNameForCell(row, columnConstraint.column)
            )
          }        
          this.addConstraint({type: 'symbolCount', symbols: columnConstraint.symbols, count: columnConstraint.filledCells, group: groupVariables})
        } else {
          throw new Error('Column constraint type not supported.')
        }
      }
    }

    if(table.diagonalDownConstraints) {
      for(const diagonalConstraint of table.diagonalDownConstraints) {
        if(diagonalConstraint.type == 'maxFilledCells') {
          let position = {
            row: this.table.rows - 1,
            column: 0
          }

          position.row -= diagonalConstraint.diagonal
          
          if(position.row < 0) {
            position.column += -position.row
            position.row = 0
          }

          let groupVariables = []
          do {
            groupVariables.push(
              this.getVariableNameForCell(position.row, position.column)
            )
            position.row += 1,
            position.column += 1
          } while (position.row < this.table.rows && position.column < this.table.columns)

          this.addConstraint({type: 'maxSymbolCount', symbols: diagonalConstraint.symbols, maxCount: diagonalConstraint.maxFilledCells, group: groupVariables})
        } else {
          throw new Error('Diagonal constraint type not supported.')
        }
      }
    }

    if(table.diagonalUpConstraints) {
      for(const diagonalConstraint of table.diagonalUpConstraints) {
        if(diagonalConstraint.type == 'maxFilledCells') {
          let position = {
            row: 0,
            column: 0
          }

          position.row += diagonalConstraint.diagonal
          
          if(position.row > this.table.rows - 1) {
            position.column = position.row - (this.table.rows - 1)
            position.row = this.table.rows - 1
          }

          let groupVariables = []
          do {
            groupVariables.push(
              this.getVariableNameForCell(position.row, position.column)
            )
            position.row -= 1,
            position.column += 1
          } while (position.row >= 0 && position.column < this.table.columns)

          this.addConstraint({type: 'maxSymbolCount', symbols: diagonalConstraint.symbols, maxCount: diagonalConstraint.maxFilledCells, group: groupVariables})
        } else {
          throw new Error('Diagonal constraint type not supported.')
        }
      }
    }

    if(table.tableConstraints) {
      for(const tableConstraint of table.tableConstraints) {
        if(tableConstraint.type == 'adjacentCellsDifferent') {
          for(let r=0; r<this.table.rows; r++) {
            for(let c=0; c<this.table.columns; c++) {
              let variableA = this.getTableVariable(r, c).name
              let adjacentCells = this.getAdjacentCellVariables(r, c)
              for(const adjecentCell of adjacentCells) {
                this.addConstraint({type: 'distinctValues', variables: [variableA, adjecentCell]})
              }
            }
          } 
        } else if(tableConstraint.type == 'distinctValuesForTheWholeTable') {
          let allTableVariables: string[] = []

          for(let r=0; r<rows; r++) {
            for(let c=0; c<columns; c++) {
              allTableVariables.push(
                this.getVariableNameForCell(r, c)
              )
            }
          } 
          
          this.addConstraint({type: 'distinctValues', variables: allTableVariables})
        } else if(tableConstraint.type == 'distinctValuesForSpecificCells') {
          let variables: string[] = []

          for(const cel of tableConstraint.cels) {
            variables.push(
              this.getVariableNameForCell(cel.row, cel.column)
            )
          }
          
          this.addConstraint({type: 'distinctValues', variables: variables})          
        } else if(tableConstraint.type == 'greaterThan') {
          const variableA = this.getVariableNameForCell(tableConstraint.celA.row, tableConstraint.celA.column)
          const variableB = this.getVariableNameForCell(tableConstraint.celB.row, tableConstraint.celB.column)
          
          this.addConstraint({type: 'greaterThan', variableA: variableA, variableB: variableB})
        } else if(tableConstraint.type == 'lessThan') {
          const variableA = this.getVariableNameForCell(tableConstraint.celA.row, tableConstraint.celA.column)
          const variableB = this.getVariableNameForCell(tableConstraint.celB.row, tableConstraint.celB.column)
          
          this.addConstraint({type: 'lessThan', variableA: variableA, variableB: variableB})
        } else if(tableConstraint.type == 'connectedTracks') {
          for(let r=0; r<rows; r++) {
            for(let c=0; c<columns; c++) {
              Tracks.forEach(track =>
                track.connections.forEach(connection => {
                  const consequenceCel = {
                    x: c+connection.x,
                    y: r+connection.y
                  }

                  const isCelGiven = table.table[r][c] != undefined
                  const isOutSideTable = this.isOutsideTable(consequenceCel.y, consequenceCel.x)

                  if(isOutSideTable && isCelGiven) return

                  let consequenceVariable = this.getVariableNameForCell(consequenceCel.y, consequenceCel.x)
                  let consequenceDomain = Tracks
                    .filter(t => {
                      let hasMatchingConnection = false
                      for(const c of t.connections) {
                        if(c.x == -connection.x && c.y == -connection.y) hasMatchingConnection = true
                      }
                      return hasMatchingConnection
                    })
                    .map(t => t.symbol)

                  if(isOutSideTable && !isCelGiven) {
                    consequenceVariable = this.getVariableNameForCell(r, c)
                    consequenceDomain = []
                  }
                  
                  this.addConstraint({
                    type: 'ifthen',
                    conditions: [{
                      type: 'variableIsEqualTo',
                      variable: this.getVariableNameForCell(r, c),
                      value: track.symbol
                    }], 
                    consequences: [{
                      type: 'setDomain',
                      variable: consequenceVariable,
                      domain: consequenceDomain
                    }]
                  })
                })
              )
            }
          }           
        } else if(tableConstraint.type == 'filledAdjacentCells') {
          let adjacentCells = this.getAdjacentCellVariables(tableConstraint.row, tableConstraint.column)         
          this.addConstraint({type: 'symbolCount', symbols: tableConstraint.symbols, count: tableConstraint.filledCells, group: adjacentCells})
        } else {
          throw new Error('Table constraint type not supported.')
        }
      }
    } 
  }

  private getAdjacentCellVariables(row: number, column: number): string[] {
    let adjacentCellVariables = []

    for(let rowAjacent=row-1; rowAjacent<=row + 1; rowAjacent++) {
      for(let columnAdjacent=column-1; columnAdjacent<=column+1; columnAdjacent++) {      
        if(this.isOutsideTable(rowAjacent, columnAdjacent)) continue
        if(rowAjacent == row && columnAdjacent == column) continue
        
        let variable = this.getTableVariable(rowAjacent, columnAdjacent).name
        adjacentCellVariables.push(variable)
      }
    }

    return adjacentCellVariables
  }    

  private isOutsideTable(row: number, column: number): boolean {
    if(this.table == undefined) throw Error('Table not defined.')
    
    return (
      row < 0 ||
      row > this.table?.rows - 1 ||
      column < 0 ||
      column > this.table?.columns - 1
    )
  }

  private getVariableNameForCell(row: number, column: number) {
    return `R${row}C${column}`
  }

  addTableVariable(row: number, column: number, domain: Domain) {
    const variableName = this.getVariableNameForCell(row, column)
    this.addVariable({name: variableName, domain: domain})
  }

  addVariable(variable: Variable): void {
    if(this.variableExists(variable)) {
      throw new Error(`Variable ${variable.name} already exists.`)
    } else {
      this.variables.push(variable)
    }
  }

  private variableExists(variableToCheck: Variable): boolean {
    return this.variables.some(variable => variable.name === variableToCheck.name)
  }

  addConstraint(constraint: Constraint): void {
    this.constraints.push(constraint)
  }

  private applyConstraints(variables: Variable[]): boolean {
    let totalDomainLengthBefore
    let totalDomainLengthAfter

    do {
      totalDomainLengthBefore = variables.reduce((sum, ele) => sum + ele.domain.length, 0)
      for(const constraint of this.constraints) {
        const result = this.applyConstraint(constraint, variables)
        if(!result) return false
      }
      totalDomainLengthAfter = variables.reduce((sum, ele) => sum + ele.domain.length, 0)
    } while(totalDomainLengthAfter < totalDomainLengthBefore)   
    
    return true
  }

  private applyConstraint(constraint: Constraint, variables: Variable[]): boolean {
    switch(constraint.type) {
      case 'distinctValues': return this.applyDistinctValuesConstraint(constraint.variables, variables)
      case 'greaterThan': return this.applyGreaterThanConstraint(constraint.variableA, constraint.variableB, variables)
      case 'lessThan': return this.applyLessThanConstraint(constraint.variableA, constraint.variableB, variables)
      case 'runLengths': return this.applyRunLengthsConstraint(constraint.symbol, constraint.runLengths, constraint.group, variables)
      case 'symbolCount': return this.applySymbolCountConstraint(constraint.symbols, constraint.count, constraint.group, variables)
      case 'ifthen': return this.applyIfThenConstraint(constraint.conditions, constraint.consequences, variables)
      case 'maxSymbolCount': return this.applyMaxSymbolCount(constraint.symbols, constraint.maxCount, constraint.group, variables)
      default: throw new Error('Constraint type not implemented.')
    }
  }

  private applyIfThenConstraint(conditions: Condition[], consequences: Consequence[], variables: Variable[]): boolean {
    let solutionStillPossible = true
    
    let allConditionsApply = true
    for(const condition of conditions) {
      if(condition.type == 'variableIsEqualTo') {
        const variable = this.getVariableFromVariables(condition.variable, variables)
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
      for(const consequence of consequences) {
        if(consequence.type === 'setDomain') {
          if(consequence.domain.length == 0) return false
          const variable = this.getVariableFromVariables(consequence.variable, variables)
          let filteredDomain = variable.domain.filter(value => consequence.domain.includes(value))
          if(filteredDomain.length == 0) solutionStillPossible = false
          if(filteredDomain.length === variable.domain.length) continue
          this.setVariableInVariables({name: consequence.variable, domain: filteredDomain}, variables)
        } else {
          throw new Error('Consequence type not supported.')
        }
      }
    }
    
    return solutionStillPossible
  }

  private applyDistinctValuesConstraint(group: string[], variables: Variable[]): boolean {  
    
    for(const groupVariableNameA of group) {
      let groupVariableA = this.getVariableFromVariables(groupVariableNameA, variables)
      if(groupVariableA.domain.length > 1) continue 
    
      for(const groupVariableNameB of group) {
        let groupVariableB = this.getVariableFromVariables(groupVariableNameB, variables)
        if(groupVariableA.name === groupVariableB.name) continue

        let filteredDomain = groupVariableB.domain.filter(value => value !== groupVariableA.domain[0])
        if(filteredDomain.length === groupVariableB.domain.length) continue
        if(filteredDomain.length == 0) return false

        this.setVariableInVariables({name: groupVariableB.name, domain: filteredDomain}, variables)
      }
    }
    
    return true
  }

  private applyGreaterThanConstraint(variableA: string, variableB: string, variables: Variable[]): boolean {   
    const variableAFromVariables = this.getVariableFromVariables(variableA, variables)
    const maxForVariableA = Math.max(...variableAFromVariables.domain)

    const variableBFromVariables = this.getVariableFromVariables(variableB, variables)
    const filteredDomain = variableBFromVariables.domain.filter(value => maxForVariableA > value)
    if(filteredDomain.length == 0) return false 

    this.setVariableInVariables({name: variableBFromVariables.name, domain: filteredDomain}, variables)

    return true
  }

  private applyLessThanConstraint(variableA: string, variableB: string, variables: Variable[]): boolean {  
    const variableAFromVariables = this.getVariableFromVariables(variableA, variables)
    const maxForVariableA = Math.min(...variableAFromVariables.domain)

    const variableBFromVariables = this.getVariableFromVariables(variableB, variables)
    const filteredDomain = variableBFromVariables.domain.filter(value => maxForVariableA < value)
    if(filteredDomain.length == 0) return false 

    this.setVariableInVariables({name: variableBFromVariables.name, domain: filteredDomain}, variables)

    return true
  }

  private applyRunLengthsConstraint(symbol: string, runLengths: number[], group: string[], variables: Variable[]): boolean {   
    let allHaveDomainOfOne = true
    for(const groupVariable of group) {
      let groupVariableFromVariables = this.getVariableFromVariables(groupVariable, variables)
      if(groupVariableFromVariables.domain.length != 1) allHaveDomainOfOne = false
    }

    let groupAsString = group.map(groupVariable => {
      const domain = this.getVariableFromVariables(groupVariable, variables).domain
      return domain.length == 1 ? domain : ' '
    }).join('')

    const regexp = new RegExp(`${symbol}+`, 'g')
    const matches = Array.from(groupAsString.matchAll(regexp))
    const actualRunLengths = matches.map(m => m[0].length)    
    const equal = runLengths.length === actualRunLengths.length && 
                  runLengths.every((value, index) => value === actualRunLengths[index])

    if(allHaveDomainOfOne) return equal

    if(equal) {
      for(const groupVariableName of group) {
        let groupVariable = this.getVariableFromVariables(groupVariableName, variables)
        if(groupVariable.domain.length > 1) {
          let filteredDomain = groupVariable.domain.filter(value => value !== symbol)
          if(filteredDomain.length === groupVariable.domain.length) continue
          if(filteredDomain.length == 0) return false

          this.setVariableInVariables({name: groupVariable.name, domain: filteredDomain}, variables)
        }
      }      
    }

    return true
  }

  private applySymbolCountConstraint(symbols: string[], count: number, group: string[], variables: Variable[]): boolean {
    let allHaveDomainOfOne = true
    for(const groupVariable of group) {
      let groupVariableFromVariables = this.getVariableFromVariables(groupVariable, variables)
      if(groupVariableFromVariables.domain.length != 1) allHaveDomainOfOne = false
    }

    let actualCount = group.reduce((acc, elem) => {
      const domain = this.getVariableFromVariables(elem, variables).domain
      if(domain.length > 1) return acc
      if(symbols.includes(this.getVariableFromVariables(elem, variables).domain[0])) {
        return acc + 1
      } else {
        return acc
      }
    }, 0)
    
    const equal = count == actualCount

    if(allHaveDomainOfOne) return equal

    if(equal) {
      for(const groupVariableName of group) {
        let groupVariable = this.getVariableFromVariables(groupVariableName, variables)
        if(groupVariable.domain.length > 1) {
          let filteredDomain = groupVariable.domain.filter(value => !symbols.includes(value))
          if(filteredDomain.length === groupVariable.domain.length) continue
          if(filteredDomain.length == 0) return false

          this.setVariableInVariables({name: groupVariable.name, domain: filteredDomain}, variables)
        }
      }      
    }

    return true
  }

  private applyMaxSymbolCount(symbols: string[], count: number, group: string[], variables: Variable[]): boolean {
    let allHaveDomainOfOne = true
    for(const groupVariable of group) {
      let groupVariableFromVariables = this.getVariableFromVariables(groupVariable, variables)
      if(groupVariableFromVariables.domain.length != 1) allHaveDomainOfOne = false
    }

    let actualCount = group.reduce((acc, elem) => {
      const domain = this.getVariableFromVariables(elem, variables).domain
      if(domain.length > 1) return acc
      if(symbols.includes(this.getVariableFromVariables(elem, variables).domain[0])) {
        return acc + 1
      } else {
        return acc
      }
    }, 0)
    
    const underMaximum = count >= actualCount
    if(allHaveDomainOfOne) return underMaximum

    const equalToMaximum = count == actualCount
    if(equalToMaximum) {
      for(const groupVariableName of group) {
        let groupVariable = this.getVariableFromVariables(groupVariableName, variables)
        if(groupVariable.domain.length > 1) {
          let filteredDomain = groupVariable.domain.filter(value => !symbols.includes(value))
          if(filteredDomain.length === groupVariable.domain.length) continue
          if(filteredDomain.length == 0) return false

          this.setVariableInVariables({name: groupVariable.name, domain: filteredDomain}, variables)
        }
      }      
    }

    return true
  }

  private getVariableFromVariables(variableName: string, variables: Variable[]): Variable {
    let variable = variables.find(v => v.name === variableName)
    if(!variable) throw new Error(`Variable ${variableName} not found`)
    return variable
  }


  getVariable(variableName: string): Variable {
    let variable = this.variables.find(v => v.name === variableName)
    if(!variable) throw new Error(`Variable ${variableName} not found`)
    return variable
  }

  private getTableVariableFromVariables(row: number, column: number, variables: Variable[]): Variable {
    const variableName = this.getVariableNameForCell(row, column)
    return this.getVariableFromVariables(variableName, variables)
  }

  getTableVariable(row: number, column: number): Variable {
    const variableName = this.getVariableNameForCell(row, column)
    return this.getVariable(variableName)
  }

  setVariable(variableToSet: Variable): void {
    let variable = this.variables.find(v => v.name === variableToSet.name)
    if(!variable) throw new Error(`Variable ${variableToSet.name} not found`)
    variable.domain = variableToSet.domain
  }

  private setVariableInVariables(variableToSet: Variable, variables: Variable[]): void {
    let variable = variables.find(v => v.name === variableToSet.name)
    if(!variable) throw new Error(`Variable ${variableToSet.name} not found`)
    variable.domain = variableToSet.domain
  }

  setTableVariable(row: number, column: number, domain: Domain): void {
    const variableName = this.getVariableNameForCell(row, column)
    this.setVariable({name: variableName, domain: domain})
  }

  printVariables(): void {
    console.log('Variables:')
    this.variables.forEach(variable => {
      console.log(`- Name: ${variable.name}, domain: [${variable.domain.join(', ')}]`)
    })
  }

  solve(): void {
    this.guesses = 0
    this.backTracked = 0

    const t0 = performance.now()

    let solverState: SolverState = {
      variables: Array.from(this.variables),
      solved: false
    } 
    
    const solution = this.solveRecursively(solverState)

    const solutionFound = solution.variables.every(v => v.domain.length == 1)

    const t1 = performance.now()
    if(solutionFound) {
      this.variables = solution.variables
      console.log(`Solved in ${Math.round(t1 - t0)} milliseconds.`)
      console.log(`Guesses: ${this.guesses} (backtracked: ${this.backTracked}).`)
      this.printTable()
    } else {
      console.log(`No solution found after ${Math.round(t1 - t0)} milliseconds.`)
    }
  }

  solveRecursively(solverState: SolverState): SolverState {

    const solutionStillPossible = this.applyConstraints(solverState.variables)

    if(!solutionStillPossible) {
      this.backTracked++
      return solverState
    }

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

    if(variableWithSmallestDomain.domain.length > 1) {
      this.guesses++
    }

    for(const value of variableWithSmallestDomain.domain) {
      let updatedVariables = structuredClone(solverState.variables)
      
      this.setVariableInVariables({
        name: variableWithSmallestDomain.name,
        domain: [value]
      }, updatedVariables)

      let result = this.solveRecursively({
        ...solverState,
        variables: updatedVariables, 
      })

      if(result.solved) {
        return result
      }
    }

    return solverState
  }

  printTable(): void {
    if(!this.table) return
    let output = []
    for(let r=0; r<this.table.rows; r++) {
      let row = []
      for(let c=0; c<this.table.columns; c++) {
        const domain = this.getVariableForCell(r, c).domain
        row.push(domain.length > 1 ? domain.join() : domain[0])
      }
      output.push(row)
    }

    console.table(output)
  }

  private getVariableForCell(row: number, column: number): Variable {
    const variableName = this.getVariableNameForCell(row, column)
    return this.getVariable(variableName)
  }
}