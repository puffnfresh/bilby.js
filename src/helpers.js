function curry(f) {
    return function() {
        var g = f.bind.apply(f, [this].concat([].slice.call(arguments))),
            // Special hack for polyfilled Function.prototype.bind
            length = g._length || g.length;

        if(length === 0)
            return g();

        return curry(g);
    };
}
bilby.curry = curry;

function constant(c) {
    return function() {
        return c;
    };
}
bilby.constant = constant;

// TODO: Make into an Option semigroup#append
function extend(a, b) {
    var o = {},
        i;

    for(i in a) {
        o[i] = a[i];
    }
    for(i in b) {
        o[i] = b[i];
    }

    return o;
}
bilby.extend = extend;

function singleton(k, v) {
    var o = {};
    o[k] = v;
    return o;
}
bilby.singleton = singleton;

function isArray(a) {
    if(Array.isArray) return Array.isArray(a);
    return Object.prototype.toString.call(a) === "[object Array]";
}
bilby.isArray = isArray;

var isTypeOf = curry(function(s, o) {
    return typeof o == s;
});
bilby.isTypeOf = isTypeOf;

var isString = isTypeOf('string');
bilby.isString = isString;

var isNumber = isTypeOf('number');
bilby.isNumber = isNumber;
