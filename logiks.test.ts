import { expect, describe, test, beforeEach } from 'vitest'
import { Interpreter } from './logiks.js'

/*
describe(`Engine`, () => {

  let engine = new Engine()

  beforeEach(() => {
    engine.reset()
  })

  describe(`Add fact`, () => {
    test(`Invalid fact`, () => {
      expect(() => engine.addFact({subject: ``, relation: `mother`, object: `Charles`})).toThrow(/Subject needs to be at least one character long./)
      expect(() => engine.addFact({subject: `Elizabeth`, relation: ``, object: `Charles`})).toThrow(/Relation needs to be at least one character long./)
      expect(() => engine.addFact({subject: `Elizabeth`, relation: `mother`, object: ``})).toThrow(/Object needs to be at least one character long./)
    })    
    test(`Valid fact`, () => {
      expect(() => engine.addFact({subject: `Elizabeth`, relation: `mother`, object: `Charles`})).not.toThrow()
    })
  })

  describe(`Get matching facts`, () => {
    beforeEach(() => {
      expect(() => engine.addFact({subject: `Elizabeth`, relation: `mother`, object: `Charles`})).not.toThrow()
      expect(() => engine.addFact({subject: `Charles`, relation: `father`, object: `Harry`})).not.toThrow()
    })
    describe(`Full query`, () => {
      test(`No match`, () => {
        expect(engine.getMatchingFacts({subject: `Charles`, relation: `mother`, object: `Charles`})).toStrictEqual([])   
        expect(engine.getMatchingFacts({subject: `Elizabeth`, relation: `father`, object: `Charles`})).toStrictEqual([])   
        expect(engine.getMatchingFacts({subject: `Elizabeth`, relation: `mother`, object: `Harry`})).toStrictEqual([])   
      })
      test(`Match`, () => {
        expect(engine.getMatchingFacts({subject: `Elizabeth`, relation: `mother`, object: `Charles`})).toStrictEqual([{subject: `Elizabeth`, relation: `mother`, object: `Charles`}])   
      })
    })
    describe(`Partial query`, () => {
      test(`No match`, () => {
        expect(engine.getMatchingFacts({subject: undefined, relation: `father`, object: `Charles`})).toStrictEqual([])   
        expect(engine.getMatchingFacts({subject: undefined, relation: `mother`, object: `Harry`})).toStrictEqual([])   
        expect(engine.getMatchingFacts({subject: `Charles`, relation: undefined, object: `Charles`})).toStrictEqual([])   
        expect(engine.getMatchingFacts({subject: `Elizabeth`, relation: undefined, object: `Harry`})).toStrictEqual([])   
        expect(engine.getMatchingFacts({subject: `Charles`, relation: `mother`, object: undefined})).toStrictEqual([])   
        expect(engine.getMatchingFacts({subject: `Elizabeth`, relation: `father`, object: undefined})).toStrictEqual([])   
        expect(engine.getMatchingFacts({subject: undefined, relation: undefined, object: `Elizabeth`})).toStrictEqual([])   
        expect(engine.getMatchingFacts({subject: undefined, relation: `brother`, object: undefined})).toStrictEqual([])   
        expect(engine.getMatchingFacts({subject: `Harry`, relation: undefined, object: undefined})).toStrictEqual([])   
      })
      test(`Match`, () => {
        expect(engine.getMatchingFacts({subject: undefined, relation: `mother`, object: `Charles`})).toStrictEqual([{subject: `Elizabeth`, relation: `mother`, object: `Charles`}])   
        expect(engine.getMatchingFacts({subject: `Elizabeth`, relation: undefined, object: `Charles`})).toStrictEqual([{subject: `Elizabeth`, relation: `mother`, object: `Charles`}])   
        expect(engine.getMatchingFacts({subject: `Elizabeth`, relation: `mother`, object: undefined})).toStrictEqual([{subject: `Elizabeth`, relation: `mother`, object: `Charles`}])   
        expect(engine.getMatchingFacts({subject: undefined, relation: undefined, object: `Charles`})).toStrictEqual([{subject: `Elizabeth`, relation: `mother`, object: `Charles`}])   
        expect(engine.getMatchingFacts({subject: undefined, relation: `mother`, object: undefined})).toStrictEqual([{subject: `Elizabeth`, relation: `mother`, object: `Charles`}])   
        expect(engine.getMatchingFacts({subject: `Elizabeth`, relation: undefined, object: undefined})).toStrictEqual([{subject: `Elizabeth`, relation: `mother`, object: `Charles`}])   
        expect(engine.getMatchingFacts({subject: undefined, relation: undefined, object: undefined})).toStrictEqual([{subject: `Elizabeth`, relation: `mother`, object: `Charles`}, {subject: `Charles`, relation: `father`, object: `Harry`}])   
      })
    })
  })

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

  test(`No input`, () => {
    expect(interpreter.process([])).toBe(`Error: no input.`)
    expect(interpreter.process([``])).toBe(`Error: no input.`)
    expect(interpreter.process([` `])).toBe(`Error: no input.`)
  })

  describe(`Add fact`, () => {
    describe(`Invalid facts`, () => {
      test('Missing an element', () => {
        expect(interpreter.process([`- mother - Charles.`])).toBe(`Error parsing line 1: subject expected.`)  
        expect(interpreter.process([`Elizabeth mother - Charles.`])).toBe(`Error parsing line 1: '-' expected after subject.`)       
        expect(interpreter.process([`Elizabeth -  - Charles.`])).toBe(`Error parsing line 1: relation expected after '-'.`)
        expect(interpreter.process([`Elizabeth - mother Charles.`])).toBe(`Error parsing line 1: '-' expected after relation.`)       
        expect(interpreter.process([`Elizabeth - mother - .`])).toBe(`Error parsing line 1: object expected after '-'.`)  
        expect(interpreter.process([`Elizabeth - mother - Charles`])).toBe(`Error parsing line 1: expected '.' or '?' after object.`)  
      })
      test('Uing a wildcard.', () => {
        expect(interpreter.process([`* - mother - Charles.`])).toBe(`Error parsing line 1: wildcards are not allowed in facts.`)  
        expect(interpreter.process([`Elizabeth - * - Charles.`])).toBe(`Error parsing line 1: wildcards are not allowed in facts.`)  
        expect(interpreter.process([`Elizabeth - mother - *.`])).toBe(`Error parsing line 1: wildcards are not allowed in facts.`)  
      })
    })
    test(`Valid facts`, () => {
      expect(interpreter.process([`Elizabeth-mother-Charles.`])).toBe(`Ok.`)
      expect(interpreter.process([`Elizabeth - mother - Charles.`])).toBe(`Ok.`)
      expect(interpreter.process([`Elizabeth - mother - Charles.`, `Harry - father - Charles.`])).toBe(`Ok.\nOk.`)   
    })
  })

  describe(`Query facts`, () => {
    describe(`Full queries`, () => {
      describe(`Invalid queries`, () => {
        test('Missing an element', () => {
          expect(interpreter.process([` - mother - Charles?`])).toBe(`Error parsing line 1: subject expected.`)
          expect(interpreter.process([`Elizabeth mother - Charles?`])).toBe(`Error parsing line 1: '-' expected after subject.`)
          expect(interpreter.process([`Elizabeth -  - Charles?`])).toBe(`Error parsing line 1: relation expected after '-'.`)
          expect(interpreter.process([`Elizabeth - mother Charles?`])).toBe(`Error parsing line 1: '-' expected after relation.`)
          expect(interpreter.process([`Elizabeth - mother - ?`])).toBe(`Error parsing line 1: object expected after '-'.`)
          expect(interpreter.process([`Elizabeth - mother - Charles`])).toBe(`Error parsing line 1: expected '.' or '?' after object.`)  
        })
        test('Question mark in wrong place', () => {
          expect(interpreter.process([`?Elizabeth - mother - Charles?`])).toBe(`Error parsing line 1: subject expected.`)
          expect(interpreter.process([`Eli?zabeth - mother - Charles?`])).toBe(`Error parsing line 1: '-' expected after subject.`)
          expect(interpreter.process([`Elizabeth? - mother - Charles?`])).toBe(`Error parsing line 1: '-' expected after subject.`)
          expect(interpreter.process([`Elizabeth ?- mother - Charles?`])).toBe(`Error parsing line 1: '-' expected after subject.`)
          expect(interpreter.process([`Elizabeth -? mother - Charles?`])).toBe(`Error parsing line 1: relation expected after '-'.`)
          expect(interpreter.process([`Elizabeth - ?mother - Charles?`])).toBe(`Error parsing line 1: relation expected after '-'.`)
          expect(interpreter.process([`Elizabeth - mot?her - Charles?`])).toBe(`Error parsing line 1: '-' expected after relation.`)
          expect(interpreter.process([`Elizabeth - mother? - Charles?`])).toBe(`Error parsing line 1: '-' expected after relation.`)
          expect(interpreter.process([`Elizabeth - mother ?- Charles?`])).toBe(`Error parsing line 1: '-' expected after relation.`)
          expect(interpreter.process([`Elizabeth - mother -? Charles?`])).toBe(`Error parsing line 1: object expected after '-'.`)
          expect(interpreter.process([`Elizabeth - mother - ?Charles?`])).toBe(`Error parsing line 1: object expected after '-'.`)
          expect(interpreter.process([`Elizabeth - mother - Charles??`])).toBe(`Error parsing line 1: unexpected token after query.`)
        })
      })
      describe(`Valid queries`, () => {
        beforeEach(() => {
          expect(interpreter.process([`Elizabeth - mother - Charles.`, `Charles - father - Harry.`])).toBe(`Ok.\nOk.`)
        })

        test('No match', () => {
          expect(interpreter.process([`Charles - mother - Charles?`])).toBe(`No.`)
          expect(interpreter.process([`Elizabeth - father - Harry?`])).toBe(`No.`)
          expect(interpreter.process([`Elizabeth - mother - Harry?`])).toBe(`No.`)
        })
        test('Match', () => {
          expect(interpreter.process([`Elizabeth - mother - Charles?`])).toBe(`Yes.`)
          expect(interpreter.process([`Elizabeth - mother - Charles ?`])).toBe(`Yes.`)
        })
        test('Multiple queries', () => {
          expect(interpreter.process([`Elizabeth - mother - Harry?`, `Elizabeth - mother - Charles?`])).toBe(`No.\nYes.`)
        })
      })
    })
    describe(`Partial queries`, () => {
      describe(`Invalid queries`, () => {
        test(`Wildcard in wrong place`, () => {
          expect(interpreter.process([`*Elizabeth - mother - Charles?`])).toBe(`Error parsing line 1: '-' expected after subject.`)
          expect(interpreter.process([`Eli*zabeth - mother - Charles?`])).toBe(`Error parsing line 1: '-' expected after subject.`)
          expect(interpreter.process([`Elizabeth* - mother - Charles?`])).toBe(`Error parsing line 1: '-' expected after subject.`)
          expect(interpreter.process([`Elizabeth *- mother - Charles?`])).toBe(`Error parsing line 1: '-' expected after subject.`)
          expect(interpreter.process([`Elizabeth -* mother - Charles?`])).toBe(`Error parsing line 1: '-' expected after relation.`)
          expect(interpreter.process([`Elizabeth - *mother - Charles?`])).toBe(`Error parsing line 1: '-' expected after relation.`)
          expect(interpreter.process([`Elizabeth - mo*ther - Charles?`])).toBe(`Error parsing line 1: '-' expected after relation.`)
          expect(interpreter.process([`Elizabeth - mother* - Charles?`])).toBe(`Error parsing line 1: '-' expected after relation.`)
          expect(interpreter.process([`Elizabeth - mother *- Charles?`])).toBe(`Error parsing line 1: '-' expected after relation.`)
          expect(interpreter.process([`Elizabeth - mother -* Charles?`])).toBe(`Error parsing line 1: expected '.' or '?' after object.`)
          expect(interpreter.process([`Elizabeth - mother - *Charles?`])).toBe(`Error parsing line 1: expected '.' or '?' after object.`)
          expect(interpreter.process([`Elizabeth - mother - Cha*rles?`])).toBe(`Error parsing line 1: expected '.' or '?' after object.`)
          expect(interpreter.process([`Elizabeth - mother - Charles*?`])).toBe(`Error parsing line 1: expected '.' or '?' after object.`)
        })
      })
      describe(`Valid queries`, () => {
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
  })
})