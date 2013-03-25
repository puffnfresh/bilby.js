var λ = require('./lib/test');

exports.someGetOrElseTest = λ.check(
    function(a, b) {
        return λ.some(a).getOrElse(b) == a;
    },
    [λ.AnyVal, λ.AnyVal]
);

exports.noneGetOrElseTest = λ.check(
    function(a) {
        return λ.none.getOrElse(a) == a;
    },
    [λ.AnyVal]
);

exports.someToLeftTest = λ.check(
    function(a, b) {
        return λ.some(a).toLeft(b).fold(λ.identity, λ.badRight) == a;
    },
    [λ.AnyVal]
);

exports.noneToLeftTest = λ.check(
    function(a) {
        return λ.none.toLeft(a).fold(λ.badLeft, λ.identity) == a;
    },
    [λ.AnyVal]
);

exports.someToRightTest = λ.check(
    function(a, b) {
        return λ.some(a).toRight(b).fold(λ.badLeft, λ.identity) == a;
    },
    [λ.AnyVal]
);

exports.noneToRightTest = λ.check(
    function(a) {
        return λ.none.toRight(a).fold(λ.identity, λ.badRight) == a;
    },
    [λ.AnyVal]
);
