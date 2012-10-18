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

function compose(f, g) {
    return function() {
        return f(g.apply(this, [].slice.call(arguments)));
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
var isBoolean = isTypeOf('boolean');
var isNumber = isTypeOf('number');
var isString = isTypeOf('string');
function isArray(a) {
    if(Array.isArray) return Array.isArray(a);
    return Object.prototype.toString.call(a) === "[object Array]";
}
var isInstanceOf = curry(function(c, o) {
    return o instanceof c;
});

var AnyVal = {};
var Char = {};
function arrayOf(type) {
    if(!(this instanceof arrayOf))
        return new arrayOf(type);

    this.type = type;
}
var isArrayOf = isInstanceOf(arrayOf);
function objectLike(props) {
    if(!(this instanceof objectLike))
        return new objectLike(props);

    this.props = props;
}
var isObjectLike = isInstanceOf(objectLike);

var or = curry(function(a, b) {
    return a || b;
});
var and = curry(function(a, b) {
    return a && b;
});
var add = curry(function(a, b) {
    return a + b;
});
var strictEquals = curry(function(a, b) {
    return a === b;
});

function liftA2(f, a, b) {
    return this['*'](this['<'](a, f), b);
}

function sequence(m, a) {
    var env = this;

    if(!a.length)
        return env.pure(m, []);

    return env['>='](a[0], function(x) {
        return env['>='](env.sequence(m, a.slice(1)), function(y) {
            return env.pure(m, [x].concat(y));
        });
    });
}

bilby = bilby
    .property('bind', bind)
    .property('curry', curry)
    .property('compose', compose)
    .property('error', error)
    .property('identity', identity)
    .property('constant', constant)
    .property('zip', zip)
    .property('extend', extend)
    .property('singleton', singleton)
    .property('isTypeOf',  isTypeOf)
    .property('isArray', isArray)
    .property('isBoolean', isBoolean)
    .property('isFunction', isFunction)
    .property('isNumber', isNumber)
    .property('isString', isString)
    .property('isInstanceOf', isInstanceOf)
    .property('AnyVal', AnyVal)
    .property('Char', Char)
    .property('arrayOf', arrayOf)
    .property('isArrayOf', isArrayOf)
    .property('objectLike', objectLike)
    .property('isObjectLike', isObjectLike)
    .property('or', or)
    .property('and', and)
    .property('add', add)
    .property('strictEquals', strictEquals)
    .property('liftA2', liftA2)
    .property('sequence', sequence);
