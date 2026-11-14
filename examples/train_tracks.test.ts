import { expect, test } from 'vitest'

import { TrainTrack } from './train_tracks'

test('Train Tracks', () => {

  const solutionFound = new TrainTrack([
    [   ,   ,   ,   ,   ,],
    ['╝',   ,   ,   ,   ,],
    [   ,   ,   ,'═',   ,],
    [   ,   ,   ,   ,   ,],
    [   ,   ,'╗',   ,   ,],
  ],
    [5, 4, 3, 2, 2],
    [2, 3, 5, 3, 3]
  )

  const solution = [
    ['╔', '═', '╗', '╔', '╗', ],
    ['╝', ' ', '╚', '╝', '║', ],
    [' ', ' ', '╔', '═', '╝', ],
    [' ', '╔', '╝', ' ', ' ', ],
    [' ', '╚', '╗', ' ', ' ', ],
  ]
  
  expect(solutionFound).toStrictEqual(solution)
})

test.skip('Train Tracks', () => {

  const solutionFound = new TrainTrack([
    [   , '═',    ,],
    [   ,    ,    ,],
    ['╝', '╔',    ,],
  ],
    [3, 2, 3],
    [3, 2, 3]
  )

  const solution = [
    ['╔', '═', '╗'],
    ['║', ' ', '║'],
    ['╝', '╔', '╝'],
  ]
  
  expect(solutionFound).toStrictEqual(solution)
})
