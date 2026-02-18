import { expect, describe, test, beforeEach } from 'vitest'
import { Interpreter } from './logiks.js'

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
        expect(interpreter.process([`Elizabeth - mother - Charles`])).toBe(`Error parsing line 1: expected '.', '=>' or '?' after object.`)  
      })
      test('Something after the fact', () => {
        expect(interpreter.process([`Elizabeth - mother - Charles. Elizabeth`])).toBe(`Error parsing line 1: unexpected token after fact.`)  
        expect(interpreter.process([`Elizabeth - mother - Charles. -`])).toBe(`Error parsing line 1: unexpected token after fact.`)  
        expect(interpreter.process([`Elizabeth - mother - Charles. .`])).toBe(`Error parsing line 1: unexpected token after fact.`)  
        expect(interpreter.process([`Elizabeth - mother - Charles. !`])).toBe(`Error parsing line 1: unexpected token after fact.`)  
        expect(interpreter.process([`Elizabeth - mother - Charles. ?`])).toBe(`Error parsing line 1: unexpected token after fact.`)  
        expect(interpreter.process([`Elizabeth - mother - Charles. <A>`])).toBe(`Error parsing line 1: unexpected token after fact.`)  
      })
      test('Using a wildcard.', () => {
        expect(interpreter.process([`* - mother - Charles.`])).toBe(`Error parsing line 1: wildcards are not allowed in facts.`)  
        expect(interpreter.process([`Elizabeth - * - Charles.`])).toBe(`Error parsing line 1: wildcards are not allowed in facts.`)  
        expect(interpreter.process([`Elizabeth - mother - *.`])).toBe(`Error parsing line 1: wildcards are not allowed in facts.`)  
      })
      test('Using a variable.', () => {
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

  describe(`Add rule`, () => {
    describe(`Invalid rules`, () => {
      test(`Missing elements`, () => {
        expect(interpreter.process([` - mother - <B> => <B> - child - <A>!`])).toBe(`Error parsing line 1: subject expected.`)
        expect(interpreter.process([`<A>  mother - <B> => <B> - child - <A>!`])).toBe(`Error parsing line 1: '-' expected after subject.`)
        expect(interpreter.process([`<A> -  - <B> => <B> - child - <A>!`])).toBe(`Error parsing line 1: relation expected after '-'.`)
        expect(interpreter.process([`<A> - mother  <B> => <B> - child - <A>!`])).toBe(`Error parsing line 1: '-' expected after relation.`)
        expect(interpreter.process([`<A> - mother -  => <B> - child - <A>!`])).toBe(`Error parsing line 1: object expected after '-'.`)
        expect(interpreter.process([`<A> - mother - <B>  <B> - child - <A>!`])).toBe(`Error parsing line 1: expected '.', '=>' or '?' after object.`)
        expect(interpreter.process([`<A> - mother - <B> => - child - <A>!`])).toBe(`Error parsing line 1: subject expected after '=>'.`)
        expect(interpreter.process([`<A> - mother - <B> => <B>  child - <A>!`])).toBe(`Error parsing line 1: '-' expected after subject.`)
        expect(interpreter.process([`<A> - mother - <B> => <B> -  - <A>!`])).toBe(`Error parsing line 1: relation expected after '-'.`)
        expect(interpreter.process([`<A> - mother - <B> => <B> - child  <A>!`])).toBe(`Error parsing line 1: '-' expected after relation.`)
        expect(interpreter.process([`<A> - mother - <B> => <B> - child - !`])).toBe(`Error parsing line 1: object expected after '-'.`)
        expect(interpreter.process([`<A> - mother - <B> => <B> - child - <A>`])).toBe(`Error parsing line 1: '!' expected after object.`)
      })
      test('Using a wildcard.', () => {
        expect(interpreter.process([`* - mother - <B> => <B> - child - <A>!`])).toBe(`Error parsing line 1: wildcards are not allowed in rules.`)
        expect(interpreter.process([`<A> - * - <B> => <B> - child - <A>!`])).toBe(`Error parsing line 1: wildcards are not allowed in rules.`)
        expect(interpreter.process([`<A> - mother - * => <B> - child - <A>!`])).toBe(`Error parsing line 1: wildcards are not allowed in rules.`)
        expect(interpreter.process([`<A> - mother - <B> => * - child - <A>!`])).toBe(`Error parsing line 1: wildcards are not allowed in rules.`)
        expect(interpreter.process([`<A> - mother - <B> => <B> - * - <A>!`])).toBe(`Error parsing line 1: wildcards are not allowed in rules.`)
        expect(interpreter.process([`<A> - mother - <B> => <B> - child - *!`])).toBe(`Error parsing line 1: wildcards are not allowed in rules.`)
      })
      test('Something after the rule', () => {
        expect(interpreter.process([`<A> - mother - <B> => <B> - child - <A>! C`])).toBe(`Error parsing line 1: unexpected token after rule.`)
        expect(interpreter.process([`<A> - mother - <B> => <B> - child - <A>! <C>`])).toBe(`Error parsing line 1: unexpected token after rule.`)
        expect(interpreter.process([`<A> - mother - <B> => <B> - child - <A>! -`])).toBe(`Error parsing line 1: unexpected token after rule.`)
        expect(interpreter.process([`<A> - mother - <B> => <B> - child - <A>! .`])).toBe(`Error parsing line 1: unexpected token after rule.`)
        expect(interpreter.process([`<A> - mother - <B> => <B> - child - <A>! !`])).toBe(`Error parsing line 1: unexpected token after rule.`)
        expect(interpreter.process([`<A> - mother - <B> => <B> - child - <A>! ?`])).toBe(`Error parsing line 1: unexpected token after rule.`)
      })
      test('Using variables wrong.', () => {
        expect(interpreter.process([`<A> - <R> - <B> => <B> - child - <A>!`])).toBe(`Error parsing line 1: relation's as variables are not allow rules.`)
        expect(interpreter.process([`<A> - mother - <B> => <B> - <R> - <A>!`])).toBe(`Error parsing line 1: relation's as variables are not allow rules.`)
        expect(interpreter.process([`A - R - <B> => <B> - child - <A>!`])).toBe(`Error parsing line 1: subject can't be a term and should be a variable.`) 
        expect(interpreter.process([`<A> - R - B => <B> - child - <A>!`])).toBe(`Error parsing line 1: object can't be a term and should be a variable.`) 
        expect(interpreter.process([`<A> - R - <B> => B - child - <A>!`])).toBe(`Error parsing line 1: subject can't be a term and should be a variable.`) 
        expect(interpreter.process([`<A> - R - <B> => <B> - child - A!`])).toBe(`Error parsing line 1: object can't be a term and should be a variable.`) 
        expect(interpreter.process([`<A> - R - <B> => <A> - child - <A>!`])).toBe(`Error parsing line 1: variables in condition and consequence do not match.`) 
        expect(interpreter.process([`<A> - R - <B> => <B> - child - <B>!`])).toBe(`Error parsing line 1: variables in condition and consequence do not match.`) 
        expect(interpreter.process([`<A> - R - <B> => <C> - child - <A>!`])).toBe(`Error parsing line 1: variables in condition and consequence do not match.`) 
        expect(interpreter.process([`<A> - R - <B> => <B> - child - <C>!`])).toBe(`Error parsing line 1: variables in condition and consequence do not match.`) 
      })
    })
    describe(`Valid rules`, () => {
      test('Single condition.', () => {
      })
      test('Multiple conditions.', () => {
      })
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
        expect(interpreter.process([`Elizabeth - mother - Charles`])).toBe(`Error parsing line 1: expected '.', '=>' or '?' after object.`)  
      })
      test('Something after the query', () => {
        expect(interpreter.process([`Elizabeth - mother - Charles? Elizabeth`])).toBe(`Error parsing line 1: unexpected token after query.`)  
        expect(interpreter.process([`Elizabeth - mother - Charles?. -`])).toBe(`Error parsing line 1: unexpected token after query.`)  
        expect(interpreter.process([`Elizabeth - mother - Charles?. .`])).toBe(`Error parsing line 1: unexpected token after query.`)  
      })
      test('Using a variable.', () => {
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