import { expect, describe, test, beforeEach } from 'vitest'
import { Interpreter } from './logiks.js'

/*

  describe(`Add rule`, () => {
    
    beforeEach(() => {
      expect(() => engine.addFact({subject: `Elizabeth`, relation: `married to`, object: `Charles`})).not.toThrow()
    })
    
    describe(`Invalid rule`, () => {
      test(`Empty value`, () => {
        expect(() => engine.addRule({subject_variable: ``, relation: `married to`, object_variable: `SOMEONE_ELSE`}, {subject_variable: `SOMEONE_ELSE`, relation: `married to`, object_variable: `SOMEONE`})).toThrow(/Subject variable of condition needs to be at least one character long./)
        expect(() => engine.addRule({subject_variable: `SOMEONE`, relation: ``, object_variable: `SOMEONE_ELSE`}, {subject_variable: `SOMEONE_ELSE`, relation: `married to`, object_variable: `SOMEONE`})).toThrow(/Relation of condition needs to be at least one character long./)
        expect(() => engine.addRule({subject_variable: `SOMEONE`, relation: `married to`, object_variable: ``}, {subject_variable: `SOMEONE_ELSE`, relation: `married to`, object_variable: `SOMEONE`})).toThrow(/Object variable of condition needs to be at least one character long./)
        expect(() => engine.addRule({subject_variable: `SOMEONE`, relation: `married to`, object_variable: `SOMEONE_ELSE`}, {subject_variable: ``, relation: `married to`, object_variable: `SOMEONE`})).toThrow(/Subject variable of consequence needs to be at least one character long./)
        expect(() => engine.addRule({subject_variable: `SOMEONE`, relation: `married to`, object_variable: `SOMEONE_ELSE`}, {subject_variable: `SOMEONE_ELSE`, relation: ``, object_variable: `SOMEONE`})).toThrow(/Relation of consequence needs to be at least one character long./)
        expect(() => engine.addRule({subject_variable: `SOMEONE`, relation: `married to`, object_variable: `SOMEONE_ELSE`}, {subject_variable: `SOMEONE_ELSE`, relation: `married to`, object_variable: ``})).toThrow(/Object variable of consequence needs to be at least one character long./)
      })

      test(`Wrong format`, () => {
        //expect(() => engine.addRule({subject_variable: `SOMEONE`, relation: `married to`, object_variable: `SOMEONE_ELSE`}, {subject_variable: `SOMEONE_ELSE`, relation: `married to`, object_variable: `SOMEONE_ELSE_ENTIRELY`})).toThrow(/Subject variable of condition and object variable of consequence need to be the same./)
        //expect(() => engine.addRule({subject_variable: `SOMEONE`, relation: `married to`, object_variable: `SOMEONE_ELSE`}, {subject_variable: `SOMEONE_ELSE_ENTIRELY`, relation: `married to`, object_variable: `SOMEONE`})).toThrow(/Object variable of condition and subject variable of consequence need to be the same./)
      })
    })

    describe(`Valid rule`, () => {
      test(`A - r - B => B - r - A`, () => {
        expect(() => engine.addRule({subject_variable: `SOMEONE`, relation: `married to`, object_variable: `SOMEONE_ELSE`}, {subject_variable: `SOMEONE_ELSE`, relation: `married to`, object_variable: `SOMEONE`})).not.toThrow()
      })
      test(`A - r1 - B => B - r2 - A`, () => {
        expect(() => engine.addRule({subject_variable: `SOMEONE`, relation: `father of`, object_variable: `SOMEONE_ELSE`}, {subject_variable: `SOMEONE_ELSE`, relation: `child of`, object_variable: `SOMEONE`})).not.toThrow()
      })
      test(`A - r1 - B => A - r2 - B`, () => {
        expect(() => engine.addRule({subject_variable: `SOMEONE`, relation: `father of`, object_variable: `SOMEONE_ELSE`}, {subject_variable: `SOMEONE`, relation: `parent of`, object_variable: `SOMEONE_ELSE`})).not.toThrow()
      })
    })
    
    describe(`Apply rules`, () => {
      describe(`No rules`, () => {
        test(`Relation one way, is also the relation the other way around.`, () => {
        })
        test(`Bi-directional`, () => {
        })
      })

      beforeEach(() => {
        expect(() => engine.addFact({subject: `Elizabeth`, relation: `married to`, object: `Charles`})).not.toThrow()
        expect(() => engine.addRule({subject_variable: `SOMEONE`, relation: `married to`, object_variable: `SOMEONE_ELSE`}, {subject_variable: `SOMEONE_ELSE`, relation: `married to`, object_variable: `SOMEONE`})).not.toThrow()
      })

      test(`No matches`, () => {
        expect(engine.getMatchingFacts({subject: `William`, relation: `married to`, object: `Elizabeth`})).toStrictEqual([])
        expect(engine.getMatchingFacts({subject: `Charles`, relation: `friends with`, object: `Elizabeth`})).toStrictEqual([])
        expect(engine.getMatchingFacts({subject: `Charles`, relation: `married to`, object: `Sarah`})).toStrictEqual([])
      })

      test(`Match`, () => {
        expect(engine.getMatchingFacts({subject: `Charles`, relation: `married to`, object: `Elizabeth`})).toStrictEqual([{subject: `Charles`, relation: `married to`, object: `Elizabeth`}])
      })
    })

    test(`Having fun.... :-)`, () => {
      expect(() => engine.addFact({subject: `ZGV`, relation: `father of`, object: `Jasper`})).not.toThrow()
      expect(() => engine.addRule({subject_variable: `SOMEONE`, relation: `father of`, object_variable: `SOMEONE_ELSE`}, {subject_variable: `SOMEONE_ELSE`, relation: `child of`, object_variable: `SOMEONE`})).not.toThrow()
      expect(engine.getMatchingFacts({subject: `Jasper`, relation: `child of`, object: `ZGV`})).toStrictEqual([{subject: `Jasper`, relation: `child of`, object: `ZGV`}])
     })
  })
})
*/

