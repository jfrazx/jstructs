# JStructs

[![dependencies Status](https://david-dm.org/jfrazx/jstructs/status.svg)](https://david-dm.org/jfrazx/jstructs)
[![devDependencies Status](https://david-dm.org/jfrazx/jstructs/dev-status.svg)](https://david-dm.org/jfrazx/jstructs?type=dev)
[![License](https://img.shields.io/github/license/jfrazx/jstructs.svg?style=plastic)]()
[![Downloads Total](https://img.shields.io/npm/dt/jstructs.svg?style=plastic)](https://www.npmjs.com/package/jstructs)  
[![Codecov branch](https://img.shields.io/codecov/c/github/jfrazx/jstructs/master.svg?style=plastic)](https://codecov.io/gh/jfrazx/jstructs)
[![Travis branch](https://img.shields.io/travis/jfrazx/jstructs/master.svg?style=plastic)](https://travis-ci.org/jfrazx/jstructs)

Structs for JavaScript, yay!!  
A Ruby-like Struct factory for JavaScript

## Installation

`npm install jstructs [--save]`

or

`yarn install jstructs`

## Usage

```javascript
const Struct  = require('jstructs');
const Contact = Struct('name', 'email', 'phone');
const bob     = new Contact('Bob', 'bob@email.com', 7779311);
const alice   = new Contact('Alice', 'alice@email.com', 8675309);

alice.equal(bob);

=> true // only compares properties

alice.deepEqual(bob);

=> false // compares properties and values

alice.each(function(value) {
  console.log(value);
});

=> 'Alice'
=> 'alice@email.com'
=> 8675309

bob.eachPair(function(name, value) {
  console.log(name, '=>', value);
});

=> name => Bob
=> email => bob@email.com
=> phone => 7779311

alice.length();

=> 3

alice.properties();

=> ['name', 'email', 'phone']

bob.values();

=> ['Bob', 'bob@email.com', 7779311]

bob.valuesAt(0, 2, 5);

=> ['Bob', 7779311, undefined]

bob.valuesAt(0, 2, 5, true);

=> ['Bob', 7779311] // last value of true will remove falsey values

alice.select(function(value) {
  return typeof value === 'number';
});

=> [8675309]

alice.toArray();

// returns arrays of key value pairs
=> [['name', 'Alice'], ['email', 'alice@email.com'], ['phone', 8675309]]

bob.toObject();

// creates a new object from key value pairs
=> {
  'name': 'Bob',
  'email': 'bob@email.com',
  'phone': 8675309
}

```

Unlike Ruby Structs, you can pass in more arguments than there are properties.

```javascript
const Struct  = require('jstructs');
const Numbers = Struct('pi', 'e', 'chaos', 'catchall');
const numbers = new Numbers(3.1415, 2.71828, 4.6692, 1.6180, -273.15, 6.71 * Math.pow(10, 8));

numbers.values();

=> [3.1415, 2.71828, 4.6692, [1.618, -273.15, 671000000]]

numbers.catchall;

=> [1.618, -273.15, 671000000]
```

You must pass at least one argument.

```javascript
const Struct  = require('jstructs');
const fail = Struct();

=> Error
```
