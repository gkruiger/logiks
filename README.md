# Introduction

A minimal interpreted logic programming language for deriving facts from rules and querying relational knowledge.

![status](https://img.shields.io/badge/status-WIP-red)
![tests](https://img.shields.io/badge/test--coverage-90%-green)
![coverage](https://img.shields.io/badge/dependencies-none-green)


Logiks is designed to be:
- Easy to read and write by humans
- Easy to embed in a TypeScript environment

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
// Expected output: ['William and Harry.']
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
// output = ['Charles and William.']
```

# Usage

Logiks provides the following two methods:

### process(input: string[]) : string[]

```ts
let output = interpreter.process(['Elizabeth - mother - Charles.'])
// output = []
```

The interpreter processes the input one by one, returning an array of strings containing the output. 

### reset() : void

```ts
interpreter.reset()
```

The interpreter resets by clearing all previously stored facts and rules.


# Interpreter specifications

The next sections explains the inner workings of the interpreter.

## Overview
The Logiks interpreter works in a simple loop:
- While there is another line of input:
  - Evaluate the line of input
  - If relevant: output add to all output 
- Return all output

Errors during evaluation result in halting the programming and returning the error as output.

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
Neither the subject, relation, nor object needs to be declared beforehand. Duplicate facts result in an error.

Facts are stored, but not applied to rules directly. This only happens when processing a query.

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

Both the condition and the consequence have to be in the form of a fact and need to be separated by the implication arrow `=>`. A rule has to end with a `!`. Duplicate facts result in an error.

Variables are used to connect the condition and the consequence. Variables are enclosed by angle brackets: `<>`. Important constraints:
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
- Multiple `*`s: A list of matching relations.

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
  '* - * - *',
])

console.log(output)
/* 
Expected output: Array [
  'Yes.',
  'grandparent.',
  'Elizabeth - grandparent - William and Elizabeth - grandparent - Harry.',
  'Elizabeth - mother - Charles, Elizabeth - parent - Charles, Charles - father - William, Charles - parent - William, Elizabeth - grandparent - William, Charles - father - Harry, Charles - parent - Harry, Elizabeth - grandparent - Harry',
]
```

As the example shows, the order of the output aligns with the order of the queries. Duplicates are filtered out.   

## Evaluation method
Logiks is using on-demand backward chaining, which means that facts and rules are stored, but not applied directy. This only happens when a query is processed.

While applying rules to facts, new facts may be derived. These derived facts can be used in the same query to derive even more facts. Derived facts are not stored.

Logiks prevents infinite or circular rule recursion through query memoization. When evaluating a query, Logiks attempts to satisfy it by applying rules whose consequences match the query. For each matching rule, the rule’s condition(s) are evaluated as subqueries. Each subquery is memoized during the evaluation of the original query. If a subquery is encountered that has already been evaluated in the current evaluation chain, Logiks does not reapply rules to that subquery. Instead, it is evaluated only against known facts.

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
- Adding rules (single condition in engine only)
- Evaluating query

Work in progress:
- Add support for adding rules via the interpreter
- Add support for adding rules with multiple conditions in the engine and interpreter

Future ideas:
- Dive into combinatorics
- Something with set theory

# Test
Tests are included (using `vitest`), to run the test:
```
npm run test
```

## Grammar (EBNF)

```ebnf
statement = fact | rule | query, {fact | rule | query};

fact = subject "-" relation "-" object ".";
subject = STRING;
relation = STRING;
object = STRING;

rule = condition "=>" consequence "!";
condition = rule_term "-" relation "-" rule_term;
consequence = rule_term "-" relation "-" rule_term;

query = queryTerm "-" queryTerm "-" queryTerm "?";
queryTerm = STRING | "*";
```
