var λ = require('./lib/test');

exports.forAllTest = λ.check(
    function(s, n) {
        return λ.isString(s) && λ.isNumber(n);
    },
    [String, Number]
);
