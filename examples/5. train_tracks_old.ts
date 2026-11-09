import { type InputConstraintRow, type InputConstraintColumn, Engine, Tracks } from '../engine_old.ts'

class TrainTrack {

  constructor(table: (string | undefined)[][], rowHints: number[], columnHints: number[]) {
    
    const emptyCell = ' '
    const tracks = Tracks.map(t => t.symbol)

    let rowConstraints: InputConstraintRow[] = []    
    let columnConstraints: InputConstraintColumn[] = []

    for(let r=0; r<rowHints.length; r++) {
      rowConstraints.push({
        type: 'filledCells',
        symbols: tracks,
        filledCells: rowHints[r],
        row: r
      })
    }

    for(let c=0; c<columnHints.length; c++) {
      columnConstraints.push({
        type: 'filledCells',
        symbols: tracks,
        filledCells: columnHints[c],
        column: c
      })
    }

    let engine = new Engine()

    engine.setTable({
      table: table,
      domain: [emptyCell, ...tracks],
      rowConstraints: rowConstraints,
      columnConstraints: columnConstraints,
      tableConstraints: [{type: 'connectedTracks'}]
    })

    engine.solve()
  }

}

const trainTrack = new TrainTrack([
  [   ,   ,   ,   ,   ,],
  ['╝',   ,   ,   ,   ,],
  [   ,   ,   ,'═',   ,],
  [   ,   ,   ,   ,   ,],
  [   ,   ,'╗',   ,   ,],
],
  [5, 4, 3, 2, 2],
  [2, 3, 5, 3, 3]
)

/*

┌─────────┬─────┬─────┬─────┬─────┬─────┐
│ (index) │ 0   │ 1   │ 2   │ 3   │ 4   │
├─────────┼─────┼─────┼─────┼─────┼─────┤
│ 0       │ '╔' │ '═' │ '╗' │ '╔' │ '╗' │
│ 1       │ '╝' │ ' ' │ '╚' │ '╝' │ '║' │
│ 2       │ ' ' │ ' ' │ '╔' │ '═' │ '╝' │
│ 3       │ ' ' │ '╔' │ '╝' │ ' ' │ ' ' │
│ 4       │ ' ' │ '╚' │ '╗' │ ' ' │ ' ' │
└─────────┴─────┴─────┴─────┴─────┴─────┘

*/
