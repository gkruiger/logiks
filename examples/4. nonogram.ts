import { Engine } from '../engine.ts'
import { 
  Table, 
  type InputConstraintRow, 
  type InputConstraintColumn 
} from '../table.ts'

class Nonogram {

  constructor(rowHints: number[][], columnHints: number[][]) {
    
    const rows = rowHints.length
    const columns = columnHints.length

    let data = [...Array(rows)].map(e => Array(columns).fill(undefined))

    const filledCell = 'X'
    const emptyCell = ' '
    const domain = [filledCell, emptyCell]

    let rowConstraints: InputConstraintRow[] = []    
    let columnConstraints: InputConstraintColumn[] = []

    for(let r=0; r<rowHints.length; r++) {
      rowConstraints.push({
        type: 'runLengths',
        symbol: filledCell,
        runLengths: rowHints[r],
        row: r
      })
    }

    for(let c=0; c<columnHints.length; c++) {
      columnConstraints.push({
        type: 'runLengths',
        symbol: filledCell,
        runLengths: columnHints[c],
        column: c
      })
    }

    let engine = new Engine()

    const table = new Table({
      engine: engine,
      data: data,
      domain: domain, 
      inputConstraintsRow: rowConstraints,
      inputConstraintsColumn: columnConstraints,
    })

    engine.solve()

    table.printTable()
  }
}

const nonogram = new Nonogram([
  [ 1, 1 ],
  [ 1 ],
  [ 3 ],
  [ 3 ],
  [ 4 ] 
], [ 
  [ 1 ],
  [ 1, 1 ],
  [ 3 ],
  [ 3 ],
  [ 2, 2 ] 
])

/*
┌─────────┬─────┬─────┬─────┬─────┬─────┐
│ (index) │ 0   │ 1   │ 2   │ 3   │ 4   │
├─────────┼─────┼─────┼─────┼─────┼─────┤
│ 0       │ 'X' │ ' ' │ ' ' │ ' ' │ 'X' │
│ 1       │ ' ' │ ' ' │ ' ' │ ' ' │ 'X' │
│ 2       │ ' ' │ 'X' │ 'X' │ 'X' │ ' ' │
│ 3       │ ' ' │ ' ' │ 'X' │ 'X' │ 'X' │
│ 4       │ ' ' │ 'X' │ 'X' │ 'X' │ 'X' │
└─────────┴─────┴─────┴─────┴─────┴─────┘
*/