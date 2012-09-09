var λ = require('../bilby');

exports.getOrElseTest = function(test) {
    test.equal(λ.some(3).getOrElse(0), 3);
    test.equal(λ.none.getOrElse(0), 0);
    test.done();
};

exports.toLeftTest = function(test) {
    test.equal(λ.some(3).toLeft(0).fold(λ.identity, λ.error("Got right side")), 3);
    test.equal(λ.none.toLeft(0).fold(λ.error("Got left side"), λ.identity), 0);
    test.done();
};

exports.toRightTest = function(test) {
    test.equal(λ.some(3).toRight(0).fold(λ.error("Got left side"), λ.identity), 3);
    test.equal(λ.none.toRight(0).fold(λ.identity, λ.error("Got right side")), 0);
    test.done();
};
