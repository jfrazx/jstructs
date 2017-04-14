'use strict';
/* eslint max-len: 0 */
/* eslint max-statements: 0 */
/* eslint new-cap: 0 */

const Struct = require('../index');
const chai   = require('chai');
const expect = chai.expect;

describe('Struct', function() {
  let MyStruct;
  let struct;
  let another;
  let fstruct;

  before(function() {
    MyStruct = Struct('lots', 'of', 'test', 'parameters', 'hooray');
    struct   = new MyStruct('so', 'many', 'fancy', 'testing', 'options', 'here');
    another  = new MyStruct('so', 'many', 'fancy', 'testing', 'options', 'here');
    fstruct  = MyStruct('so', 'many', 'fancy', 'testing', 'options', 'here');
  });

  it('should be an instance of MyStruct', function() {
    expect(struct).to.be.instanceof(MyStruct);
  });

  it('should NOT be an instance of MyStruct', function() {
    expect(fstruct).not.to.be.instanceof(MyStruct);
  });

  it('should throw an error when no values are given', function() {
    expect(function() {
      new Struct();
    }).to.throw('you must supply at least one property name');

    expect(function() {
      Struct([]);
    }).to.throw('you must supply at least one property name');
  });

  it('should accept an array of values and disperse appropriately', function() {
    const tstruct = MyStruct(['so', 'many', 'fancy', 'testing', 'options', 'here']);
    expect(tstruct.deepEqual(struct)).to.be.true;
    expect(tstruct.hooray).to.eql(['options', 'here']);
  });

  it('should not allow non-stringable values as properties', function() {
    expect(function() {
      Struct(undefined);
    }).to.throw('a parameter name must be a string or stringable object');

    expect(function() {
      Struct(null);
    }).to.throw('a parameter name must be a string or stringable object');

    expect(function() {
      Struct({});
    }).to.throw('a parameter name must be a string or stringable object');
  });

  it('should allow non-string, stringable values as properties', function() {
    expect(Struct({ toString: () => 'myProperty' }, 1, false, true)).to.be.ok;
  });

  it('should accept more parameters than there are properties', function() {
    const Numbers = Struct('pi', 'e', 'chaos', 'catchall');
    const numbers = new Numbers(3.1415, 2.71828, 4.6692, 1.6180, -273.15, 6.71 * Math.pow(10, 8));

    expect(numbers.catchall).to.be.an('array');
    expect(numbers.catchall).to.have.length(3);
  });

  it('should allow for less parameters than there are properties', function() {
    const Numbers = Struct('pi', 'e', 'chaos', 'catchall');
    const numbers = new Numbers(3.1415, 2.71828, 4.6692);

    expect(numbers.catchall).to.be.undefined;
    expect(numbers.properties()).to.have.members(['pi', 'e', 'chaos', 'catchall']);
  });

  it('should return an array of values', function() {
    const values = struct.values();

    expect(values).to.be.an('array');
    expect(values).to.eql(['so', 'many', 'fancy', 'testing', ['options', 'here']]);
  });

  it('should return an array of properties', function() {
    const props = struct.properties();

    expect(props).to.be.an('array');
    expect(props).to.eql(['lots', 'of', 'test', 'parameters', 'hooray']);
  });

  it('should return an array of function names', function() {
    const funcs = struct.functions();

    expect(funcs).to.be.an('array');
    expect(funcs).to.eql(['functions', 'each', 'eachPair', 'equal', 'deepEqual', 'length', 'members', 'properties', 'select', 'toArray', 'toObject', 'values', 'valuesAt']);
  });

  it('should return an array of property and function names', function() {
    const all = struct.members();

    expect(all).to.be.an('array');
    expect(all).to.eql(['functions', 'each', 'eachPair', 'equal', 'deepEqual', 'length', 'members', 'properties', 'select', 'toArray', 'toObject', 'values', 'valuesAt', 'lots', 'of', 'test', 'parameters', 'hooray']);
  });

  it('should return a numeric length value', function() {
    expect(struct.length()).to.equal(5);
  });

  it('should have member names equal to another Struct', function() {
    // property names only
    expect(struct.equal(another)).to.be.true;
    // all member names (property + function)
    expect(struct.equal(another, true)).to.be.true;
  });

  it('should have property names and values that are equal to another Struct', function() {
    expect(struct.deepEqual(another)).to.be.true;
    expect(struct.deepEqual(another, true)).to.be.true;
  });

  it('should have property names and values that are equal to a non-instance', function() {
    expect(struct.deepEqual(fstruct)).to.be.true;
    expect(struct.deepEqual(fstruct, true)).to.be.false;
  });

  it('should be able to add properties', function() {
    expect(struct.properties()).to.eql(['lots', 'of', 'test', 'parameters', 'hooray']);

    struct.newProperty = 3.1415;

    expect(struct.properties()).to.include('newProperty');
  });

  it('should have a new length value', function() {
    expect(struct.length()).to.equal(6);
  });

  it('should have new property values', function() {
    expect(struct.values()).to.include(3.1415);
  });

  it('should be able to add functions', function() {
    struct.myFunc = function() { console.log('So shiny and new'); };
    expect(struct.functions()).to.include('myFunc');
  });

  it('should not equal another Struct', function() {
    expect(struct.equal(another)).to.be.false;
    expect(struct.equal(another, true)).to.be.false;
    expect(struct.deepEqual(another)).to.be.false;
    expect(struct.deepEqual(another, true)).to.be.false;
  });

  it('should iterate through each property value', function() {
    const values = struct.values();

    struct.each(function(value, index) {
      expect(values).to.include(value);
      expect(index).to.be.a('number');
    });
  });

  it('should iterate through each property name AND value', function() {

    struct.eachPair(function(name, value, index) {
      expect(index).to.be.a('number');
      expect(struct[name]).to.equal(value);
      expect(struct.valuesAt(index)).to.eql([value]);
      expect(struct.properties()[index]).to.equal(name);
    });
  });

  it('should return an array of values that pass the condition', function() {
    const values = struct.select(function(value, index) {
      expect(struct.values()).to.include(value);
      expect(index).to.be.a('number');

      return typeof value === 'number';
    });

    expect(values).to.be.an('array');
    expect(values).to.eql([3.1415]);
  });

  it('should return an array of values that pass condition with objectMode', function() {
    const values = struct.select(function(value, key) {
      return /new/.test(key) && typeof value === 'number';
    }, true);

    expect(values).to.be.an('array');
    expect(values).to.eql([3.1415]);

  });

  it('should return an array of arrays of property value pairs', function() {
    const pairs = struct.toArray();
    const first = pairs[0];
    const last  = pairs[pairs.length-1];

    expect(pairs).to.be.an('array');
    expect(first).to.be.an('array');
    expect(last).to.be.an('array');
    expect(pairs).to.have.length(6);
    expect(first).to.have.length(2);
    expect(last).to.have.length(2);
    expect(first[0]).to.equal('lots');
    expect(first[1]).to.equal('so');
    expect(last[0]).to.equal('newProperty');
    expect(last[1]).to.equal(3.1415);
  });

  it('should return a new function free object', function() {
    const obj = struct.toObject();

    expect(obj).to.be.an('object');
    expect(struct.functions(obj)).to.eql([]);
    expect(struct.newProperty).to.equal(obj.newProperty);
    expect(struct.equal(obj)).to.be.true;
    expect(struct.equal(obj, true)).to.be.false;
    expect(struct.deepEqual(obj)).to.be.true;
    expect(struct.deepEqual(obj, true)).to.be.false;
  });

  it('should return the values at the provided indices', function() {
    const values = struct.valuesAt(0, 4, 5, 6, false);

    expect(values).to.be.an('array');
    expect(values).to.eql(['so', ['options', 'here'], 3.1415, undefined]);
  });

  it('should return only truthy values at the provided indices', function() {
    struct.lastValue = false;

    const values = struct.valuesAt(1, 6, 9, 11, true);

    expect(values).to.be.an('array');
    expect(values).to.eql(['many']);
  });
});
