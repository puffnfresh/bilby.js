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

exports.tuple2AppendTest = λ.checkTaggedAppend(
    λ.Tuple2,
    [String, String],
    function (a, b) {
        return λ.append(a, b);
    },
    function (tuple, index) {
        return tuple['_' + (index + 1)];
    }
);

exports.tuple3AppendTest = λ.checkTaggedAppend(
    λ.Tuple3,
    [String, String, String],
    function (a, b) {
        return λ.append(a, b);
    },
    function (tuple, index) {
        return tuple['_' + (index + 1)];
    }
);

exports.tuple4AppendTest = λ.checkTaggedAppend(
    λ.Tuple4,
    [String, String, String, String],
    function (a, b) {
        return λ.append(a, b);
    },
    function (tuple, index) {
        return tuple['_' + (index + 1)];
    }
);

exports.tuple5AppendTest = λ.checkTaggedAppend(
    λ.Tuple5,
    [String, String, String, String, String],
    function (a, b) {
        return λ.append(a, b);
    },
    function (tuple, index) {
        return tuple['_' + (index + 1)];
    }
);
