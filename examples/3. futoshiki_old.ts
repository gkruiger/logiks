import { Engine, type InputConstraintTable } from '../engine_old.ts'

class Futoshiki {

  constructor(table: (string)[][]) {
    let engine = new Engine()
    
    let numbersGrid: (number | undefined)[][] = []
    for(let r=0; r<table.length; r++) {
      if(r % 2 != 0) continue

      let row = []
      for(let c=0; c<table[r].length; c++) {
        let number: number | undefined = parseInt(table[r][c])
        if(Number.isNaN(number)) {
          number = undefined
        }
        if(c % 2 == 0) row.push(number ?? undefined)
      }
      numbersGrid.push(row)
    }

    let tableConstraints: InputConstraintTable[] = []
    for(let r=0; r<table.length; r++) {
      for(let c=0; c<table[r].length; c++) {     
        if(r % 2 == 0 && c % 2 != 0) {
          const left = {row: Math.floor(r/2), column: Math.floor((c-1)/2)}
          const right = {row: Math.floor(r/2), column: Math.floor((c+1)/2)}
    
          switch(table[r][c]) {
            case '<': tableConstraints.push({type: 'lessThan', celA: left, celB: right}); break
            case '>': tableConstraints.push({type: 'greaterThan', celA: left, celB: right}); break
            case ' ': break;
            default: throw new Error(`Operator ${table[r][c]} not supported.`)
          }
        } 
        if(r % 2 != 0 && c % 2 == 0) {
          const up = {row: Math.floor((r-1)/2), column: Math.floor(c/2)}
          const down = {row: Math.floor((r+1)/2), column: Math.floor(c/2)}

          switch(table[r][c]) {
            case '^': tableConstraints.push({type: 'lessThan', celA: up, celB: down}); break 
            case 'v': tableConstraints.push({type: 'greaterThan', celA: up, celB: down}); break
            case ' ': break;
            default: throw new Error(`Operator ${table[r][c]} not supported.`)
          }
        } 
      }
    }

    engine.setTable({
      table: numbersGrid,
      domain: Array.from({ length: (table.length + 1) / 2 }, (value, index) => index + 1), 
      rowConstraints: [{type: 'distinctValues'}],
      columnConstraints: [{type: 'distinctValues'}],
      tableConstraints: tableConstraints
    })

    engine.solve()
  }

}

const futoshiki = new Futoshiki([
  [ ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ' ],
  [ ' ', ' ', ' ', ' ', ' ', ' ', 'v', ' ',' ' ],
  [ ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ' ],
  [ ' ', ' ', ' ', ' ', ' ', ' ', 'v', ' ',' ' ],
  [ ' ', ' ', ' ', '<', '3', ' ', ' ', ' ',' ' ],
  [ ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ' ],
  [ ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ' ],
  [ ' ', ' ', ' ', ' ', 'v', ' ', ' ', ' ','v' ],
  [ ' ', '>', ' ', '>', ' ', '>', ' ', ' ',' ' ],
])

/*
┌─────────┬───┬───┬───┬───┬───┐
│ (index) │ 0 │ 1 │ 2 │ 3 │ 4 │
├─────────┼───┼───┼───┼───┼───┤
│ 0       │ 2 │ 3 │ 4 │ 5 │ 1 │
│ 1       │ 3 │ 5 │ 1 │ 4 │ 2 │
│ 2       │ 4 │ 1 │ 3 │ 2 │ 5 │
│ 3       │ 1 │ 2 │ 5 │ 3 │ 4 │
│ 4       │ 5 │ 4 │ 2 │ 1 │ 3 │
└─────────┴───┴───┴───┴───┴───┘
*/