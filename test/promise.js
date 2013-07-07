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
        }
    );
};
