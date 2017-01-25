'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js ES6-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

function $Promise(arg) {

  if(typeof arg !== 'function') {
    throw new Error('argument not a function.');
  }

  this._state = 'pending';
  this._internalResolve = function(passedValue) {

    if(this._state === 'pending') {
      this._value = passedValue;
      this._state = 'fulfilled';
    }

  };
  this._internalReject = function(reason) {
    if(this._state === 'pending') {
      this._value = reason;
      this._state = 'rejected';
    }
  };

  console.log(this);


  let resolve = (value) => {
    this._internalResolve(value);
  }
  let reject = (reason) => {
    this._internalReject(reason);
  }
  arg(resolve, reject);

}




/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = $Promise;

So in a Node-based project we could write things like this:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
