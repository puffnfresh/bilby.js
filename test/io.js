var λ = require('./lib/test');

exports.ioIdentity = λ.check(
    function(a) {
        return λ.io(λ.constant(a)).perform() == a;
    },
    [Number]
);

exports.ioBind = λ.check(
    function(a) {
        return λ.io(λ.constant(a)).bind(function(b) {
            return λ.io(λ.constant(a == b));
        }).perform();
    },
    [Number]
);
