import { type InputConstraintRow, type InputConstraintColumn, type InputConstraintDiagonalDown, type InputConstraintDiagonalUp, Engine } from '../engine_old.ts'

class Queens {

  constructor(queens: number) {
    
    const emptyCell = ' '
    const queen = 'Q'

    const table = [...Array(queens)].map(e => Array(queens).fill(undefined))
    const domain = [emptyCell, queen]

    let rowConstraints: InputConstraintRow[] = []    
    for(let r=0; r<queens; r++) {
      rowConstraints.push({
        type: 'filledCells',
        symbols: [queen],
        filledCells: 1,
        row: r
      })
    }

    let columnConstraints: InputConstraintColumn[] = []
    for(let c=0; c<queens; c++) {
      columnConstraints.push({
        type: 'filledCells',
        symbols: [queen],
        filledCells: 1,
        column: c
      })
    }

    let diagonalDownConstraints: InputConstraintDiagonalDown[] = []
    for(let d=0; d<(queens * 2) - 1; d++) {
      diagonalDownConstraints.push({
        type: 'maxFilledCells',
        symbols: [queen],
        maxFilledCells: 1,
        diagonal: d
      })      
    }

    let diagonalUpConstraints: InputConstraintDiagonalUp[] = []
      for(let d=0; d<(queens * 2) - 1; d++) {
      diagonalUpConstraints.push({
        type: 'maxFilledCells',
        symbols: [queen],
        maxFilledCells: 1,
        diagonal: d
      })      
    }

    let engine = new Engine()

    engine.setTable({
      table: table,
      domain: domain,
      rowConstraints: rowConstraints,
      columnConstraints: columnConstraints,
      diagonalDownConstraints: diagonalDownConstraints,
      diagonalUpConstraints: diagonalUpConstraints
    })

    engine.solve()
  }

}

const queens = new Queens(8)