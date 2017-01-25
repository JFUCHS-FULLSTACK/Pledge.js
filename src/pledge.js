'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js ES6-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

function $Promise(arg) {

    if (typeof arg !== 'function') {
        throw new Error('argument not a function.');
    }

    this._handlerGroups = [];
    this._state = 'pending';
    this._internalResolve = function(passedValue) {

        if (this._state === 'pending') {
            this._value = passedValue;
            this._state = 'fulfilled';
        }


        while (this._handlerGroups.length > 0) {
            this._callHandlers(this._value);
        }


    };
    this._internalReject = function(reason) {
        if (this._state === 'pending') {
            this._value = reason;
            this._state = 'rejected';
        }
        while (this._handlerGroups.length > 0) {

            this._callHandlers(this._value);

        }
    };

    let context = this;
    this.then = function(successHandler, errHandler) {
        //console.log(typeof successHandler, successHandler);
        if (typeof successHandler !== 'function') {
            successHandler = false;
        }
        if (typeof errHandler !== 'function') {
            errHandler = false;
        }
        let thenPromise = new $Promise(function() {});
        console.log(context._value);
        // if (typeof context._handlerGroups[0].successCb !== 'function') {
        //     thenPromise._value = context._value;
        // }
        this._handlerGroups.push({
            successCb: successHandler,
            errorCb: errHandler,
            downstream: thenPromise
        });
        //console.log(this._handlerGroups);
        if (this._state !== 'pending') {
            while (this._handlerGroups.length > 0) {

                this._callHandlers(this._value);

            }
        }
        
        return thenPromise;
    };
    //console.log(this);

    this.catch = function(func) {
        return this.then(null, func);
    };


    let resolve = (value) => {
        this._internalResolve(value);
        //console.log(this._handlerGroups);
        // console.log(this);

    };
    let reject = (reason) => {
        this._internalReject(reason);
    };
    arg(resolve, reject);

}

$Promise.prototype._callHandlers = function(value) {
    // console.log(this._handlerGroups);
    if (this._state === 'fulfilled') {
      let successH = this._handlerGroups.shift();
      // if ((typeof successH.successCb === 'function') && ) {
      //       successH.downstream._handlerGroups.push({successCb: successH.successCb(value)});
      //       successH.downstream._state = 'fulfilled';
      //   }
      if (typeof successH.successCb === 'function') {
        if (successH.downstream instanceof $Promise){
          console.log(successH.downstream);
          // successH.downstream._handlerGroups.push(successH.successCb(value), null);
          successH.downstream._value = successH.successCb(value);
          successH.downstream._state = 'fulfilled';
        }
        else { successH.successCb(value); }
      }
      else {
        successH.downstream._state = 'fulfilled';
        successH.downstream._value = value;
      }
    } else if (this._state === 'rejected') {
        let errorH = this._handlerGroups.shift();
        // console.log(errorH);
        if (typeof errorH.errorCb === 'function') {
            errorH.errorCb(value);
        }
        else {
          errorH.downstream._state = 'rejected';
          errorH.downstream._value = value;
        }
    }
};


/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = $Promise;

So in a Node-based project we could write things like this:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
