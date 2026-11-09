import { type Domain, Engine, Tracks } from './engine.ts'
import { DistinctValuesConstraint } from './constraints/distinctValuesConstraint.ts'
import { GreaterThanConstraint } from './constraints/greaterThanConstraint.ts'
import { LessThanConstraint } from './constraints/lessThanConstraint.ts'
import { RunLengthConstraint } from './constraints/runLengthConstraint.ts'
import { SymbolsCountConstraint } from './constraints/symbolsCountConstraint.ts'
import { IfThenConstraint } from './constraints/ifThenConstraint.ts'
import { MaxSymbolsCountConstraint } from './constraints/maxSymbolsCountConstraint.ts'

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

export class Table {

  engine: Engine
  rows: number
  columns: number 

  constructor(input: {
    engine: Engine,
    data: any[][],
    domain: Domain,
    inputConstraintsRow?: InputConstraintRow[],
    inputConstraintsColumn?: InputConstraintColumn[],
    inputCOnstraintsDiagonalDown?: InputConstraintDiagonalDown[],
    inputCOnstraintsDiagonalUp?: InputConstraintDiagonalUp[],
    inputConstraintsTable?: InputConstraintTable[],
  }) {
    this.engine = input.engine

    this.rows = input.data.length
    this.columns = input.data[0].length

    this.addCellsAsVariables(input.data, input.domain)

    if(input.inputConstraintsRow) this.addRowConstraints(input.inputConstraintsRow)
    if(input.inputConstraintsColumn) this.addColumnConstraints(input.inputConstraintsColumn)
    if(input.inputCOnstraintsDiagonalDown) this.addDiagonalDownConstraints(input.inputCOnstraintsDiagonalDown)
    if(input.inputCOnstraintsDiagonalUp) this.addDiagonalUpConstraints(input.inputCOnstraintsDiagonalUp)
    if(input.inputConstraintsTable) this.addinputCOnstraintTables(input.inputConstraintsTable)
  }

  printTable(): void {
    let output = []
    for(let r=0; r<this.rows; r++) {
      let row = []
      for(let c=0; c<this.columns; c++) {
        const variableName = this.getVariableNameForCell(r, c)
        const domain = this.engine.getDomain(variableName)
        row.push(domain.length > 1 ? domain.join() : domain[0])
      }
      output.push(row)
    }

    console.table(output)
  }

  private addCellsAsVariables(data: any[][], domain: Domain): void {
    for(let r=0; r<this.rows; r++) {
      for(let c=0; c<this.columns; c++) {
        const valueForCell = data[r][c]
        const domainForCell = valueForCell == undefined ? domain : [valueForCell] 
        this.engine.addVariable({
          name: this.getVariableNameForCell(r, c), 
          domain: domainForCell
        })
      }
    }
  }

  private getVariableNameForCell(row: number, column: number): string {
    return `R${row}C${column}`
  }

  private addRowConstraints(inputConstraintsRow: InputConstraintRow[]): void {
    for(const inputConstraintRow of inputConstraintsRow) {
      if(inputConstraintRow.type === 'distinctValues') {
        for(let r=0; r<this.rows; r++) {
          let groupVariables = []
          for(let c=0; c<this.columns; c++) {
            groupVariables.push(
              this.getVariableNameForCell(r, c)
            )
          }
          
          this.engine.addConstraint(
            new DistinctValuesConstraint(groupVariables)
          )
        }
      } else if(inputConstraintRow.type === 'runLengths') {
        let groupVariables = []
        for(let column=0; column<this.columns; column++) {
          groupVariables.push(
            this.getVariableNameForCell(inputConstraintRow.row, column)
          )
        }
        this.engine.addConstraint(
          new RunLengthConstraint(
            this.engine,
            groupVariables, 
            inputConstraintRow.symbol, 
            inputConstraintRow.runLengths
          )
        )
      } else if(inputConstraintRow.type === 'filledCells') {
        let groupVariables = []
        for(let column=0; column<this.columns; column++) {
          groupVariables.push(
            this.getVariableNameForCell(inputConstraintRow.row, column)
          )
        }
        this.engine.addConstraint(
          new SymbolsCountConstraint(
            this.engine,
            groupVariables,
            inputConstraintRow.symbols,
            inputConstraintRow.filledCells, 
          )
        )
      } else {
        throw new Error('Row constraint type not supported.')
      }
    }
  }

