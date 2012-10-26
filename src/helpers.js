/**
   # Helpers

   The helpers module is a collection of functions used often inside
   of bilby.js or are generally useful for programs.
**/

/**
   ## bind(f)(o)

   Makes `this` inside of `f` equal to `o`:

       bilby.bind(function() { return this; })(a)() == a

   Also partially applies arguments:

       bilby.bind(bilby.add)(null, 10)(32) == 42
**/
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

/**
   ## curry(f)

   Takes a normal function `f` and allows partial application of its
   named arguments:

       var add = bilby.curry(function(a, b) {
               return a + b;
           }),
           add15 = add(15);

       add15(27) == 42;

   Retains ability of complete application by calling the function
   when enough arguments are filled:

       add(15, 27) == 42;
**/
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

/**
   ## identity(o)

   Identity function. Returns `o`:

       forall a. identity(a) == a
**/
function identity(o) {
    return o;
}

/**
   ## constant(c)

   Constant function. Creates a function that always returns `c`, no
   matter the argument:

       forall a b. constant(a)(b) == a
**/
function constant(c) {
    return function() {
        return c;
    };
}

/**
   ## compose(f, g)

   Creates a new function that applies `f` to the result of `g` of the
   input argument:

       forall f g x. compose(f, g)(x) == f(g(x))
**/
function compose(f, g) {
    return function() {
        return f(g.apply(this, [].slice.call(arguments)));
    };
}

/**
   ## error(s)

   Turns the `throw new Error(s)` statement into an expression.
**/
function error(s) {
    return function() {
        throw new Error(s);
    };
}

/**
   ## zip(a, b)

   Takes two lists and pairs their values together into a "tuple" (2
   length list):

       zip([1, 2, 3], [4, 5, 6]) == [[1, 4], [2, 5], [3, 6]]
**/
function zip(a, b) {
    var accum = [],
        i;

    for(i = 0; i < Math.min(a.length, b.length); i++) {
        accum.push([a[i], b[i]]);
    }

    return accum;
}

/**
   ## singleton(k, v)

   Creates a new single object using `k` as the key and `v` as the
   value. Useful for creating arbitrary keyed objects without
   mutation:

       singleton(['Hello', 'world'].join(' '), 42) == {'Hello world': 42}
**/
function singleton(k, v) {
    var o = {};
    o[k] = v;
    return o;
}

/**
   ## extend(a, b)

   Right-biased key-value append of objects `a` and `b`:

       bilby.extend({a: 1, b: 2}, {b: true, c: false}) == {a: 1, b: true, c: false}
**/
// TODO: Make into an Object semigroup#append
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

/**
   ## isTypeOf(s)(o)

   Returns `true` iff `o` has `typeof s`.
**/
var isTypeOf = curry(function(s, o) {
    return typeof o == s;
});
/**
   ## isFunction(a)

   Returns `true` iff `a` is a `Function`.
**/
var isFunction = isTypeOf('function');
/**
   ## isBoolean(a)

   Returns `true` iff `a` is a `Boolean`.
**/
var isBoolean = isTypeOf('boolean');
/**
   ## isNumber(a)

   Returns `true` iff `a` is a `Number`.
**/
var isNumber = isTypeOf('number');
/**
   ## isString(a)

   Returns `true` iff `a` is a `String`.
**/
var isString = isTypeOf('string');
/**
   ## isArray(a)

   Returns `true` iff `a` is an `Array`.
**/
function isArray(a) {
    if(Array.isArray) return Array.isArray(a);
    return Object.prototype.toString.call(a) === "[object Array]";
}
/**
   ## isArray(c)(o)

   Returns `true` iff `o` is an instance of `c`.
**/
var isInstanceOf = curry(function(c, o) {
    return o instanceof c;
});

/**
   ## AnyVal

   Sentinal value for when any type of primitive value is needed.
**/
var AnyVal = {};
/**
   ## Char

   Sentinal value for when a single character string is needed.
**/
var Char = {};
/**
   ## arrayOf(type)

   Sentinal value for when an array of a particular type is needed:

       arrayOf(Number)
**/
function arrayOf(type) {
    if(!(this instanceof arrayOf))
        return new arrayOf(type);

    this.type = type;
}
/**
   ## isArrayOf(a)

   Returns `true` iff `a` is an instance of `arrayOf`.
**/
var isArrayOf = isInstanceOf(arrayOf);
/**
   ## objectLike(props)

   Sentinal value for when an object with specified properties is
   needed:

       objectLike({
           age: Number,
           name: String
       })
**/
function objectLike(props) {
    if(!(this instanceof objectLike))
        return new objectLike(props);

    this.props = props;
}
/**
   ## isObjectLike(a)

   Returns `true` iff `a` is an instance of `objectLike`.
**/
var isObjectLike = isInstanceOf(objectLike);

/**
   ## or(a)(b)

   Curried function for `||`.
**/
var or = curry(function(a, b) {
    return a || b;
});
/**
   ## and(a)(b)

   Curried function for `&&`.
**/
var and = curry(function(a, b) {
    return a && b;
});
/**
   ## add(a)(b)

   Curried function for `+`.
**/
var add = curry(function(a, b) {
    return a + b;
});
/**
   ## strictEquals(a)(b)

   Curried function for `===`.
**/
var strictEquals = curry(function(a, b) {
    return a === b;
});

/**
   ## liftA2(f, a, b)

   Lifts a curried, binary function `f` into the applicative passes
   `a` and `b` as parameters.
**/
function liftA2(f, a, b) {
    return this['*'](this['<'](a, f), b);
}

/**
   ## sequence(m, a)

   Sequences an array, `a`, of values belonging to the `m` monad:

        bilby.sequence(Array, [
            [1, 2],
            [3],
            [4, 5]
        ]) == [
            [1, 3, 4],
            [1, 3, 5],
            [2, 3, 4],
            [2, 3, 5]
        ]
**/
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
