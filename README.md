![status](https://img.shields.io/badge/status-WIP-red)
![tests-coverage](https://img.shields.io/badge/test--coverage-tbd%25-orange)
![dependencies](https://img.shields.io/badge/dependencies-none-green)

# Logiks
Logiks is a constraint problem solving engine written in Typescript.

## Example

```ts
let engine = new Engine()

const domain = [1, 2, 3]

engine.addVariable({name: 'A', domain: domain})
engine.addVariable({name: 'B', domain: domain})
engine.addVariable({name: 'C', domain: domain})

engine.addConstraint(new DistinctValuesConstraint(engine, ['A', 'B', 'C']))
engine.addConstraint(new GreaterThanConstraint(engine, 'A', 'B'))

engine.solve()

engine.printVariables()

// Output:
// Name: A, domain: 2
// Name: B, domain: 1
// Name: C, domain: 3
```

## Getting started
1. Copy the Logiks files into your TypeScript project:
2. Import and create a new instance of the engine:

```ts
import { Engine } from './engine.js'

const engine = new Engine()
```

3. Start using the engine to solve all your life's problems :-)

## Usage

Logiks is very straightforward to use, only a few methods are provided:

### addVariable(variable: Variable): void
Adds a variable to the engine. A variable needs a name and a domain. An error is thrown if you try to add a variable that already exists, or a variable with an empty domain.

```ts
engine.addVariable({name: 'A', domain: [1, 2, 3]})
```

### addConstraint(constraint: AbstractConstraint): void
Adds a constraint to the engine. The constraint is not (yet) applied to the variables, this only happends after calling solve().

```ts
engine.addConstraint(new GreaterThanConstraint(engine, 'A', 'B'))
```

### solve(): boolean 
Tries to solve the the variables. Returns true if a solution is found, otherwise false.

```ts
engine.addVariable({name: 'A', domain: [1, 2, 3]})
engine.addVariable({name: 'B', domain: [1, 2, 3]})

engine.addConstraint(new DistinctValuesConstraint(engine, ['A', 'B']))

engine.solve()

console.log(engine.getDomain('A')) // [1]
console.log(engine.getDomain('B')) // [2]
```

The engine stops looking after the first solution is found.
If a solution is found, the domains of the variables are set accordingly.

### getDomain(variableName: string): Domain
Returns the domain of the variable. An error is thrown if the variable is unknown.

```ts
engine.addVariable({name: 'A', domain: [1, 2, 3]})
const domain = engine.getDomain('A')
console.log(domain) // [1, 2, 3]
```

### printVariables(): void
Prints all variables to the console.

```ts
engine.addVariable({name: 'A', domain: [1, 2, 3]})
engine.addVariable({name: 'B', domain: [1, 2, 3]})
engine.printVariables()
// Name: A, domain: [1, 2, 3]
// Name: B, domain: [1, 2, 3]
```

### reset(): void
The reset function erases any variables or constraints in the engine.
```ts
engine.addVariable({name: 'A', domain: [1, 2, 3]})
const domainBeforeReset = engine.getDomain('A') // domain = [1, 2, 3]
engine.reset()
const domainAfterReset = engine.getDomain('A') // Error, variable unknown
```

## Concepts 

### Variable
A variable in Logiks has a name an a domain. The name of a variable is a string. There are no limitations to what the string should or should not contain. 
```ts
engine.addVariable({name: 'A', domain: [1, 2, 3]}) // This is fine
engine.addVariable({name: 'L🌀G!Ҡ⚡', domain: [1, 2, 3]}) // This is also perfectly fine
```

No two variables can have the same name. Adding a variable with an existing name throws an error.

```ts
engine.addVariable({name: 'A', domain: [1, 2, 3]}) // This is fine
engine.addVariable({name: 'A', domain: [1, 2, 3]}) // Error
```

### Domain
A domain in Logiks is an array of numbers or strings.
```ts
engine.addVariable({name: 'A', domain: [1, 2, 3]}) // This is fine
engine.addVariable({name: 'B', domain: ['one', 'two', 'three']}) // This is also perfectly fine
engine.addVariable({name: 'C', domain: [1, '2', 'three']}) // Typescript complains
```

A domain can't be empty. Adding a variable with an empty domain throws an error.
```ts
engine.addVariable({name: 'A', domain: [1, 2, 3]}) // This is fine
engine.addVariable({name: 'B', domain: []}) // Throws an error
```
### Constraint
Logiks provides the following constraints.

You can write your own constraints by implementing AbstractConstraint.

#### Distinct values
#### Greater than
#### Less than
#### Symbols count
#### Run length
#### If then
#### Maximum Symbols Count

## Modules
Logiks supports a few (for now just one) modules that make it much easier to use the engine.
 
### Table

## Examples


## Status
Logiks is work in progress:

Engine: &check;
Constraints: Many more to follow.
Modules: 
Examples: 

More type of constraints will be supported.

## Test
Tests are included. To run the tests:
```
npm run test
```