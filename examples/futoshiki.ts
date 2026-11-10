import { Engine } from '../engine.ts'
import { 
  Table, 
  type InputConstraintTable, 
  type InputConstraintRow, 
  type InputConstraintColumn 
} from '../table.ts'


export class Futoshiki {

  constructor(input: (string)[][]) {
    let engine = new Engine()
    
    let data: (number | undefined)[][] = []
    for(let r=0; r<input.length; r++) {
      if(r % 2 != 0) continue

      let row = []
      for(let c=0; c<input[r].length; c++) {
        let number: number | undefined = parseInt(input[r][c])
        if(Number.isNaN(number)) {
          number = undefined
        }
        if(c % 2 == 0) row.push(number ?? undefined)
      }
      data.push(row)
    }

    const domain = Array.from({ length: (input.length + 1) / 2 }, (value, index) => index + 1)
    let rowConstraints: InputConstraintRow[] = [{type: 'distinctValues'}]
    let columnConstraints: InputConstraintColumn[] = [{type: 'distinctValues'}]  
    let tableConstraints: InputConstraintTable[] = []

    for(let r=0; r<input.length; r++) {
      for(let c=0; c<input[r].length; c++) {     
        if(r % 2 == 0 && c % 2 != 0) {
          const left = {row: Math.floor(r/2), column: Math.floor((c-1)/2)}
          const right = {row: Math.floor(r/2), column: Math.floor((c+1)/2)}
    
          switch(input[r][c]) {
            case '<': tableConstraints.push({type: 'lessThan', celA: left, celB: right}); break
            case '>': tableConstraints.push({type: 'greaterThan', celA: left, celB: right}); break
            case ' ': break;
            default: throw new Error(`Operator ${input[r][c]} not supported.`)
          }
        } 
        if(r % 2 != 0 && c % 2 == 0) {
          const up = {row: Math.floor((r-1)/2), column: Math.floor(c/2)}
          const down = {row: Math.floor((r+1)/2), column: Math.floor(c/2)}

          switch(input[r][c]) {
            case '^': tableConstraints.push({type: 'lessThan', celA: up, celB: down}); break 
            case 'v': tableConstraints.push({type: 'greaterThan', celA: up, celB: down}); break
            case ' ': break;
            default: throw new Error(`Operator ${input[r][c]} not supported.`)
          }
        } 
      }
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