var λ = require('./lib/test');

// TODO : Make a check function to check argument are same.

// Tuple2
exports.tuple2GetFirstTest = λ.check(
    function (a, b) {
        return λ.Tuple2(a, b)._1 == a;
    },
    [λ.AnyVal, λ.AnyVal]
);

exports.tuple2GetSecondTest = λ.check(
    function (a, b) {
        return λ.Tuple2(a, b)._2 == b;
    },
    [λ.AnyVal, λ.AnyVal]
);


// Tuple3
exports.tuple3GetFirstTest = λ.check(
    function (a, b, c) {
        return λ.Tuple3(a, b, c)._1 == a;
    },
    [λ.AnyVal, λ.AnyVal, λ.AnyVal]
);

exports.tuple3GetSecondTest = λ.check(
    function (a, b, c) {
        return λ.Tuple3(a, b, c)._2 == b;
    },
    [λ.AnyVal, λ.AnyVal, λ.AnyVal]
);

exports.tuple3GetThirdTest = λ.check(
    function (a, b, c) {
        return λ.Tuple3(a, b, c)._3 == c;
    },
    [λ.AnyVal, λ.AnyVal, λ.AnyVal]
);

// Tuple4
exports.tuple4GetFirstTest = λ.check(
    function (a, b, c, d) {
        return λ.Tuple4(a, b, c, d)._1 == a;
    },
    [λ.AnyVal, λ.AnyVal, λ.AnyVal, λ.AnyVal]
);

exports.tuple4GetSecondTest = λ.check(
    function (a, b, c, d) {
        return λ.Tuple4(a, b, c, d)._2 == b;
    },
    [λ.AnyVal, λ.AnyVal, λ.AnyVal, λ.AnyVal]
);

exports.tuple4GetThirdTest = λ.check(
    function (a, b, c, d) {
        return λ.Tuple4(a, b, c, d)._3 == c;
    },
    [λ.AnyVal, λ.AnyVal, λ.AnyVal, λ.AnyVal]
);

exports.tuple4GetFourthTest = λ.check(
    function (a, b, c, d) {
        return λ.Tuple4(a, b, c, d)._3 == c;
    },
    [λ.AnyVal, λ.AnyVal, λ.AnyVal, λ.AnyVal]
);
