![status](https://img.shields.io/badge/status-WIP-red)
![tests-coverage](https://img.shields.io/badge/test--coverage-tbd%25-orange)
![dependencies](https://img.shields.io/badge/dependencies-none-green)

# Logiks
Logiks is a simple logic programming language for solving logic puzzles.

Its design principles are simplicity and ease of use.

## Example

```ts
console.log(engine.process('
  A = TRUE. 
  A XOR B = TRUE. 
  B?'
))
// Expected output: false
```

TODO: Make this example more compelling once propositional logic is fully supported.

## Getting started
Copy the Logiks files into your TypeScript project:
```
engine.ts
parser.ts
tokenizer.ts
types.ts
```

Import and create the engine:

```ts
import { Engine } from './engine.js'

const engine = new Engine()
```

Process Logiks input:

```ts
console.log(engine.process('A = TRUE. A?'))
// true
```

## Usage

The engine provides two methods: process() and reset().

### process(input: string | string[]): NullableBoolean | NullableBoolean[]
Processes the input sequentially and returns the result of each query. Input can be provided as a string or an array of strings.
```ts
let output = engine.process('A = TRUE. A XOR B = TRUE. B?') 
// false

let output = engine.process([
  'A = TRUE.',
  'A XOR B = TRUE.',
  'A?',
  'B?'
]) 
// [true, false]
```
Evaluation of the inputs is sequential. Later assignment changes it:
```ts
let output = engine.process('
  A = TRUE. 
  A?
  A = FALSE.
  A?
')
// Expected output: [true, false]
```
Errors stop further evaluation and are thrown:
```ts
let output = engine.process('
  A = TRUE.
  Uh-oh!
  A?
')
// Error: ...
```

### reset(): void
The reset function erases any information that is fed the engine upt to that point. So:
```ts
let output = engine.process('A?')         // output: undefined
output = engine.process('A = TRUE. A?')   // output: true
engine.reset()
output = egine.process('A?')              // output: undefined
```

## Language 

### Propositional logic
Logiks currently supports propositional logic. Statements have a truth value and can be queried.

#### Statemement
A statement assigns a truth value to a variable.
```
A = TRUE
B = FALSE
C = T
D = F
```

##### Variables
Variables can contain any characters except =, . and ?. 

Examples of valid variables:
```
A
It'sRaining
Logiks_is_awesome!
```

##### Truth Values
Logiks supports TRUE, FALSE and can also be written as T and F.

##### Operators
Operators combine variables into formulas. Currently, only XOR is supported.

```
FriesAsASide XOR SaladAsASide = TRUE
```

##### Consistency
If the statement is not consistent with the previous statements, Logiks will throw an error:

```
A XOR B = TRUE
A = TRUE
B = FALSE
```

#### Queries
A query asks Logiks to determine the truth value of a formula.

Example:
```
A = TRUE
A XOR B = TRUE
A? 
B?
C? 
```
will result in:
```
[true, false, undefined]
```
because Logiks can find a truth value for A via the statement A = TRUE, B by combining A = TRUE and A XOR B = TRUE, but, but cannot for C.

### Syntax
If there are multiple statements or queries in the same line, the statement needs to end with a dot '.' to mark the end of the statemet. If not, usage of a dot is optional.

A query always needs to end with a question mark '?'.

## Status
Logiks is work in progress. Different types of logic systems will be supported. For now, Logiks supports only propositional logic in its most basic form. To support propositional logic fully, there is still stuff to do:
- Support for all operators: AND, OR, NOT, IMP and EQU
- Establish operator precedence
- Support us of brackets

## Test
Tests are included. To run the tests:
```
npm run test
```

## Grammar (EBNF)

```ebnf
program = { statement | query };

statement = formula "=" (true | false) ["."];
query = formula "?";

formula = variable | xorFormula | andFormula;
variable = string;
xorFormula = formula 'xor' formula;
andFormula = formula 'and' formula;
```