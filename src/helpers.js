function bind(f) {
    return function(o) {
        if(f.bind)
            return f.bind.apply(f, [o].concat([].slice.call(arguments, 1)));

        var length = f._length || f.length,
            args = [].slice.call(arguments, 1),
            g = function() {
                return f.apply(o || this, args.concat([].slice.call(arguments)));
            };

        // Can't override length but can set _length for currying
        g._length = length - args.length;

        return g;
    };
}

function curry(f) {
    return function() {
        var g = bind(f).apply(f, [this].concat([].slice.call(arguments))),
            // Special hack for polyfilled Function.prototype.bind
            length = g._length || g.length;

        if(length === 0)
            return g();

        return curry(g);
    };
}

function error(s) {
    return function() {
        throw new Error(s);
    };
}

function identity(o) {
    return o;
}

function constant(c) {
    return function() {
        return c;
    };
}

function zip(a, b) {
    var accum = [],
        i;
    for(i = 0; i < Math.min(a.length, b.length); i++) {
        accum.push([a[i], b[i]]);
    }

    return accum;
}

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

function singleton(k, v) {
    var o = {};
    o[k] = v;
    return o;
}

var isTypeOf = curry(function(s, o) {
    return typeof o == s;
});
var isFunction = isTypeOf('function');
var isString = isTypeOf('string');
var isNumber = isTypeOf('number');
function isArray(a) {
    if(Array.isArray) return Array.isArray(a);
    return Object.prototype.toString.call(a) === "[object Array]";
}
var isInstanceOf = curry(function(c, o) {
    return o instanceof c;
});

bilby = bilby
    .property('bind', bind)
    .property('curry', curry)
    .property('error', error)
    .property('identity', identity)
    .property('constant', constant)
    .property('zip', zip)
    .property('extend', extend)
    .property('singleton', singleton)
    .property('isTypeOf',  isTypeOf)
    .property('isFunction', isFunction)
    .property('isString', isString)
    .property('isNumber', isNumber)
    .property('isArray', isArray)
    .property('isInstanceOf', isInstanceOf);
