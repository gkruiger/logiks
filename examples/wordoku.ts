import { Engine } from '../engine'
import { 
  Table, 
  type InputConstraintTable, 
  type InputConstraintRow, 
  type InputConstraintColumn 
} from '../table'

export class Wordoku {

  constructor(data: (string | undefined)[][]) {

    let engine = new Engine()

    const size = data.length

    const domain = Array.from({ length: size }, (_element, index) => String.fromCharCode(65 + index));
    let rowConstraints: InputConstraintRow[] = [{type: 'distinctValues'}]
    let columnConstraints: InputConstraintColumn[] = [{type: 'distinctValues'}]  
    let tableConstraints: InputConstraintTable[] = [{type: 'adjacentCellsDifferent'}]

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