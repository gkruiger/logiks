# Introduction

An interpreted logic programming language for deriving facts from rules and querying relational knowledge.

![status](https://img.shields.io/badge/status-WIP-red)
![tests](https://img.shields.io/badge/test--coverage-90%25-orange)
![coverage](https://img.shields.io/badge/dependencies-none-green)

Logiks is intentionally minimal.  
It focuses on relational reasoning without arithmetic, negation, or side effects.  
The language is designed to be readable by non-programmers, while remaining easy to embed in TypeScript applications.  
It favors explicit syntax and predictable evaluation over performance optimizations.

## Example

The traditional example (https://en.wikipedia.org/wiki/Logic_programming) of relational logic

```ts
let output = interpreter.process([
  'Elizabeth - mother - Charles.',
  'Charles - father - William.',
  'Charles - father - Harry.',

  '<A> - father - <B> => <A> - parent - <B>!',
  '<A> - mother - <B> => <A> - parent - <B>!',
  '<A> - parent - <B> & <B> - parent - <C> => <A> - grandparent - <C>!',

  'Elizabeth - grandparent - *?'
])

console.log(output)
// Expected output: [
//   'William and Harry.'
// ]
```

## Getting started

Import the Logiks interpreter:

```ts
import { Interpreter } from './logiks.js'
```

Create a new instance of the Interpreter:

```ts
let interpreter = new Interpreter()
```

The interpreter accepts an array of strings as input and returns a list of strings as output:

```ts
let output = interpreter.process([
  'Elizabeth - mother - Charles.',
  'Elizabeth - mother - William.',
  '<A> - mother - <B> => <A> - parent - <B>!',
  'Elizabeth - parent - *?',
])
// output = [
  'Charles and William.'
]
```

# Usage

Logiks provides the following two methods:

### process(input: string[]): string[]


```ts
let output = interpreter.process([
  'Elizabeth - mother - Charles.',
  'Elizabeth - mother - William.',
  '<A> - mother - <B> => <A> - parent - <B>!',
  'Elizabeth - parent - Jimmy?',
  'Elizabeth - parent - *?',
  '* - parent - *?',
])
// output = [
  'No.',
  'Charles and William.',
  'Elizabeth - parent - Charles and Elizabeth - parent - William.'
]
```

The interpreter processes the input one by one, and returns one string for each query, resulting in an array of strings as the total output. The order of the output matches the order of the queries.

### reset(): void

```ts
interpreter.reset()
```

The interpreter resets by clearing all previously stored facts and rules.


# Interpreter specifications

The next sections explain the inner workings of the interpreter.

## Overview
The Logiks interpreter works in a simple loop:
- While there is another line of input:
  - Evaluate the line of input
  - If the statement produces output, append it to the result list
- Return all output

Errors during evaluation result in halting the program and returning the error as output.

Every line of input is either one of the three basic building blocks of Logiks:  
- Facts
- Rules
- Queries

Facts and rules don't result in output, only queries do.

## Fact
A fact defines a relation between two elements.

**Syntax**
```
<subject> - <relation> - <object>.
```
**Example**
```ts
let output = interpreter.process([
  'Elizabeth - mother - Charles.',
  'Charles - father - William.', 
  'Charles - married - Elizabeth.'
])

console.log(output)
// Expected output: []
```
The identifiers need to be separated by a `-` and the fact has to end with a `.`
Neither the subject, relation, nor object needs to be declared beforehand. Logiks doesn't allow duplicates in its knowledge base, so adding a fact that already exists, results in an error.

Facts and rules are stored, and evaluated only during query execution.

## Rule
A rule derives new facts from known facts.

**Syntax**
```
<condition> => <consequence>!
```

**Example**
```ts
let output = interpreter.process([
  'Elizabeth - mother - <SOMEONE> => Elizabeth - parent - <SOMEONE>!',
  '<SOMEONE> - married - <SOMEONE_ELSE> => <SOMEONE_ELSE> - married - <SOMEONE>!',
  '<A> - mother - <B> => <B> - child - <A>!'
])

console.log(output)
// Expected output: []
```

Both the condition and the consequence have to be in the form of a fact and need to be separated by the implication arrow `=>`. A rule has to end with a `!`. Logiks doesn't allow duplicates in its knowledge base, so adding a rule that already exists, results in an error.

Variables are used to connect the condition and the consequence. Variables are enclosed by angle brackets: `<>`. Important constraints:
- Each rule application uses fresh variable bindings. Variables are scoped to the rule in which they appear.
- Only subjects and objects may be variables. A relation can't.
- All variables used in the consequence must also appear in the condition.

Rules are stored, but not applied to facts directly. This only happens when processing a query.

## Query
A query is used to ask questions.

**Syntax**
```
<subject | *> - <relation | *> - <object | *>?
```

The `*` indicates the part you want to know.

**Example**
```ts
let output = interpreter.process([
  'Elizabeth - grandparent - William?',
  'Elizabeth - * - William?',
  '* - grandparent - *?',
  '* - * - *?',
])

console.log(output)
// Expected output: []
```
The identifiers need to be separated by a `-` and the query has to end with a `?`.

The response format depends on the number of * wildcards in the query:
- No `*`: `Yes.` or `No.`.
- One `*`: A list of matching values for that position.
- Multiple `*`s: A list of matching facts.

Results are returned in deterministic depth-first derivation order. 

Results are formatted as human-readable strings. If multiple results are returned, they are formatted as a natural-language list:
- One result: "A."
- Two results: "A and B."
- Three or more results: "A, B and C."

The query `* - * - *?` basically means: tell me every relation you know.

**Examples**

```ts
let output = interpreter.process([
  'Elizabeth - mother - Charles.',
  'Charles - father - William.',
  'Charles - father - Harry.',

  '<A> - father - <B> => <A> - parent - <B>!',
  '<A> - mother - <B> => <A> - parent - <B>!',
  '<A> - parent - <B> & <B> - parent - <C> => <A> - grandparent - <C>!',

  'Elizabeth - grandparent - William?',
  'Elizabeth - * - William?',
  '* - grandparent - *?',
  '* - * - *?',
])

console.log(output)
/* 
Expected output: [
  'Yes.',
  'grandparent.',
  'Elizabeth - grandparent - William and Elizabeth - grandparent - Harry.',
  'Elizabeth - mother - Charles, Elizabeth - parent - Charles, Charles - father - William, Charles - parent - William, Elizabeth - grandparent - William, Charles - father - Harry, Charles - parent - Harry and Elizabeth - grandparent - Harry.',
]
```

As the example shows, the order of the output aligns with the order of the queries. Duplicate matches within a single query result are removed before formatting.

## Evaluation method
Logiks uses goal-directed backward chaining.

Facts and rules are stored.

When a query is executed:
- The query is matched against known facts.
- Rules whose consequences match the query are selected.
- Their conditions are evaluated recursively as subqueries.
- Derived matches are collected and returned.

Evaluation proceeds depth-first.

Derived facts are not stored.

To prevent infinite recursion caused by cyclic rules, Logiks memoizes subqueries within the scope of a single top-level query. If a subquery has already been evaluated, rule expansion is skipped and only known facts are considered.

## Special characters
Logiks is case-sensitive.

| Character | Usage                                                                                  |
| --------- | -------------------------------------------------------------------------------------- |
| `-`       | Separates subject, relation, and object                                                |
| `.`       | Ends a fact                                                                              |
| `!`       | Ends a rule                                                                            |
| `?`       | Ends a query                                                                           |
| `#`       | Starts a comment (rest of the line is ignored). <br>Multi-line comments are not supported. |
| `< >`     | Marks a variable                                                                       |


## Status
In its current state, it supports relational logic at a very basic level.

Implemented:
- Adding facts
- Adding rules
- Evaluating queries

Future ideas:
- Support constraint logic
- Support set theory

# Test
Tests are included (using `vitest`), to run the test:
```
npm run test
```

## Grammar (EBNF)

```ebnf
program = { statement };

statement = fact | rule | query;

fact = subject "-" relation "-" object ".";
subject = string;
relation = string;
object = string;
string = [A-Za-z_]+;

rule = conditions "=>" consequence "!";
conditions = condition {"&" condition};
condition = rule_term "-" relation "-" rule_term;
consequence = rule_term "-" relation "-" rule_term;
rule_term = string | variable;
variable = "<" string ">";

query = queryTerm "-" queryTerm "-" queryTerm "?";
queryTerm = string | "*";
```
