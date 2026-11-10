import { expect, test } from 'vitest'

import { Wordoku } from './wordoku'

test('Wordoku', () => {

  const solutionFound = new Wordoku([
    [   , 'A', 'H',    ,    , 'G', 'B',    ,],
    ['B', 'D',    ,    ,    ,    , 'A', 'F',],
    ['A',    ,    ,    ,    ,    ,    , 'H',],
    [   ,    ,    , 'E', 'H',    ,    ,    ,],
    [   ,    ,    , 'B', 'A',    ,    ,    ,],
    ['E',    ,    ,    ,    ,    ,    , 'G',],
    ['F', 'G',    ,    ,    ,    , 'D', 'C',],
    [   , 'H', 'F',    ,    , 'C', 'E',    ,]
  ])

  const solution = [
    [ 'C', 'A', 'H', 'D', 'F', 'G', 'B', 'E' ],
    [ 'B', 'D', 'C', 'G', 'E', 'H', 'A', 'F' ],
    [ 'A', 'E', 'B', 'F', 'C', 'D', 'G', 'H' ],
    [ 'G', 'C', 'D', 'E', 'H', 'B', 'F', 'A' ],
    [ 'H', 'F', 'G', 'B', 'A', 'E', 'C', 'D' ],
    [ 'E', 'B', 'A', 'C', 'D', 'F', 'H', 'G' ],
    [ 'F', 'G', 'E', 'H', 'B', 'A', 'D', 'C' ],
    [ 'D', 'H', 'F', 'A', 'G', 'C', 'E', 'B' ],
  ]

  expect(solutionFound).toStrictEqual(solution)
})
