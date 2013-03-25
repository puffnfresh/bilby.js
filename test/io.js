var λ = require('./lib/test');

exports.ioIdentity = λ.check(
    function(a) {
        return λ.io(λ.constant(a)).perform() == a;
    },
    [Number]
);

exports.ioFlatMap = λ.check(
    function(a) {
        return λ.io(λ.constant(a)).flatMap(function(b) {
            return λ.io(λ.constant(a == b));
        }).perform();
    },
    [Number]
);
