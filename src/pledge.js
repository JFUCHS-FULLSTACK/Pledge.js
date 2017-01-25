'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js ES6-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

function $Promise(arg) {

  if(typeof arg !== 'function') {
    throw new Error('argument not a function.');
  }

  this._handlerGroups = [];
  this._state = 'pending';
  this._internalResolve = function(passedValue) {

    if(this._state === 'pending') {
      this._value = passedValue;
      this._state = 'fulfilled';
    }


    while ( this._handlerGroups.length > 0) {

      this._callHandlers(this._value);

    }


  };
  this._internalReject = function(reason) {
    if(this._state === 'pending') {
      this._value = reason;
      this._state = 'rejected';
    }
  };



  this.then = function(successHandler, errHandler) {
    //console.log(typeof successHandler, successHandler);
      if(typeof successHandler !== 'function') {
        successHandler = false;
      }
      if(typeof errHandler !== 'function') {
        errHandler = false;
      }
    this._handlerGroups.push({
      successCb: successHandler,
      errorCb: errHandler
    })
    //console.log(this._handlerGroups);
    if(this._state === 'fulfilled') {
      while ( this._handlerGroups.length > 0) {

        this._callHandlers(this._value);

      }
    }
  }
  //console.log(this);


  let resolve = (value) => {
    this._internalResolve(value);
    //console.log(this._handlerGroups);
    console.log(this);

  }
  let reject = (reason) => {
    this._internalReject(reason);
  }
  arg(resolve, reject);

}

$Promise.prototype._callHandlers = function(value) {
  console.log(this._handlerGroups);
  this._handlerGroups.shift().successCb(value);
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
