import { Engine } from '../engine.ts'
import { 
  Table, 
  Tracks,
  type InputConstraintRow, 
  type InputConstraintColumn,
  type InputConstraintTable
} from '../table.ts'

export class TrainTrack {

  constructor(data: (string | undefined)[][], rowHints: number[], columnHints: number[]) {
    
    let engine = new Engine()

    const emptyCell = ' '
    const domain = Tracks.map(t => t.symbol)
    const tracks = domain.filter(t => t !== emptyCell)

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

    return table.getSolution()
  }
}