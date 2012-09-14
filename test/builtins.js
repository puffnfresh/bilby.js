var λ = require('./lib/test');

exports.arrayFoldTest = λ.check(
    function(a) {
        return λ.fold(a, 0, λ.add(1)) == a.length;
    },
    [λ.arrayOf(Number)]
);

exports.arrayEqualTest = λ.check(
    function(a, b, c) {
        return λ.equal([a, b, c], [a, b, c]);
    },
    [Number, String, Boolean]
);

exports.arrayNotEqualTest = λ.check(
    function(a, b) {
        return !λ.equal([a, b], [-a + 1, b]) && !λ.equal([a, b], [a, -b + 1]);
    },
    [Number, Number]
);
