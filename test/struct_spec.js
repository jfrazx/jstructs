
var Struct = require( '../index' );
var chai   = require( 'chai' );
var expect = chai.expect;

describe( 'Struct', function() {
  var MyStruct;
  var struct;
  var another;

  before( function() {
    MyStruct = Struct( 'lots', 'of', 'test', 'paramters', 'hooray' );
    struct   = new MyStruct( 'so', 'many', 'fancy', 'testing', 'options', 'here' );
    another  = new MyStruct( 'so', 'many', 'fancy', 'testing', 'options', 'here' );
  });

  it( 'should be an instance of MyStruct', function() {
    expect( struct ).to.be.instanceof( MyStruct );
  });

  it( 'should return an array of values', function() {
    var values = struct.values();

    expect( values ).to.be.an( 'array' );
    expect( values ).to.eql( [ 'so', 'many', 'fancy', 'testing', [ 'options', 'here' ] ] );
  });

  it( 'should return an array of properties', function() {
    var props = struct.properties();

    expect( props ).to.be.an( 'array' );
    expect( props ).to.eql( [ 'lots', 'of', 'test', 'paramters', 'hooray' ] );
  });

  it( 'should return an array of function names', function() {
    var funcs = struct.functions();

    expect( funcs ).to.be.an( 'array' );
    expect( funcs ).to.eql( [ 'functions', 'each', 'eachPair', 'equal', 'deepEqual', 'length', 'members', 'properties', 'select', 'toArray', 'toObject', 'values', 'valuesAt' ] );
  });

  it( 'should return an array of property and function names', function() {
    var all = struct.members();

    expect( all ).to.be.an( 'array' );
    expect( all ).to.eql( [ 'functions', 'each', 'eachPair', 'equal', 'deepEqual', 'length', 'members', 'properties', 'select', 'toArray', 'toObject', 'values', 'valuesAt', 'lots', 'of', 'test', 'paramters', 'hooray' ] );
  });

  it( 'should return a numeric length value', function() {
    expect( struct.length() ).to.equal( 5 );
  });

  it( 'should have member names equal to another Struct', function() {
    // property names only
    expect( struct.equal( another ) ).to.be.true
    // all member names (property + function)
    expect( struct.equal( another, true ) ).to.be.true
  });

  it( 'should have property names and values that are equal to another Struct', function() {
    expect( struct.deepEqual( another ) ).to.be.true
    expect( struct.deepEqual( another, true ) ).to.be.true
  })

  it( 'should be able to add properties', function() {
    expect( struct.properties() ).to.eql( [ 'lots', 'of', 'test', 'paramters', 'hooray' ] );

    struct.newProperty = 3.1415;

    expect( struct.properties() ).to.eql( [ 'lots', 'of', 'test', 'paramters', 'hooray', 'newProperty' ] );
  });

  it( 'should have a new length value', function() {
    expect( struct.length() ).to.equal( 6 );
  });

  it('should have new property values', function() {
    expect( struct.values() ).to.eql( [ 'so', 'many', 'fancy', 'testing', [ 'options', 'here' ], 3.1415 ] );
  });

  it( 'should be able to add functions', function() {
    struct.myFunc = function() { console.log( 'So shiny and new' ) };
    expect( struct.functions() ).to.eql( [ 'myFunc', 'functions', 'each', 'eachPair', 'equal', 'deepEqual', 'length', 'members', 'properties', 'select', 'toArray', 'toObject', 'values', 'valuesAt' ] );
  });

  it( 'should not equal another Struct', function() {
    expect( struct.equal( another ) ).to.be.false;
    expect( struct.equal( another, true ) ).to.be.false;
    expect( struct.deepEqual( another ) ).to.be.false;
    expect( struct.deepEqual( another, true ) ).to.be.false;
  });

  it( 'should iterate through each property value', function() {
    var values = struct.values();

    struct.each( function( value, index ) {
      expect( values ).to.include( value );
      expect( index ).to.be.a( 'number' );
    });
  });

  it( 'should iterate through each property name AND value', function() {

    struct.eachPair( function( name, value, index ) {
      expect( index ).to.be.a( 'number' );
      expect( struct[ name ] ).to.equal( value );
      expect( struct.valuesAt( index ) ).to.eql( [ value ] );
      expect( struct.properties()[ index ] ).to.equal( name );
    });
  });

  it( 'should return an array of values that pass the condition', function() {
    var values = struct.select( function( value, index ) {
      expect( struct.values() ).to.include( value );
      expect( index ).to.be.a( 'number' );

      return typeof value === 'number';
    });

    expect( values ).to.be.an( 'array' );
    expect( values ).to.eql( [ 3.1415 ] );
  })

  it( 'should return an array of arrays of property value pairs', function() {
    var pairs = struct.toArray();
    var first = pairs[ 0 ]
    var last  = pairs[ pairs.length-1 ]

    expect( pairs ).to.be.an( 'array' );
    expect( first ).to.be.an( 'array' );
    expect( last ).to.be.an( 'array' );
    expect( pairs ).to.have.length( 6 );
    expect( first ).to.have.length( 2 );
    expect( last ).to.have.length( 2 );
    expect( first[ 0 ] ).to.equal( 'lots' );
    expect( first[ 1 ] ).to.equal( 'so' );
    expect( last[ 0 ] ).to.equal( 'newProperty' );
    expect( last[ 1 ] ).to.equal( 3.1415 );
  });

  it( 'should return a new function free object', function() {
    var obj = struct.toObject();

    expect( obj ).to.be.an( 'object' );
    expect( struct.functions( obj )  ).to.eql( [] );
    expect( struct.newProperty ).to.equal( obj.newProperty );
    expect( struct.equal( obj ) ).to.be.true;
    expect( struct.equal( obj, true ) ).to.be.false;
    expect( struct.deepEqual( obj ) ).to.be.true;
    expect( struct.deepEqual( obj, true ) ).to.be.false;
  });

  it( 'should return the values at the provided indices', function() {
    var values = struct.valuesAt( 0, 4, 5, 6 );

    expect( values ).to.be.an( 'array' );
    expect( values ).to.eql( [ 'so', [ 'options', 'here' ], 3.1415, undefined ] );
  });

  it( 'should return only truthy values at the provided indices', function() {
    struct.lastValue = false;

    var values = struct.valuesAt( 1, 6, 9, 11, true );

    expect( values ).to.be.an( 'array' );
    expect( values ).to.eql( [ 'many' ] );
  });
});
