var λ = require('./lib/test');

exports.tuple2Test = λ.checkTaggedArgs(
    λ.Tuple2,
    [λ.AnyVal, λ.AnyVal],
    function (tuple, index) {
        return tuple['_' + (index + 1)];
    }
);

exports.tuple3Test = λ.checkTaggedArgs(
    λ.Tuple3,
    [λ.AnyVal, λ.AnyVal, λ.AnyVal],
    function (tuple, index) {
        return tuple['_' + (index + 1)];
    }
);

exports.tuple4Test = λ.checkTaggedArgs(
    λ.Tuple4,
    [λ.AnyVal, λ.AnyVal, λ.AnyVal, λ.AnyVal],
    function (tuple, index) {
        return tuple['_' + (index + 1)];
    }
);

exports.tuple5Test = λ.checkTaggedArgs(
    λ.Tuple5,
    [λ.AnyVal, λ.AnyVal, λ.AnyVal, λ.AnyVal, λ.AnyVal],
    function (tuple, index) {
        return tuple['_' + (index + 1)];
    }
);

exports.tuple2AppendTest = λ.checkTaggedConcat(
    λ.Tuple2,
    [String, String],
    function (a, b) {
        return λ.concat(a, b);
    },
    function (tuple, index) {
        return tuple['_' + (index + 1)];
    }
);

exports.tuple3AppendTest = λ.checkTaggedConcat(
    λ.Tuple3,
    [String, String, String],
    function (a, b) {
        return λ.concat(a, b);
    },
    function (tuple, index) {
        return tuple['_' + (index + 1)];
    }
);

exports.tuple4AppendTest = λ.checkTaggedConcat(
    λ.Tuple4,
    [String, String, String, String],
    function (a, b) {
        return λ.concat(a, b);
    },
    function (tuple, index) {
        return tuple['_' + (index + 1)];
    }
);

exports.tuple5AppendTest = λ.checkTaggedConcat(
    λ.Tuple5,
    [String, String, String, String, String],
    function (a, b) {
        return λ.concat(a, b);
    },
    function (tuple, index) {
        return tuple['_' + (index + 1)];
    }
);

//a.concat(b).concat(c) is equivalent to a.concat(b.concat(c))

exports.tuple2ConcatTest = λ.check(
    function(a, b, c) {
        return λ.equal(λ.concat(λ.concat(a, b), c), λ.concat(a, λ.concat(b, c)));
    },
    [λ.Tuple2, λ.Tuple2, λ.Tuple2]
);

exports.tuple3ConcatTest = λ.check(
    function(a, b, c) {
        return λ.equal(λ.concat(λ.concat(a, b), c), λ.concat(a, λ.concat(b, c)));
    },
    [λ.Tuple3, λ.Tuple3, λ.Tuple3]
);

exports.tuple4ConcatTest = λ.check(
    function(a, b, c) {
        return λ.equal(λ.concat(λ.concat(a, b), c), λ.concat(a, λ.concat(b, c)));
    },
    [λ.Tuple4, λ.Tuple4, λ.Tuple4]
);

exports.tuple5ConcatTest = λ.check(
    function(a, b, c) {
        return λ.equal(λ.concat(λ.concat(a, b), c), λ.concat(a, λ.concat(b, c)));
    },
    [λ.Tuple5, λ.Tuple5, λ.Tuple5]
);
