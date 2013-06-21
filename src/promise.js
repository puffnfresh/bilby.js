/**
    ## `Promise(fork)`

    Promise is a constructor which takes a `fork` function. The `fork`
    function takes two arguments:

        fork(resolve, reject)

    Both `resolve` and `reject` are side-effecting callbacks.

    ### `fork(resolve, reject)`

    The `resolve` callback gets called on a "successful" value. The
    `reject` callback gets called on a "failure" value.
**/
var Promise = tagged('Promise', ['fork']);

/**
    ### `Promise.of(x)`

    Creates a Promise that contains a successful value.
**/
Promise.of = function(x) {
    return new Promise(function(resolve, reject) {
        resolve(x);
    });
};

/**
    ### `Promise.error(x)`

    Creates a Promise that contains a failure value.
**/
Promise.error = function(x) {
    return new Promise(function(resolve, reject) {
        reject(x);
    });
};

/**
    ### `chain(f)`

    Returns a new promise that evaluates `f` when the current promise
    is successfully fulfilled. `f` must return a new promise.
**/
Promise.prototype.chain = function(f) {
    var promise = this;
    return new Promise(function(resolve, reject) {
        promise.fork(function(a) {
            f(a).fork(resolve, reject);
        }, reject);
    });
};

/**
    ### `reject(f)`

    Returns a new promise that evaluates `f` when the current promise
    fails. `f` must return a new promise.
**/
Promise.prototype.reject = function(f) {
    var promise = this;
    return new Promise(function(resolve, reject) {
        promise.fork(resolve, function(a) {
            f(a).fork(resolve, reject);
        });
    });
};

/**
    ### `map(f)`

    Returns a new promise that evaluates `f` on a value and passes it
    through to the resolve function.
**/
Promise.prototype.map = function(f) {
    var promise = this;
    return new Promise(function(resolve, reject) {
        promise.fork(function(a) {
            resolve(f(a));
        }, reject);
    });
};

/**
   ## isPromise(a)

   Returns `true` if `a` is `Promise`.
**/
var isPromise = isInstanceOf(Promise);

bilby = bilby
    .property('Promise', Promise)
    .property('isPromise', isPromise)
    .method('map', isPromise, function(a, b) {
        return a.map(b);
    });