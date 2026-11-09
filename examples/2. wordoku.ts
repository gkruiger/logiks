import { Engine } from '../engine.ts'
import { 
  Table, 
  type InputConstraintTable, 
  type InputConstraintRow, 
  type InputConstraintColumn 
} from '../table.ts'

class Wordoku {

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

    table.printTable()
  }
}

const wordoku = new Wordoku([
  [   , 'A', 'H',    ,    , 'G', 'B',    ,],
  ['B', 'D',    ,    ,    ,    , 'A', 'F',],
  ['A',    ,    ,    ,    ,    ,    , 'H',],
  [   ,    ,    , 'E', 'H',    ,    ,    ,],
  [   ,    ,    , 'B', 'A',    ,    ,    ,],
  ['E',    ,    ,    ,    ,    ,    , 'G',],
  ['F', 'G',    ,    ,    ,    , 'D', 'C',],
  [   , 'H', 'F',    ,    , 'C', 'E',    ,]
])

/*
┌─────────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ (index) │ 0   │ 1   │ 2   │ 3   │ 4   │ 5   │ 6   │ 7   │
├─────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ 0       │ 'C' │ 'A' │ 'H' │ 'D' │ 'F' │ 'G' │ 'B' │ 'E' │
│ 1       │ 'B' │ 'D' │ 'C' │ 'G' │ 'E' │ 'H' │ 'A' │ 'F' │
│ 2       │ 'A' │ 'E' │ 'B' │ 'F' │ 'C' │ 'D' │ 'G' │ 'H' │
│ 3       │ 'G' │ 'C' │ 'D' │ 'E' │ 'H' │ 'B' │ 'F' │ 'A' │
│ 4       │ 'H' │ 'F' │ 'G' │ 'B' │ 'A' │ 'E' │ 'C' │ 'D' │
│ 5       │ 'E' │ 'B' │ 'A' │ 'C' │ 'D' │ 'F' │ 'H' │ 'G' │
│ 6       │ 'F' │ 'G' │ 'E' │ 'H' │ 'B' │ 'A' │ 'D' │ 'C' │
│ 7       │ 'D' │ 'H' │ 'F' │ 'A' │ 'G' │ 'C' │ 'E' │ 'B' │
└─────────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
*/