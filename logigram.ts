import { Engine } from './engine.ts'

/*

This Logigram class
  -  translates the input into a set of propositions for the LogicEngine.
  -  translates the output of the logic engine into a human-readable format.

*/

type Variable = {
  name: string,
  options: string[]
} 

type Hint = {
  variableA: string,
  variableB: string
}

class Logigram {

  actors: Variable
  attributes: Variable[] = []
  hints: Hint[] = []
  
  constructor(actors: Variable, attributes: Variable[], hints: Hint[]) {
    this.actors = actors
    this.attributes = attributes
    this.hints = hints

    this.printInput()

    const engine = new Engine()
    const actorsAndAttributes = [this.actors, ...this.attributes]

    const combinationsAndRestrictions = this.generateCombinationsAndRestrictions(actorsAndAttributes)
    for(let combinationOrRestriction of combinationsAndRestrictions) {
      engine.process(`${combinationOrRestriction}`)
    }

    for(let hint of hints) {
      engine.process(`${hint.variableA}-${hint.variableB} = TRUE`)
    }

    engine.printStatements()
  }

  private printInput() {
    let input = ''
    input += `Actors:\n`
    input += `  ${this.actors.name}: ${this.actors.options.join(', ')}\n\n`

    input += `Attributes:\n`
    input += this.attributes.map(attr => `  ${attr.name}: ${attr.options.join(', ')}`).join('\n') + '\n\n'
    
    input += `Hints:\n`
    input += this.hints.map(hint => `  ${hint.variableA} is ${hint.variableB}`).join('\n') + '\n'
    console.log(input)
  }

  private generateCombinationsAndRestrictions(variables: Variable[]): string[] {
    let combinationsAndResrictions: string[] = []

    let combinations: string[] = []
    for(let firstGroup = 0; firstGroup < variables.length; firstGroup++) {
      for(let secondGroup = firstGroup + 1; secondGroup < variables.length; secondGroup++) {
        for(let i = 0; i < variables[firstGroup].options.length; i++) {
          for(let j = 0; j < variables[secondGroup].options.length; j++) {
            combinations.push(`${variables[firstGroup].options[i]}-${variables[secondGroup].options[j]}`)
          }
        }
      }
    }

    let restrictions: string[] = []
    const groupSize = this.actors.options.length
    for(let group=0; group<groupSize; group++) {
      let proposition = ''
      for(let element=0; element<groupSize; element++) {
        if(proposition != '') {
          proposition += ' XOR '
        }
        proposition += combinations[group * groupSize + element]
      }
      proposition += " = TRUE"
      restrictions.push(proposition)
    }

    for(let group=0; group<groupSize; group++) {
      let proposition = ''
      for(let element=0; element<groupSize; element++) {
        if(proposition != '') {
          proposition += ' XOR '
        }
        proposition += combinations[group + element * groupSize]
      }
      proposition += " = TRUE"
      restrictions.push(proposition)
    }
   
    combinationsAndResrictions = [
      ...(combinations.map((combination) => `${combination} = TRUE`)), 
      ...restrictions]

    return combinationsAndResrictions
  }
}



/*

Example of usage of the Logigram class.

*/


let logigram = new Logigram({
    name: 'Name',
    options: ['Chiela', 'Gertjan']
  }, 
  [{
    name: 'Musical Instrument',
    options: ['Piano', 'Violin']
  }],
  [{
    variableA: 'Chiela',
    variableB: 'Violin'
  }]
)



