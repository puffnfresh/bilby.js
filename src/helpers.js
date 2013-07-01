/**
   # Helpers

   The helpers module is a collection of functions used often inside
   of bilby.js or are generally useful for programs.
**/

/**
    ## functionName(f)

    Returns the name of function `f`.
**/
function functionName(f) {
    return f._name || f.name;
}

/**
    ## functionLength(f)

    Returns the arity of function `f`.
**/
function functionLength(f) {
    return f._length || f.length;
}

/**
   ## bind(f)(o)

   Makes `this` inside of `f` equal to `o`:

       bilby.bind(function() { return this; })(a)() == a

   Also partially applies arguments:

       bilby.bind(bilby.add)(null, 10)(32) == 42
**/
function bind(f) {
    function curriedBind(o) {
        var args = [].slice.call(arguments, 1),
            g;

        if(f.bind) {
            g = f.bind.apply(f, [o].concat(args));
        } else {
            g = function() {
                return f.apply(o, args.concat([].slice.call(arguments)));
            };
        }

        // Can't override length but can set _length for currying
        g._length = Math.max(functionLength(f) - args.length, 0);

        return g;
    }
    // Manual currying since `curry` relies in bind.
    if(arguments.length > 1) return curriedBind.apply(this, [].slice.call(arguments, 1));
    return curriedBind;
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
            length = functionLength(g);

        if(!length)
            return g();

        return curry(g);
    };
}

/**
   ## flip(f)

   Flips the order of arguments to `f`:

       var concat = bilby.curry(function(a, b) {
               return a + b;
           }),
           prepend = flip(concat);
**/
function flip(f) {
    return function(a) {
        return function(b) {
            return f(b, a);
        };
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
   ## create(proto)

   Partial polyfill for Object.create - creates a new instance of the
   given prototype.
**/
function create(proto) {
    function Ctor() {}
    Ctor.prototype = proto;
    return new Ctor();
}

/**
   ## getInstance(self, constructor)

   Always returns an instance of constructor.

   Returns self if it is an instanceof constructor, otherwise
   constructs an object with the correct prototype.
**/
function getInstance(self, constructor) {
    return self instanceof constructor ? self : create(constructor.prototype);
}

/**
   ## tagged(name, fields)

   Creates a simple constructor for a tagged object.

       var Tuple = tagged('Tuple', ['a', 'b']);
       var x = Tuple(1, 2);
       var y = new Tuple(3, 4);
       x instanceof Tuple && y instanceof Tuple;
**/
function tagged(name, fields) {
    function wrapped() {
        var self = getInstance(this, wrapped),
            i;
        if(arguments.length != fields.length) {
            throw new TypeError("Expected " + fields.length + " arguments, got " + arguments.length);
        }
        for(i = 0; i < fields.length; i++) {
            self[fields[i]] = arguments[i];
        }
        return self;
    }
    wrapped._name = name;
    wrapped._length = fields.length;
    return wrapped;
}

/**
    ## taggedSum(constructors)

    Creates a disjoint union of constructors, with a catamorphism.

        var List = taggedSum({
            Cons: ['car', 'cdr'],
            Nil: []
        });
        function listLength(l) {
            return l.cata({
                Cons: function(car, cdr) {
                    return 1 + listLength(cdr);
                },
                Nil: function() {
                    return 0;
                }
            });
        }
        listLength(List.Cons(1, new List.Cons(2, List.Nil()))) == 2;
**/
function taggedSum(constructors) {
    var key, proto;

    function definitions() {}

    function makeCata(key) {
        return function(dispatches) {
            var fields = constructors[key], args = [], i;
            if(!dispatches[key]) throw new TypeError("Constructors given to cata didn't include: " + key);
            for(i = 0; i < fields.length; i++) {
                args.push(this[fields[i]]);
            }
            return dispatches[key].apply(this, args);
        };
    }

    function makeProto(key) {
        var proto = create(definitions.prototype);
        proto.cata = makeCata(key);
        return proto;
    }

    for(key in constructors) {
        if(!constructors[key].length) {
            definitions[key] = makeProto(key);
            continue;
        }
        definitions[key] = tagged(key, constructors[key]);
        definitions[key].prototype = makeProto(key);
    }

    return definitions;
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

   Right-biased key-value concat of objects `a` and `b`:

       bilby.extend({a: 1, b: 2}, {b: true, c: false}) == {a: 1, b: true, c: false}
**/
// TODO: Make into an Object semigroup#concat
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
   ## isEven(a)

   Returns `true` iff `a` is even.
**/
function isEven(a) {
    return (a & 1) === 0;
}
/**
   ## isOdd(a)

   Returns `true` iff `a` is odd.
**/
function isOdd(a) {
    return !isEven(a);
}
/**
   ## isInstanceOf(c)(o)

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
    var self = getInstance(this, arrayOf);
    self.type = type;
    return self;
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
    var self = getInstance(this, objectLike);
    self.props = props;
    return self;
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
   ## fill(s)(t)

   Curried function for filling array.
**/
var fill = curry(function(s, t) {
    return this.map(range(s), t);
});
/**
   ## range(a)

   Create an array with a given range (length).
**/
function range(s) {
    var accum = [],
        i;
    for(i = 0; i < s; i++) {
        accum[i] = i;
    }
    return accum;
}

/**
   ## liftA2(f, a, b)

   Lifts a curried, binary function `f` into the applicative passes
   `a` and `b` as parameters.
**/
function liftA2(f, a, b) {
    return this.ap(this.map(a, f), b);
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

    return env.flatMap(a[0], function(x) {
        return env.flatMap(env.sequence(m, a.slice(1)), function(y) {
            return env.pure(m, [x].concat(y));
        });
    });
}

bilby = bilby
    .property('functionName', functionName)
    .property('functionLength', functionLength)
    .property('bind', bind)
    .property('curry', curry)
    .property('flip', flip)
    .property('identity', identity)
    .property('constant', constant)
    .property('compose', compose)
    .property('create', create)
    .property('tagged', tagged)
    .property('taggedSum', taggedSum)
    .property('error', error)
    .property('extend', extend)
    .property('singleton', singleton)
    .property('isTypeOf',  isTypeOf)
    .property('isArray', isArray)
    .property('isBoolean', isBoolean)
    .property('isFunction', isFunction)
    .property('isNumber', isNumber)
    .property('isString', isString)
    .property('isEven', isEven)
    .property('isOdd', isOdd)
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
    .property('fill', fill)
    .property('strictEquals', strictEquals)
    .property('liftA2', liftA2)
    .property('sequence', sequence);