  private addColumnConstraints(inputConstraintsColumn: InputConstraintColumn[]): void {
    for(const inputConstraintColumn of inputConstraintsColumn) {
      if(inputConstraintColumn.type == 'distinctValues') {
        for(let c=0; c<this.columns; c++) {
          let groupVariables = []
          for(let r=0; r<this.rows; r++) {
            groupVariables.push(
              this.getVariableNameForCell(r, c)
            )
          }
          this.engine.addConstraint(
            new DistinctValuesConstraint(groupVariables)
          )
        }
      } else if(inputConstraintColumn.type === 'runLengths') {
        let groupVariables = []
        for(let row=0; row<this.rows; row++) {
          groupVariables.push(
            this.getVariableNameForCell(row, inputConstraintColumn.column)
          )
        }
        this.engine.addConstraint(
          new RunLengthConstraint(
            this.engine,
            groupVariables, 
            inputConstraintColumn.symbol, 
            inputConstraintColumn.runLengths
          )
        )
      } else if(inputConstraintColumn.type === 'filledCells') {
        let groupVariables = []
        for(let row=0; row<this.rows; row++) {
          groupVariables.push(
            this.getVariableNameForCell(row, inputConstraintColumn.column)
          )
        }
        this.engine.addConstraint(
          new SymbolsCountConstraint(
            this.engine,
            groupVariables,
            inputConstraintColumn.symbols,
            inputConstraintColumn.filledCells, 
          )
        )
      } else {
        throw new Error('Column constraint type not supported.')
      }
    }
  }

  private addDiagonalDownConstraints(inputCOnstraintsDiagonalDown: InputConstraintDiagonalDown[]): void {
    for(const inputCOnstraintDiagonalDown of inputCOnstraintsDiagonalDown) {
      if(inputCOnstraintDiagonalDown.type == 'maxFilledCells') {
        let position = {
          row: 0,
          column: 0
        }

        position.row += inputCOnstraintDiagonalDown.diagonal
        
        if(position.row > this.rows - 1) {
          position.column = position.row - (this.rows - 1)
          position.row = this.rows - 1
        }

        let groupVariables = []
        do {
          groupVariables.push(
            this.getVariableNameForCell(position.row, position.column)
          )
          position.row -= 1,
          position.column += 1
        } while (position.row >= 0 && position.column < this.columns)
        
        this.engine.addConstraint(
          new MaxSymbolsCountConstraint(
            this.engine,
            groupVariables,
            inputCOnstraintDiagonalDown.symbols,
            inputCOnstraintDiagonalDown.maxFilledCells, 
          )
        )
      } else {
        throw new Error('Diagonal constraint type not supported.')
      }
    }
  }

