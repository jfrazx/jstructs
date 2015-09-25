
# JStructs

Structs for JavaScript, yay!!    
A simple Ruby-like Struct factory for JavaScript

## Installation

npm install jstructs [--save]

## Usage

```
var Struct  = require( 'jstructs' );
var Contact = Struct( 'name', 'email', 'phone' );
var bob     = new Contact( 'Bob', 'bob@email.com', 7779311 );
var alice   = new Contact( 'Alice', 'alice@email.com', 8675309 );

alice.equal( bob );

=> true // only compares properties

alice.deepEqual( bob );

=> false // compares properties and values

alice.each( function( value ) {
  console.log( value );
});

=> 'Alice'
=> 'alice@email.com'
=> 8675309

bob.eachPair( function( name, value ) {
  console.log( name, '=>', value );
});

=> name => Bob
=> email => bob@email.com
=> phone => 7779311

alice.length();

=> 3

alice.properties();

=> [ 'name', 'email', 'phone' ]

bob.values();

=> [ 'Bob', 'bob@email.com', 7779311 ]

bob.valuesAt( 0, 2, 5 );

=> [ 'Bob', 7779311, undefined ]

bob.valuesAt( 0, 2, 5, true );

=> [ 'Bob', 7779311 ] // last value of true will remove falsey values

alice.select( function( value ) {
  return typeof value === 'number';
});

=> [ 8675309 ]

alice.toArray();

// returns arrays of key value pairs
=> [ [ 'name', 'Alice' ], [ 'email', 'alice@email.com' ], [ 'phone', 8675309 ] ]

bob.toObject();

// creates a new object from key value pairs
=> {
  'name': 'Bob',
  'email': 'bob@email.com',
  'phone': 8675309
}

```

Unlike Ruby Structs you can pass in more parameters than there are properties.

```
var Struct  = require( 'jstructs' );
var Numbers = Struct( 'pi', 'e', 'chaos', 'catchall' );
var numbers = new Numbers( 3.1415, 2.71828, 4.6692, 6.2831, 1.6180, -273.15, 6.71 * Math.pow( 10, 8 ));

numbers.values();

=> [ 3.1415, 2.71828, 4.6692, [ 6.2831, 1.618, -273.15, 671000000 ] ]
```
