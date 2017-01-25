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
    this._internalResolve = function (passedValue) {

        if (this._state === 'pending') {
            this._value = passedValue;
            this._state = 'fulfilled';
        }


        while (this._handlerGroups.length > 0) {
            this._callHandlers(this._value);
        }


    };
    this._internalReject = function (reason) {
        if (this._state === 'pending') {
            this._value = reason;
            this._state = 'rejected';
        }
        while (this._handlerGroups.length > 0) {

            this._callHandlers(this._value);

        }
    };

    let context = this;
    this.then = function (successHandler, errHandler) {
        //console.log(typeof successHandler, successHandler);
        if (typeof successHandler !== 'function') {
            successHandler = false;
        }
        if (typeof errHandler !== 'function') {
            errHandler = false;
        }
        let thenPromise = new $Promise(function () { });
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

    this.catch = function (func) {
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

$Promise.prototype._callHandlers = function (value) {
    // console.log(this._handlerGroups);
    let hGroup;
    if (this._state === 'fulfilled') {
        hGroup = this._handlerGroups.shift();
        if (typeof hGroup.successCb === 'function') {
            if (hGroup.downstream instanceof $Promise) {

                if (hGroup.downstream._handlerGroups[0] !== undefined)  {
                    while (hGroup.downstream._handerGroups[0].downstream instanceof $Promise) {
                        //console.log('here', hGroup.downstream);
                            this._value = hGroup.downstream._value;
                            hGroup.successCb = hGroup.downstream._handerGroups[0].successCb;
                             hGroup.downstream = hGroup.downstream._handerGroups[0].downstream;

                    }

                }

                //console.log('here', hGroup.successCb);
                let foundErr = false;
                let successVal;
                try {
                    successVal = hGroup.successCb(value)

                } catch (err) {
                    console.log('here', err);
                    hGroup.downstream._state = 'rejected';
                    hGroup.downstream._value = err;
                    foundErr = true;

                }
                // if(hGroup.successCb(value) instanceof Error) {
                //     console.log('inside instanceof error');
                // } else {
                if (!foundErr) {
                    console.log('here');
                    hGroup.downstream._value = successVal;
                    hGroup.downstream._state = 'fulfilled';
                }
                // }

            }
            else { hGroup.successCb(value); }
        }
        else {
            hGroup.downstream._state = 'fulfilled';
            hGroup.downstream._value = value;
        }
    } else if (this._state === 'rejected') {
        hGroup = this._handlerGroups.shift();
        // console.log(errorH);
        if (typeof hGroup.errorCb === 'function') {


            if (hGroup.downstream instanceof $Promise) {

                let foundErr = false;
                let failureVal;
                try {
                    failureVal = hGroup.errorCb(value)

                } catch (err) {
                    console.log('here', err);
                    hGroup.downstream._state = 'rejected';
                    hGroup.downstream._value = err;
                    foundErr = true;

                }
                console.log(failureVal);
                // if(hGroup.successCb(value) instanceof Error) {
                //     console.log('inside instanceof error');
                // } else {
                if (!foundErr) {
                    console.log('here');
                    hGroup.downstream._value = failureVal;
                    hGroup.downstream._state = 'fulfilled';
                }
                // }


            }
            else {
                hGroup.errorCb(value);
            }
        }
        else {
            hGroup.downstream._state = 'rejected';
            hGroup.downstream._value = value;
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