  private addDiagonalUpConstraints(inputCOnstraintsDiagonalUp: InputConstraintDiagonalUp[]): void {
    for(const inputCOnstraintDiagonalUp of inputCOnstraintsDiagonalUp) {
      if(inputCOnstraintDiagonalUp.type == 'maxFilledCells') {
        let position = {
          row: this.rows - 1,
          column: 0
        }

        position.row -= inputCOnstraintDiagonalUp.diagonal
        
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
        } while (position.row < this.rows && position.column < this.columns)
        
        this.engine.addConstraint(
          new MaxSymbolsCountConstraint(
            this.engine,
            groupVariables,
            inputCOnstraintDiagonalUp.symbols,
            inputCOnstraintDiagonalUp.maxFilledCells, 
          )
        )
      } else {
        throw new Error('Diagonal constraint type not supported.')
      }
    }
  }

  private addinputCOnstraintTables(inputCOnstraintsTable: InputConstraintTable[]): void {
    for(const inputCOnstraintTable of inputCOnstraintsTable) {
      if(inputCOnstraintTable.type == 'adjacentCellsDifferent') {
        for(let r=0; r<this.rows; r++) {
          for(let c=0; c<this.columns; c++) {
            let variableA = this.getVariableNameForCell(r, c)
            let adjacentCells = this.getAdjacentCells(r, c)
            for(const adjecentCell of adjacentCells) {
              const groupVariables = [
                variableA, 
                this.getVariableNameForCell(adjecentCell.row, adjecentCell.column)
              ]
              this.engine.addConstraint(
                new DistinctValuesConstraint(groupVariables)
              )
            }
          }
        } 
      } else if(inputCOnstraintTable.type == 'distinctValuesForTheWholeTable') {
        let allTableVariables: string[] = []

        for(let r=0; r<this.rows; r++) {
          for(let c=0; c<this.columns; c++) {
            allTableVariables.push(
              this.getVariableNameForCell(r, c)
            )
          }
        } 
        /*
        this.engine.addConstraint({type: 'distinctValues', variables: allTableVariables})
        */
      } else if(inputCOnstraintTable.type == 'distinctValuesForSpecificCells') {
        let groupVariables: string[] = []

        for(const cel of inputCOnstraintTable.cels) {
          groupVariables.push(
            this.getVariableNameForCell(cel.row, cel.column)
          )
        }
        this.engine.addConstraint(
          new DistinctValuesConstraint(groupVariables)
        )
      } else if(inputCOnstraintTable.type == 'greaterThan') {
        const variableA = this.getVariableNameForCell(inputCOnstraintTable.celA.row, inputCOnstraintTable.celA.column)
        const variableB = this.getVariableNameForCell(inputCOnstraintTable.celB.row, inputCOnstraintTable.celB.column)
        this.engine.addConstraint(
          new GreaterThanConstraint(this.engine, variableA, variableB)
        )
      } else if(inputCOnstraintTable.type == 'lessThan') {
        const variableA = this.getVariableNameForCell(inputCOnstraintTable.celA.row, inputCOnstraintTable.celA.column)
        const variableB = this.getVariableNameForCell(inputCOnstraintTable.celB.row, inputCOnstraintTable.celB.column)
        this.engine.addConstraint(
          new LessThanConstraint(this.engine, variableA, variableB)
        )
      } else if(inputCOnstraintTable.type == 'connectedTracks') {
        for(let r=0; r<this.rows; r++) {
          for(let c=0; c<this.columns; c++) {
            Tracks.forEach(track =>
              track.connections.forEach(connection => {
                const consequenceCel = {
                  x: c+connection.x,
                  y: r+connection.y
                }

                const variableName = this.getVariableNameForCell(r, c)
                const domain = this.engine.getDomain(variableName)
                const isCelGiven = domain.length == 1
                const isOutSideTable = this.cellIsOutsideTable(consequenceCel.y, consequenceCel.x)

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
                
                this.engine.addConstraint(
                  new IfThenConstraint(
                    this.engine,
                    [{
                      type: 'variableIsEqualTo',
                      variable: this.getVariableNameForCell(r, c),
                      value: track.symbol
                    }], 
                    [{
                      type: 'setDomain',
                      variable: consequenceVariable,
                      domain: consequenceDomain
                    }]
                  )
                )
              })
            )
          }
        }           
      } else if(inputCOnstraintTable.type == 'filledAdjacentCells') {
        let adjacentCells = this.getAdjacentCells(inputCOnstraintTable.row, inputCOnstraintTable.column)
        let groupVariables = adjacentCells.map(cell => this.getVariableNameForCell(cell.row, cell.column))
        /*
        this.engine.addConstraint({type: 'symbolCount', symbols: inputCOnstraintTable.symbols, count: inputCOnstraintTable.filledCells, group: groupVariables})
        */
      } else {
        throw new Error('Table constraint type not supported.')
      }
    }
  }

  private getAdjacentCells(row: number, column: number): {row: number, column: number}[] {
    let adjacentCells: {row: number, column: number}[] = []

    for(let rowAjacent=row-1; rowAjacent<=row + 1; rowAjacent++) {
      for(let columnAdjacent=column-1; columnAdjacent<=column+1; columnAdjacent++) {      
        if(this.cellIsOutsideTable(rowAjacent, columnAdjacent)) continue
        if(rowAjacent == row && columnAdjacent == column) continue
        
        adjacentCells.push({
          row: rowAjacent, 
          column: columnAdjacent
        })
      }
    }

    return adjacentCells
  }

  private cellIsOutsideTable(row: number, column: number): boolean {    
    return (
      row < 0 ||
      row > this.rows - 1 ||
      column < 0 ||
      column > this.columns - 1
    )
  }

}