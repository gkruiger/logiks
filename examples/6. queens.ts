import { Engine } from '../engine.ts'
import { 
  Table, 
  type InputConstraintRow, 
  type InputConstraintColumn,
  type InputConstraintDiagonalDown,
  type InputConstraintDiagonalUp
} from '../table.ts'

class Queens {

  constructor(queens: number) {
    
    const emptyCell = ' '
    const queen = 'Q'

    const data = [...Array(queens)].map(e => Array(queens).fill(undefined))
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

    const table = new Table({
      engine: engine,
      data: data,
      domain: domain, 
      inputConstraintsRow: rowConstraints,
      inputConstraintsColumn: columnConstraints,
      inputCOnstraintsDiagonalDown: diagonalDownConstraints,
      inputCOnstraintsDiagonalUp: diagonalUpConstraints
    })
 
    engine.solve()

    table.printTable()
  }

}

const queens = new Queens(8)

/*

┌─────────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ (index) │ 0   │ 1   │ 2   │ 3   │ 4   │ 5   │ 6   │ 7   │
├─────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ 0       │ ' ' │ ' ' │ ' ' │ ' ' │ ' ' │ ' ' │ ' ' │ 'Q' │
│ 1       │ ' ' │ ' ' │ ' ' │ 'Q' │ ' ' │ ' ' │ ' ' │ ' ' │
│ 2       │ 'Q' │ ' ' │ ' ' │ ' ' │ ' ' │ ' ' │ ' ' │ ' ' │
│ 3       │ ' ' │ ' ' │ 'Q' │ ' ' │ ' ' │ ' ' │ ' ' │ ' ' │
│ 4       │ ' ' │ ' ' │ ' ' │ ' ' │ ' ' │ 'Q' │ ' ' │ ' ' │
│ 5       │ ' ' │ 'Q' │ ' ' │ ' ' │ ' ' │ ' ' │ ' ' │ ' ' │
│ 6       │ ' ' │ ' ' │ ' ' │ ' ' │ ' ' │ ' ' │ 'Q' │ ' ' │
│ 7       │ ' ' │ ' ' │ ' ' │ ' ' │ 'Q' │ ' ' │ ' ' │ ' ' │
└─────────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘

*/