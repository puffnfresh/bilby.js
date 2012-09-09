var λ = require('../bilby');

var add = λ.curry(function(a, b) {
    return a + b;
});

exports.optionTest = function(test) {
    test.equal(λ.some(3).getOrElse(0), 3);
    test.equal(λ.none.getOrElse(0), 0);

    test.done();
};
