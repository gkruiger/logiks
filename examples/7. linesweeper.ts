import { type InputConstraintTable, Engine, Tracks } from '../engine_old.ts'

class LineSweeper {

  constructor(table: (number | undefined)[][]) {
    
    const emptyCell = ' '
    const tracks = Tracks.map(t => t.symbol)

    const grid = table.map(row => row.map(cel => Number.isInteger(cel) ? emptyCell : undefined))

    let tableConstraints: InputConstraintTable[] = []
    for(let r=0; r<table.length; r++) {
      for(let c=0; c<table[r].length; c++) {
        const filledCells = table[r][c]
        if(filledCells !== undefined) {
          tableConstraints.push({
            type: 'filledAdjacentCells',
            symbols: tracks,
            filledCells: filledCells,
            row: r,
            column: c
          })
        }
      }
    }

    let engine = new Engine()

    engine.setTable({
      table: grid,
      domain: [emptyCell, ...tracks],
      tableConstraints: [
        ...tableConstraints,
        {type: 'connectedTracks'}
      ]
    })

    engine.solve()
  }

}

if(true) {
  const lineSweeper = new LineSweeper([
    [ ,  , 2,  ,  ,  ,  ,  , 2,],
    [ ,  , 5, 5,  ,  ,  ,  ,  ,],
    [ ,  ,  ,  ,  , 7,  ,  ,  ,],
    [ ,  ,  ,  ,  ,  ,  ,  ,  ,],
    [ ,  ,  , 6, 6,  , 7,  , 5,],
    [ ,  ,  ,  ,  ,  ,  ,  ,  ,],
    [4, 7,  ,  ,  ,  ,  , 8,  ,],
    [ ,  ,  , 7,  ,  ,  ,  ,  ,],
    [ ,  ,  ,  ,  ,  , 4,  ,  ,]
  ])
} else {
  const lineSweeper = new LineSweeper([
    [ ,  ,  ,],
    [ , 8,  ,],
    [ ,  ,  ,],
  ])
}

/*


*/
