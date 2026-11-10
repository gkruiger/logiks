import { Engine } from '../engine.ts'
import { 
  Table, 
  type InputConstraintTable, 
  type InputConstraintRow, 
  type InputConstraintColumn 
} from '../table.ts'

export class Sudoku {

  constructor(data: (number | undefined)[][], groups?: number[][]) {

    let engine = new Engine()

    const rows = data.length
    const columns = rows

    const domain = Array.from({ length: rows }, (value, index) => index + 1)

    let rowConstraints: InputConstraintRow[] = [{type: 'distinctValues'}]

    let columnConstraints: InputConstraintColumn[] = [{type: 'distinctValues'}]

    const defaultGroups = [
      [1, 1, 1, 2, 2, 2, 3, 3, 3 ],
      [1, 1, 1, 2, 2, 2, 3, 3, 3 ],
      [1, 1, 1, 2, 2, 2, 3, 3, 3 ],
      [4, 4, 4, 5, 5, 5, 6, 6, 6 ],
      [4, 4, 4, 5, 5, 5, 6, 6, 6 ],
      [4, 4, 4, 5, 5, 5, 6, 6, 6 ],
      [7, 7, 7, 8, 8, 8, 9, 9, 9 ],
      [7, 7, 7, 8, 8, 8, 9, 9, 9 ],
      [7, 7, 7, 8, 8, 8, 9, 9, 9 ],
    ]
    if(groups === undefined) groups = defaultGroups
    
    let tableConstraints: InputConstraintTable[] = []

    const groupIDs = [...new Set(groups.flat())]   
    for(const groupID of groupIDs) {
      let groupVariables:{row: number, column: number}[] = []
      for(let r=0; r<rows; r++) {
        for(let c=0; c<columns; c++) {
          if(groups[r][c] == groupID) {
            groupVariables.push({row: r, column: c})
          }
        }
      }
      tableConstraints.push({type: 'distinctValuesForSpecificCells', cels: groupVariables})
    }

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

const normalSudoku = new Sudoku([
  [ ,  ,  , 1,  , 2,  ,  ,  ,],
  [ , 6,  ,  ,  ,  ,  , 7,  ,],
  [ ,  , 8,  ,  ,  , 9,  ,  ,],
  [4,  ,  ,  ,  ,  ,  ,  , 3,],
  [ , 5,  ,  ,  , 7,  ,  ,  ,],
  [2,  ,  ,  , 8,  ,  ,  , 1,],
  [ ,  , 9,  ,  ,  , 8,  , 5,],
  [ , 7,  ,  ,  ,  ,  , 6,  ,],
  [ ,  ,  , 3,  , 4,  ,  ,  ,]
])


/*
┌─────────┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
│ (index) │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │
├─────────┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
│ 0       │ 9 │ 3 │ 4 │ 1 │ 7 │ 2 │ 6 │ 5 │ 8 │
│ 1       │ 5 │ 6 │ 1 │ 9 │ 4 │ 8 │ 3 │ 7 │ 2 │
│ 2       │ 7 │ 2 │ 8 │ 6 │ 3 │ 5 │ 9 │ 1 │ 4 │
│ 3       │ 4 │ 1 │ 7 │ 2 │ 6 │ 9 │ 5 │ 8 │ 3 │
│ 4       │ 8 │ 5 │ 3 │ 4 │ 1 │ 7 │ 2 │ 9 │ 6 │
│ 5       │ 2 │ 9 │ 6 │ 5 │ 8 │ 3 │ 7 │ 4 │ 1 │
│ 6       │ 1 │ 4 │ 9 │ 7 │ 2 │ 6 │ 8 │ 3 │ 5 │
│ 7       │ 3 │ 7 │ 2 │ 8 │ 5 │ 1 │ 4 │ 6 │ 9 │
│ 8       │ 6 │ 8 │ 5 │ 3 │ 9 │ 4 │ 1 │ 2 │ 7 │
└─────────┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
*/

const jigsawSudoku = new Sudoku([
  [ , 7, 4, 9,  ,  , 3,  ,  ,],
  [8,  , 6, 4, 5, 7,  , 2,  ,],
  [ ,  ,  , 8,  ,  , 7,  , 4,],
  [ , 8,  , 7,  ,  ,  ,  ,  ,],
  [ ,  ,  ,  ,  , 8,  ,  1  ,],
  [9,  ,  ,  ,  , 4, 6,  ,  ,],
  [ , 3,  , 1, 8, 9, 2,  ,  ,],
  [ ,  , 7,  , 6, 1,  ,  ,  ,],
  [ ,  ,  , 2, 4, 3,  ,  ,  ,]
], [
  [1, 1, 1, 1, 1, 2, 2, 3, 3 ],
  [1, 1, 4, 4, 4, 2, 2, 3, 3 ],
  [1, 1, 4, 4, 4, 2, 3, 3, 3 ],
  [5, 5, 4, 4, 4, 2, 2, 3, 3 ],
  [5, 5, 5, 5, 5, 2, 2, 7, 7 ],
  [6, 6, 6, 5, 5, 8, 8, 7, 7 ],
  [6, 6, 9, 9, 9, 8, 8, 7, 7 ],
  [6, 6, 9, 9, 9, 8, 7, 7, 7 ],
  [6, 6, 9, 9, 9, 8, 8, 8, 8 ],
])

/*
┌─────────┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
│ (index) │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │
├─────────┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
│ 0       │ 6 │ 7 │ 4 │ 9 │ 2 │ 5 │ 3 │ 8 │ 1 │
│ 1       │ 8 │ 1 │ 6 │ 4 │ 5 │ 7 │ 9 │ 2 │ 3 │
│ 2       │ 3 │ 5 │ 1 │ 8 │ 9 │ 2 │ 7 │ 6 │ 4 │
│ 3       │ 4 │ 8 │ 2 │ 7 │ 3 │ 6 │ 1 │ 5 │ 9 │
│ 4       │ 2 │ 9 │ 3 │ 6 │ 7 │ 8 │ 4 │ 1 │ 5 │
│ 5       │ 9 │ 2 │ 8 │ 5 │ 1 │ 4 │ 6 │ 3 │ 7 │
│ 6       │ 7 │ 3 │ 5 │ 1 │ 8 │ 9 │ 2 │ 4 │ 6 │
│ 7       │ 5 │ 4 │ 7 │ 3 │ 6 │ 1 │ 8 │ 9 │ 2 │
│ 8       │ 1 │ 6 │ 9 │ 2 │ 4 │ 3 │ 5 │ 7 │ 8 │
└─────────┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
*/