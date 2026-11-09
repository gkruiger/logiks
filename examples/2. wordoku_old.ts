import { Engine } from '../engine_old.ts'

class Wordoku {

  constructor(table: (string | undefined)[][]) {
   
    let engine = new Engine()
    
    engine.setTable({
      table: table,
      domain: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], 
      rowConstraints: [{type: 'distinctValues'}],
      columnConstraints: [{type: 'distinctValues'}],
      tableConstraints: [{type: 'adjacentCellsDifferent'}]
    })

    engine.solve()
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