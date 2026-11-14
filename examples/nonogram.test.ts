import { expect, test } from 'vitest'

import { Nonogram } from './nonogram'

test('Nonogram', () => {

  const solutionFound = new Nonogram([
    [ 1, 1 ],
    [ 1 ],
    [ 3 ],
    [ 3 ],
    [ 4 ] 
  ], [ 
    [ 1 ],
    [ 1, 1 ],
    [ 3 ],
    [ 3 ],
    [ 2, 2 ] 
  ])

  const solution = [
    [ 'X', ' ', ' ', ' ', 'X' ],
    [ ' ', ' ', ' ', ' ', 'X' ],
    [ ' ', 'X', 'X', 'X', ' ' ],
    [ ' ', ' ', 'X', 'X', 'X' ],
    [ ' ', 'X', 'X', 'X', 'X' ],
  ]

  expect(solutionFound).toStrictEqual(solution)
})
