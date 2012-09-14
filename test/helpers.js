var λ = require('../bilby');

exports.curriedTest = function(test) {
    test.equal(λ.add(1)(2), 3);
    test.done();
};

exports.uncurriedTest = function(test) {
    test.equal(λ.add(1, 2), 3);
    test.done();
};