describe(`Interpreter`, () => {
  
  let interpreter = new Interpreter()

  beforeEach(() => {
    interpreter.reset()
  })

  describe(`General`, () => {
    test('No input', () => {
      expect(interpreter.process([])).toBe('')
      expect(interpreter.process([''])).toBe('')
      expect(interpreter.process([' '])).toBe('')
    })
  })

  describe(`Add fact`, () => {
    describe(`Invalid facts`, () => {
      test('Missing an element', () => {
        expect(interpreter.process([`- mother - Charles.`])).toBe(`Error parsing line 1: subject expected.`)  
        expect(interpreter.process([`Elizabeth mother - Charles.`])).toBe(`Error parsing line 1: '-' expected after subject.`)       
        expect(interpreter.process([`Elizabeth -  - Charles.`])).toBe(`Error parsing line 1: relation expected after '-'.`)
        expect(interpreter.process([`Elizabeth - mother Charles.`])).toBe(`Error parsing line 1: '-' expected after relation.`)       
        expect(interpreter.process([`Elizabeth - mother - .`])).toBe(`Error parsing line 1: object expected after '-'.`)  
        expect(interpreter.process([`Elizabeth - mother - Charles`])).toBe(`Error parsing line 1: expected '.', '!' or '?' after object.`)  
      })
      test('Something after the fact', () => {
        expect(interpreter.process([`Elizabeth - mother - Charles. Elizabeth`])).toBe(`Error parsing line 1: unexpected token after fact.`)  
        expect(interpreter.process([`Elizabeth - mother - Charles. -`])).toBe(`Error parsing line 1: unexpected token after fact.`)  
        expect(interpreter.process([`Elizabeth - mother - Charles. .`])).toBe(`Error parsing line 1: unexpected token after fact.`)  
      })
      test('Uing a wildcard.', () => {
        expect(interpreter.process([`* - mother - Charles.`])).toBe(`Error parsing line 1: wildcards are not allowed in facts.`)  
        expect(interpreter.process([`Elizabeth - * - Charles.`])).toBe(`Error parsing line 1: wildcards are not allowed in facts.`)  
        expect(interpreter.process([`Elizabeth - mother - *.`])).toBe(`Error parsing line 1: wildcards are not allowed in facts.`)  
      })
      test('Uing a variable.', () => {
        expect(interpreter.process([`<Elizabeth> - mother - Charles.`])).toBe(`Error parsing line 1: variables are not allowed in facts.`)  
        expect(interpreter.process([`Elizabeth - <mother> - Charles.`])).toBe(`Error parsing line 1: variables are not allowed in facts.`)  
        expect(interpreter.process([`Elizabeth - mother - <Charles>.`])).toBe(`Error parsing line 1: variables are not allowed in facts.`)  
      })
    })
    test(`Valid facts`, () => {
      expect(interpreter.process([`Elizabeth-mother-Charles.`])).toBe('Ok.')
      expect(interpreter.process([`Elizabeth - mother - Charles.`])).toBe('Ok.')
      expect(interpreter.process([`Elizabeth - mother - Charles.`, `Harry - father - Charles.`])).toBe('Ok.\nOk.')   
    })
  })

  describe(`Query facts`, () => {
    describe(`Invalid queries`, () => {
      test('Missing an element', () => {
        expect(interpreter.process([` - mother - Charles?`])).toBe(`Error parsing line 1: subject expected.`)
        expect(interpreter.process([`Elizabeth mother - Charles?`])).toBe(`Error parsing line 1: '-' expected after subject.`)
        expect(interpreter.process([`Elizabeth -  - Charles?`])).toBe(`Error parsing line 1: relation expected after '-'.`)
        expect(interpreter.process([`Elizabeth - mother Charles?`])).toBe(`Error parsing line 1: '-' expected after relation.`)
        expect(interpreter.process([`Elizabeth - mother - ?`])).toBe(`Error parsing line 1: object expected after '-'.`)
        expect(interpreter.process([`Elizabeth - mother - Charles`])).toBe(`Error parsing line 1: expected '.', '!' or '?' after object.`)  
      })
      test('Something after the query', () => {
        expect(interpreter.process([`Elizabeth - mother - Charles? Elizabeth`])).toBe(`Error parsing line 1: unexpected token after query.`)  
        expect(interpreter.process([`Elizabeth - mother - Charles?. -`])).toBe(`Error parsing line 1: unexpected token after query.`)  
        expect(interpreter.process([`Elizabeth - mother - Charles?. .`])).toBe(`Error parsing line 1: unexpected token after query.`)  
      })
      test('Uing a variable.', () => {
        expect(interpreter.process([`<Elizabeth> - mother - Charles?`])).toBe(`Error parsing line 1: variables are not allowed in queries.`)  
        expect(interpreter.process([`Elizabeth - <mother> - Charles?`])).toBe(`Error parsing line 1: variables are not allowed in queries.`)  
        expect(interpreter.process([`Elizabeth - mother - <Charles>?`])).toBe(`Error parsing line 1: variables are not allowed in queries.`)  
      })
    })
    describe(`Valid queries`, () => {
      describe(`Exact queries`, () => {
        beforeEach(() => {
          expect(interpreter.process([`Elizabeth - mother - Charles.`, `Charles - father - Harry.`])).toBe(`Ok.\nOk.`)
        })

        test('No match', () => {
          expect(interpreter.process([`Charles - mother - Charles?`])).toBe(`No.`)
          expect(interpreter.process([`Elizabeth - father - Harry?`])).toBe(`No.`)
          expect(interpreter.process([`Elizabeth - mother - Harry?`])).toBe(`No.`)
          expect(interpreter.process([`Charles - mother - Elizabeth?`])).toBe(`No.`)
        })
        test('Match', () => {
          expect(interpreter.process([`Elizabeth - mother - Charles?`])).toBe(`Yes.`)
        })
      })
      describe(`Wildcard queries`, () => {
        test(`No match`, () => {
          interpreter.reset()
          expect(interpreter.process([`Elizabeth - mother - Charles.`, `Charles - father - Harry.`])).toBe(`Ok.\nOk.`)

          expect(interpreter.process([`* - father - Charles?`])).toBe(`No matches found.`)
          expect(interpreter.process([`Harry - * - Charles?`])).toBe(`No matches found.`)
          expect(interpreter.process([`Elizabeth - father - *?`])).toBe(`No matches found.`)
      })
        test(`One match`, () => {
          interpreter.reset()
          expect(interpreter.process([`Elizabeth - mother - Charles.`, `Charles - father - Harry.`])).toBe(`Ok.\nOk.`)

          expect(interpreter.process([`* - mother - Charles?`])).toBe(`Elizabeth.`)
          expect(interpreter.process([`Elizabeth - * - Charles?`])).toBe(`mother.`)
          expect(interpreter.process([`Elizabeth - mother - *?`])).toBe(`Charles.`)
          expect(interpreter.process([`* - mother - *?`])).toBe(`Elizabeth - mother - Charles.`)
          expect(interpreter.process([`Elizabeth - * - *?`])).toBe(`Elizabeth - mother - Charles.`)
          expect(interpreter.process([`* - * - Charles?`])).toBe(`Elizabeth - mother - Charles.`)
          
          interpreter.reset()
          expect(interpreter.process([`Elizabeth - mother - Charles.`])).toBe(`Ok.`)
          expect(interpreter.process([`* - * - *?`])).toBe(`Elizabeth - mother - Charles.`)
        })
        test(`Two matches`, () => {
          interpreter.reset()
          expect(interpreter.process([`Elizabeth - mother - Charles.`, `Charles - father - Harry.`])).toBe(`Ok.\nOk.`)
          expect(interpreter.process([`* - * - *?`])).toBe(`Elizabeth - mother - Charles and Charles - father - Harry.`)
          
          interpreter.reset()
          expect(interpreter.process([`Elizabeth - mother - Charles.`, `Elizabeth - mother - Harry.`, `Elizabeth - wife - William.`])).toBe(`Ok.\nOk.\nOk.`)
          expect(interpreter.process([`Elizabeth - mother - *?`])).toBe(`Charles and Harry.`)    
        })
        test(`Three matches`, () => {
          interpreter.reset()
          expect(interpreter.process([`Elizabeth - mother - Charles.`, `Charles - father - Harry.`, `Charles - brother - William.`])).toBe(`Ok.\nOk.\nOk.`)
          expect(interpreter.process([`* - * - *?`])).toBe(`Elizabeth - mother - Charles, Charles - father - Harry and Charles - brother - William.`)

          interpreter.reset()
          expect(interpreter.process([`Elizabeth - mother - Charles.`, `Elizabeth - mother - Harry.`, `Elizabeth - mother - Sarah.`,`Elizabeth - wife - William.`])).toBe(`Ok.\nOk.\nOk.\nOk.`)
          expect(interpreter.process([`Elizabeth - mother - *?`])).toBe(`Charles, Harry and Sarah.`)            
        })
        test(`Four matches`, () => {
          interpreter.reset()
          expect(interpreter.process([`Elizabeth - mother - Charles.`, `Charles - father - Harry.`, `Charles - brother - William.`, `Sarah - sister - Anne.`])).toBe(`Ok.\nOk.\nOk.\nOk.`)
          expect(interpreter.process([`* - * - *?`])).toBe(`Elizabeth - mother - Charles, Charles - father - Harry, Charles - brother - William and Sarah - sister - Anne.`)

          interpreter.reset()
          expect(interpreter.process([`Elizabeth - mother - Charles.`, `Elizabeth - mother - Harry.`, `Elizabeth - mother - Sarah.`, `Elizabeth - mother - Claire.`, `Elizabeth - wife - William.`])).toBe(`Ok.\nOk.\nOk.\nOk.\nOk.`)
          expect(interpreter.process([`Elizabeth - mother - *?`])).toBe(`Charles, Harry, Sarah and Claire.`)  
        })
      })
    })
    test('Multiple queries', () => {
      expect(interpreter.process([`Elizabeth - mother - Charles.`, `Charles - father - Harry.`, `Charles - brother - William.`, `Sarah - sister - Anne.`])).toBe(`Ok.\nOk.\nOk.\nOk.`)
      expect(interpreter.process([`Elizabeth - mother - Harry?`, `Elizabeth - * - Harry?`, `Elizabeth - * - Charles?`, `* - mother - *?`])).toBe(`No.\nNo matches found.\nmother.\nElizabeth - mother - Charles.`)
    })

  })
})