import { Engine, Tracks } from '../engine.ts'
import { 
  Table, 
  type InputConstraintRow, 
  type InputConstraintColumn,
  type InputConstraintTable
} from '../table.ts'

class TrainTrack {

  constructor(data: (string | undefined)[][], rowHints: number[], columnHints: number[]) {
    
    let engine = new Engine()

    const emptyCell = ' '
    const tracks = Tracks.map(t => t.symbol)
    const domain = [emptyCell, ...tracks]

    let rowConstraints: InputConstraintRow[] = []    
    for(let r=0; r<rowHints.length; r++) {
      rowConstraints.push({
        type: 'filledCells',
        symbols: tracks,
        filledCells: rowHints[r],
        row: r
      })
    }

    let columnConstraints: InputConstraintColumn[] = []
    for(let c=0; c<columnHints.length; c++) {
      columnConstraints.push({
        type: 'filledCells',
        symbols: tracks,
        filledCells: columnHints[c],
        column: c
      })
    }

    let tableConstraints: InputConstraintTable[] = [{type: 'connectedTracks'}]

    const table = new Table({
      engine: engine,
      data: data,
      domain: domain, 
      inputConstraintsRow: rowConstraints,
      inputConstraintsColumn: columnConstraints,
      inputConstraintsTable: tableConstraints
    })
 
    engine.solve()

    table.printTable()
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
