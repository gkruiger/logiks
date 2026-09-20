import { expect, describe, test, beforeEach } from 'vitest'
import { Engine } from './engine.ts'

describe(`Interpreter`, () => {
  
  const engine = new Engine()

  beforeEach(() => {
    engine.reset()
  })

  describe(`General`, () => {

    test('Input handling', () => {
      expect(engine.process('A = TRUE')).toBe(undefined)  
      expect(engine.process(['A = TRUE', 'B = FALSE'])).toBe(undefined)  
    })

    test('Line handling', () => {
      expect(engine.process('A = TRUE')).toBe(undefined)  
      expect(engine.process('A = TRUE.')).toBe(undefined)  
      expect(engine.process('A = TRUE. B = FALSE')).toBe(undefined)  
      expect(engine.process('A = TRUE\nB = FALSE')).toBe(undefined)  
      expect(engine.process('A = TRUE.\nB = FALSE')).toBe(undefined)  
    })

    test('Output handling', () => {
      expect(engine.process('A = TRUE')).toBe(undefined)  
      expect(engine.process('A = TRUE. A?')).toBe(true)  
      expect(engine.process('A = TRUE. B = FALSE. A? B?')).toStrictEqual([true, false])  
    })
  })

  describe(`Variable`, () => {

    test('P = TRUE', () => {
      expect(() => engine.process('P')).toThrow()         // Error
      expect(() => engine.process('P =')).toThrow()       // Error
      expect(() => engine.process('P = Q')).toThrow()     // Error

      expect(engine.process('A = TRUE')).toBe(undefined)  // Set to true
      expect(engine.process('B = FALSE')).toBe(undefined) // Set to false
      expect(() => engine.process('B = UNKNOWN.')).toThrow()  // Error

      expect(() => engine.process('C = TRUE. C = FALSE.')).toThrow()  // Update to false  
      expect(() => engine.process('D = FALSE. D = TRUE.')).toThrow()  // Update to true
    })

    test('P = TRUE. P?', () => {
      expect(() => engine.process('?P')).toThrow()        // Error
      expect(() => engine.process('P = ?')).toThrow()     // Error
      expect(() => engine.process('P Q?')).toThrow()      // Error

      expect(engine.process('A?')).toBe(undefined)        // Undefined

      expect(engine.process('B = TRUE. B?')).toBe(true)   // True
      expect(engine.process('C = T. C?')).toBe(true)      // True
      expect(engine.process('D = FALSE. D?')).toBe(false) // False
      expect(engine.process('E = F. E?')).toBe(false)     // False
    })
  })

  describe(`XOR`, () => {

    test('P XOR Q = TRUE', () => {
      expect(() => engine.process('P XOR')).toThrow()                 // Error
      expect(() => engine.process('XOR P')).toThrow()                 // Error
      expect(() => engine.process('P XOR Q')).toThrow()               // Error
      expect(() => engine.process('P XOR Q =')).toThrow()             // Error
      expect(() => engine.process('P XOR XOR Q = FALSE')).toThrow()   // Error

      expect(engine.process('A XOR B = TRUE')).toBe(undefined)        // Set to true
      expect(engine.process('C XOR D = FALSE')).toBe(undefined)       // Set to false

      expect(() => engine.process('C XOR D = TRUE. C XOR D = FALSE.')).toThrow() // Update to false
      expect(() => engine.process('E XOR G = FALSE. E XOR G = TRUE.')).toThrow() // Update to true
    })

    test('P XOR Q = TRUE. P XOR Q?', () => {
      expect(engine.process('A XOR B?')).toBe(undefined)              // Undefined

      expect(engine.process('C XOR D = TRUE. C XOR D?')).toBe(true)   // True
      expect(engine.process('E XOR G = FALSE. E XOR G?')).toBe(false) // False

      expect(engine.process('H XOR I = TRUE. I XOR H?')).toBe(true)   // True even if switching left and right
      expect(engine.process('J XOR K = FALSE. K XOR J?')).toBe(false) // False even if switching left and right
    })

    test('P = TRUE. Q = FALSE. P XOR Q?', () => {
      expect(engine.process('A = TRUE. B = TRUE. A XOR B?')).toBe(false)      
      expect(engine.process('C = TRUE. D = FALSE. C XOR D?')).toBe(true)      
      expect(engine.process('E = TRUE. E XOR G?')).toBe(undefined)      
      expect(engine.process('H = FALSE. I = TRUE. H XOR I?')).toBe(true)      
      expect(engine.process('J = FALSE. K = FALSE. J XOR K?')).toBe(false)      
      expect(engine.process('L = FALSE. L XOR M?')).toBe(undefined)      
      expect(engine.process('O = TRUE. N XOR O?')).toBe(undefined)      
      expect(engine.process('Q = FALSE. P XOR Q?')).toBe(undefined)      
      expect(engine.process('R XOR S?')).toBe(undefined)      
    })

    test('P = TRUE. P XOR Q = TRUE. Q?', () => {  
      expect(engine.process('A = TRUE. A XOR B = TRUE. B?')).toBe(false)
      expect(engine.process('C = TRUE. C XOR D = FALSE. D?')).toBe(true)
      expect(engine.process('H = FALSE. H XOR I = TRUE. I?')).toBe(true)
      expect(engine.process('J = FALSE. J XOR K = FALSE. K?')).toBe(false)
      //expect(engine.process('N XOR O = TRUE. O?')).toBe(undefined)
      //expect(engine.process('P XOR Q = FALSE. Q?')).toBe(undefined)
    })

    test('Q = TRUE. P XOR Q = TRUE. P?', () => { 
      expect(engine.process('B = TRUE. A XOR B = TRUE. A?')).toBe(false)
      expect(engine.process('D = TRUE. C XOR D = FALSE. C?')).toBe(true)
      expect(engine.process('I = FALSE. H XOR I = TRUE. H?')).toBe(true)
      expect(engine.process('K = FALSE. J XOR K = FALSE. J?')).toBe(false)
      //expect(engine.process('N XOR O = TRUE. N?')).toBe(undefined)
      //expect(engine.process('P XOR Q = FALSE. P?')).toBe(undefined)
    })

  })

  describe(`AND`, () => {

    test('P AND Q = TRUE', () => {
      expect(() => engine.process('P AND')).toThrow()                 // Error
      expect(() => engine.process('AND P')).toThrow()                 // Error
      expect(() => engine.process('P AND Q')).toThrow()               // Error
      expect(() => engine.process('P AND Q =')).toThrow()             // Error
      expect(() => engine.process('P AND AND Q = FALSE')).toThrow()   // Error

      expect(engine.process('A AND B = TRUE')).toBe(undefined)        // Set to true
      expect(engine.process('C AND D = FALSE')).toBe(undefined)       // Set to false

      expect(() => engine.process('C AND D = TRUE. C AND D = FALSE.')).toThrow() // Update to false
      expect(() => engine.process('E AND G = FALSE. E AND G = TRUE.')).toThrow() // Update to true
    })

    test('P AND Q = TRUE. P AND Q?', () => {
      expect(engine.process('A AND B?')).toBe(undefined)              // Undefined

      expect(engine.process('C AND D = TRUE. C AND D?')).toBe(true)   // True
      expect(engine.process('E AND G = FALSE. E AND G?')).toBe(false) // False

      expect(engine.process('H AND I = TRUE. I AND H?')).toBe(true)   // True even if switching left and right
      expect(engine.process('J AND K = FALSE. K AND J?')).toBe(false) // False even if switching left and right
    })

    test('P = TRUE. Q = FALSE. P AND Q?', () => {
      expect(engine.process('A = TRUE. B = TRUE. A AND B?')).toBe(true)      
      expect(engine.process('C = TRUE. D = FALSE. C AND D?')).toBe(false)      
      expect(engine.process('E = TRUE. E AND G?')).toBe(undefined)      
      expect(engine.process('H = FALSE. I = TRUE. H AND I?')).toBe(false)      
      expect(engine.process('J = FALSE. K = FALSE. J AND K?')).toBe(false)      
      expect(engine.process('L = FALSE. L AND M?')).toBe(false)      
      expect(engine.process('O = TRUE. N AND O?')).toBe(undefined)      
      expect(engine.process('Q = FALSE. P AND Q?')).toBe(false)      
      expect(engine.process('R AND S?')).toBe(undefined)      
    })

    test('P = TRUE. P AND Q = TRUE. Q?', () => {  
      expect(engine.process('A = TRUE. A AND B = TRUE. B?')).toBe(true)
      expect(engine.process('C = TRUE. C AND D = FALSE. D?')).toBe(false)
      expect(() => engine.process('H = FALSE. H AND I = TRUE. I?')).toThrow()
      expect(engine.process('J = FALSE. J AND K = FALSE. K?')).toBe(undefined)
      //expect(engine.process('N AND O = TRUE. O?')).toBe(true)  
      //expect(engine.process('P AND Q = FALSE. Q?')).toBe(undefined)
    })

    test('Q = TRUE. P AND Q = TRUE. P?', () => { 
      expect(engine.process('B = TRUE. A AND B = TRUE. A?')).toBe(true)
      expect(engine.process('D = TRUE. C AND D = FALSE. C?')).toBe(false)
      expect(() => engine.process('I = FALSE. H AND I = TRUE. H?')).toThrow()
      expect(engine.process('K = FALSE. J AND K = FALSE. J?')).toBe(undefined)
      //expect(engine.process('N AND O = TRUE. N?')).toBe(true)
      //expect(engine.process('P AND Q = FALSE. P?')).toBe(false)
    })

  })
})