var λ = require('./lib/test');

exports.promiseTest = λ.checkTaggedArgs(
    λ.Promise,
    [Function],
    function (id, index) {
        return id.fork;
    }
);

exports.testOf = function(test) {
    var promise = λ.Promise.of(41);
    promise.fork(
        function(data) {
            test.equal(41, data);
            test.done();
        },
        function(error) {
            test.ok(false, 'Promise.of called reject');
            test.done();
        }
    );
};


exports.testError = function(test) {
    var promise = λ.Promise.error(41);
    promise.fork(
        function(data) {
            test.ok(false, 'Promise.error called resolve');
            test.done();
        },
        function(error) {
            test.equal(41, error);
            test.done();
        }
    );
};

exports.testChainOf = function(test) {
    var promise = λ.Promise.of(41).chain(function(a) {
        return λ.Promise.of(a + 1);
    });
    promise.fork(
        function(data) {
            test.equal(42, data);
            test.done();
        },
        function(error) {
            test.ok(false, 'chain with of called reject');
            test.done();
        }
    );
};

exports.testChainError = function(test) {
    var promise = λ.Promise.of(41).chain(function(a) {
        return λ.Promise.error(a + 1);
    });
    promise.fork(
        function(data) {
            test.ok(false, 'chain with error called resolve');
            test.done();
        },
        function(error) {
            test.equal(42, error);
            test.done();
        }
    );
};

exports.testRejectError = function(test) {
    var promise = λ.Promise.error(41).reject(function(a) {
        return λ.Promise.error(a + 1);
    });
    promise.fork(
        function(data) {
            test.ok(false, 'reject with error called resolve');
            test.done();
        },
        function(error) {
            test.equal(42, error);
            test.done();
        }
    );
};

exports.testRejectOf = function(test) {
    var promise = λ.Promise.error(41).reject(function(a) {
        return λ.Promise.of(a + 1);
    });
    promise.fork(
        function(data) {
            test.equal(42, data);
            test.done();
        },
        function(error) {
            test.ok(false, 'reject with of called reject');
            test.done();
        }
    );
};

exports.testMap = function(test) {
    var promise = λ.Promise.of(41).map(function(a) {
        return a + 1;
    });
    promise.fork(
        function(data) {
            test.equal(42, data);
            test.done();
        },
        function(error) {
            test.ok(false, 'chain called reject');
            test.done();
        }
    );
};

exports.testJoin = function(test) {
    var promise = λ.Promise.of(λ.Promise.of(42)).chain(function(a) {
        return a;
    });
    promise.fork(
        function(data) {
            test.equal(42, data);
            test.done();
        },
        function(error) {
            test.ok(false, 'chain called reject');
            test.done();
        }
    );
};