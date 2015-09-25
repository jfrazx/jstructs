'use strict';
var _ = require('lodash');

function Struct() {
  var _properties = _.flattenDeep( Array.prototype.slice.call( arguments ) );

  function ConStruct() {
    var self = this || {};
    var args = Array.prototype.slice.call( arguments );

    if ( self instanceof ConStruct ) {
      self.__proto__ = _.create( self.constructor.prototype, _.omit( Struct.prototype, ['constructor'] ) );
    }
    else {
      _.each( Object.getOwnPropertyNames( _.omit( Struct.prototype, [ 'constructor' ] ) ), function( name ) {
        self[ name ] = Struct.prototype[ name ];
      });
    }

    // flatten to distribute arguments evenly, only one level though
    if ( args.length < _properties.length ) {
      args = _.flatten( args );
    }

    // match up the Struct properties and these properties
    for ( let i = 0; i < _properties.length; i++ ) {
      self[ _properties[ i ] ] = args[ i ];
    }

    // if there are more passed arguments than properties, the remainder are tacked on to the last property
    if ( _properties.length < args.length ) {
      self[ _properties[ _properties.length-1 ] ] = args.slice( _properties.length-1 );
    }

    return self;
  }

  return ConStruct;
}


/**
* Get all the function names
* @param <Struct> context: optional other Struct to get function names
* @return <Array[string]>
*/
Struct.prototype.functions = function( context ) {
  context = context || this;
  return _.functions( context );
}

/**
* Iterate over each property and pass its value to callback
* @param <Function> callback: The callback unto which values are passed
* @return <void>
*/
Struct.prototype.each = function( callback ) {
  _.each( this.properties() , function( property, index ) {
    callback( this[ property ], index );
  }, this);
}

/**
* Iterate over each property and pass it AND its value to callback, functions not included
* @param <Function> callback: The callback unto which values are passed
* @return <void>
*/
Struct.prototype.eachPair = function( callback ) {
  var props = this.properties();

  this.each( function( value, index ) {
    callback( props[ index ], value, index );
  } );
}

/**
* Determine if 'other' Struct is equivalent  to this one, optionally include all member properties
* @param <Struct> other: The other Struct
* @param <boolean> funcs: Optional boolean to determine if all member properties should be compared
* @return <boolean>
*/
Struct.prototype.equal = function ( other, funcs ) {
  return _.isEqual( ( funcs ? _.keys( this ) : this.properties() ),
                    ( funcs ? _.keys( other ) : this.properties( other ) ) );
}

/**
* Determine if 'other' Struct properties and values are equal, this excludes functions
* @param <Struct> other: The other Struct
* @return <boolean>
*/
Struct.prototype.deepEqual = function( other, funcs ) {
  return _.isEqual( ( funcs ? this : this.toObject() ),
          ( funcs ? other : this.toObject( other ) ) );
}

/**
* Determine the 'length' of the Struct, i.e, how many properties does it have
* @param <Struct> context: optional other Struct to get length
* @return <number>
*/
Struct.prototype.length = function( context ) {
  return this.properties( context ).length;
}

/**
* Retrieve all member properties, including function names
* @param <Struct> context: optional other Struct to get member names
* @return <Array[string]>
*/
Struct.prototype.members = function( context ) {
  context = context || this;
  return _.union( this.functions( context ), _.keys( context ) );
}

/**
* Retrieve member property names, excludes functions
* @param <Struct> context: The item in which to acquire property names
* @return <Array[string]>
*/
Struct.prototype.properties = function( context ) {
  context = context || this;

  return _.reject( this.members( context ), function( member ) {
    return typeof context[ member ] === 'function';
  });
}

/**
* Select all values that pass the condition
* @param <Function> callback: Function to invoke for conditon
* @param <boolean> objectMode: Should we select from key/values or just values ?
* @return <Array[any]>
*/
Struct.prototype.select = function( callback, objectMode ) {
  return _.select( ( objectMode ? this.toObject() : this.values() ), callback );
}

/**
* Retrieve the property names and values as pair arrays
* @param <Struct> context: optional other Struct to get pair array
* @return <Array[Array[any]]>
*/
Struct.prototype.toArray = function( context ) {
  return _.pairs( this.toObject( context ) );
}

/**
* Retrieve property names and values as a new object
* @param <Struct> context: optional Struct to make into object
* @return <Object{any}>
*/
Struct.prototype.toObject = function( context ) {
  context = context || this;

  return _.omit( context, this.functions( context ) );
}

/**
* Retrieve all the property values
* @param <Struct> context: optional Struct to retrieve values
* @return <Array[any]>
*/
Struct.prototype.values = function( context ) {
  context = context || this;

  return _.map( this.properties( context ), function( property ) {
    return context[ property ];
  });
}

/**
* Return all the values at the provided indexs
* @param <number[]> indices: The indices whose values you wish to retrieve
* @param <boolean> compact: Optional last value that determines if falsey values should be removed
* @return <Array[any]>
*/
Struct.prototype.valuesAt = function() {
  var indices = Array.prototype.slice.call( arguments );
  var compact = false;
  var values  = this.values();
  var result;

  if ( _.isBoolean( _.last( indices ) ) ) {
    if ( indices.pop() === true )
      compact = !compact;
  }

  result = _.map( indices, function( value ) {
    return values[ value ];
  });

  return compact ? _.compact( result ) : result;
}

module.exports = Struct;
