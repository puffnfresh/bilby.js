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
bilby = bilby.property('bind', bind);

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
bilby = bilby.property('curry', curry);

function constant(c) {
    return function() {
        return c;
    };
}
bilby = bilby.property('constant', constant);

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
bilby = bilby.property('extend', extend);

function singleton(k, v) {
    var o = {};
    o[k] = v;
    return o;
}
bilby = bilby.property('singleton', singleton);

function isArray(a) {
    if(Array.isArray) return Array.isArray(a);
    return Object.prototype.toString.call(a) === "[object Array]";
}
bilby = bilby.property('isArray', isArray);

var isTypeOf = curry(function(s, o) {
    return typeof o == s;
});
bilby = bilby.property('isTypeOf',  isTypeOf);

var isFunction = isTypeOf('function');
bilby = bilby.property('isFunction', isFunction);

var isString = isTypeOf('string');
bilby = bilby.property('isString', isString);

var isNumber = isTypeOf('number');
bilby = bilby.property('isNumber', isNumber);

var isInstanceOf = curry(function(c, o) {
    if(typeof o != 'object')
        return false;

    return o instanceof c;
});
bilby = bilby.property('isInstanceOf', isInstanceOf);
