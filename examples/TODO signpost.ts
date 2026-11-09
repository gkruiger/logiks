import { Engine } from '../engine.ts'

class Signpost {

  constructor(numbers: (number | undefined)[][], arrows: (string | undefined)[][]) {
    
    let engine = new Engine()
    
    const table = {
      rows: numbers.length,
      columns: numbers[0].length
    }

    const maxDomain = table.rows * table.columns

    engine.setTable({
      table: numbers,
      domain: Array.from(Array(maxDomain)).map((e,i)=>i+1), 
      tableConstraint: {type: 'allDifferent'}
    })

    const directions: {arrow: string, x: number, y: number}[] = [
      {arrow: '🡔', x: -1, y: -1},
      {arrow: '🡕', x: +1, y: -1},
      {arrow: '🡖', x: +1, y: +1},
      {arrow: '🡗', x: -1, y: +1},
      {arrow: '🡐', x: -1, y: 0},
      {arrow: '🡒', x: +1, y: 0},
      {arrow: '🡑', x: 0, y: -1},
      {arrow: '🡓', x: 0, y: +1},
    ]

    for(let row=0; row<arrows.length; row++) {
      for(let column=0; column<arrows[row].length; column++) {
        const arrow = arrows[row][column]

        if(arrow === ' ') continue

        const direction = directions.find(d => d.arrow === arrow)
        if(direction === undefined) throw new Error(`Arrow '${arrows[row][column]}' not supported.`)
        
        let cellsToExclude = []

        let x = column
        let y = row
        while(x > 0 && x < table.columns - 1 && y >= 0 && y < table.rows - 1) {
          x += direction.x
          y += direction.y
          console.log(arrow, x, y)
          cellsToExclude.push(engine.getVariableNameForCell(x, y))
        } 
        
        for(let r=0; r<arrows.length; r++) {
          for(let c=0; c<arrows[r].length; c++) {
            let variable = engine.getTableVariable(r, c)
            if(cellsToExclude.includes(variable.name)) {
              console.log('skip')
            } else {
              console.log(variable.name)             
            }
          }
        }
      }
    }     

    engine.solve()
  
    engine.printTable()
  }

}

if(true) {
  const signpostTest = new Signpost([
    [ ,   ,   ,   ,   1, ],
    [  ,   ,   ,   ,   , ],
    [  ,   ,   ,   ,   , ],
    [  ,   ,   ,   ,   , ],
    [  ,   ,   ,   ,   , ],
  ], [
    [ ' ', ' ', '🡐', ' ', ' ',],
    [ ' ', ' ', ' ', ' ', ' ',],
    [ ' ', ' ', ' ', ' ', ' ',],
    [ ' ', ' ', ' ', ' ', ' ',],
    [ ' ', ' ', ' ', ' ', ' ',],
  ])
} else {
  const signpost = new Signpost([
    [ 1,   ,   , 12,   , ],
    [  ,   ,   ,   ,   , ],
    [  ,   ,   ,   ,   , ],
    [  ,   ,  5,   , 16, ],
    [ 8,   ,   ,   , 25, ],
  ], [
    [ '🡖', '🡓', '🡒', '🡗', '🡐',],
    [ '🡓', '🡖', '🡔', '🡐', '🡐',],
    [ '🡒', '🡒', '🡗', '🡖', '🡔',],
    [ '🡕', '🡗', '🡑', '🡓', '🡑',],
    [ '🡒', '🡒', '🡑', '🡔', ' ',],
  ])
}