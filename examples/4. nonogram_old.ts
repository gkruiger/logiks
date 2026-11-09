import { type InputConstraintRow, type InputConstraintColumn, Engine } from '../engine_old.ts'

class Nonogram {

  constructor(rowHints: number[][], columnHints: number[][]) {
    
    const filledCell = 'X'
    const emptyCell = ' '
    
    const table = {
      rows: rowHints.length,
      columns: columnHints.length
    }

    let grid = [...Array(table.rows)].map(e => Array(table.columns).fill(undefined))

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

    engine.setTable({
      table: grid,
      domain: [filledCell, emptyCell],
      rowConstraints: rowConstraints,
      columnConstraints: columnConstraints
    })

    engine.solve()
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