require('../bilby').bilbify(global);

var add = curry(function(a, b) {
    return a + b;
});

exports.curriedTest = function(test) {
    test.equal(add(1)(2), 3);
    test.done();
};

exports.uncurriedTest = function(test) {
    test.equal(add(1, 2), 3);
    test.done();
};
