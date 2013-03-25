/**
   # Data structures

   Church-encoded versions of common functional data
   structures. Disjunction is enoded by multiple constructors with
   different implementations of common functions.
**/

/**
   ## Option

       Option a = Some a + None

   The option type encodes the presence and absence of a value. The
   `some` constructor represents a value and `none` represents the
   absence.

   * fold(a, b) - applies `a` to value if `some` or defaults to `b`
   * getOrElse(a) - default value for `none`
   * isSome - `true` iff `this` is `some`
   * isNone - `true` iff `this` is `none`
   * toLeft(r) - `left(x)` if `some(x)`, `right(r)` if none
   * toRight(l) - `right(x)` if `some(x)`, `left(l)` if none
   * flatMap(f) - monadic flatMap/bind
   * map(f) - functor map
   * ap(s) - applicative ap(ply)
   * append(s, plus) - semigroup append
**/

/**
   ### some(x)

   Constructor to represent the existance of a value, `x`.
**/
function some(x) {
    if(!(this instanceof some)) return new some(x);
    this.fold = function(a) {
        return a(x);
    };
    this.getOrElse = function() {
        return x;
    };
    this.isSome = true;
    this.isNone = false;
    this.toLeft = function() {
        return left(x);
    };
    this.toRight = function() {
        return right(x);
    };

    this.flatMap = function(f) {
        return f(x);
    };
    this.map = function(f) {
        return some(f(x));
    };
    this.ap = function(s) {
        return s.map(x);
    };
    this.append = function(s, plus) {
        return s.map(function(y) {
            return plus(x, y);
        });
    };
    Do.setValueOf(this);
}

/**
   ### none

   Represents the absence of a value.
**/
var none = {
    fold: function(a, b) {
        return b;
    },
    getOrElse: function(x) {
        return x;
    },
    isSome: false,
    isNone: true,
    toLeft: function(r) {
        return right(r);
    },
    toRight: function(l) {
        return left(l);
    },

    flatMap: function() {
        return this;
    },
    map: function() {
        return this;
    },
    ap: function() {
        return this;
    },
    append: function() {
        return this;
    }
};
Do.setValueOf(none);

/**
   ## isOption(a)

   Returns `true` iff `a` is a `some` or `none`.
**/
var isOption = bilby.liftA2(or, isInstanceOf(some), strictEquals(none));


/**
   ## Either

       Either a b = Left a + Right b

   Represents a tagged disjunction between two sets of values; `a` or
   `b`. Methods are right-biased.

   * fold(a, b) - `a` applied to value if `left`, `b` if `right`
   * swap() - turns `left` into `right` and vice-versa
   * isLeft - `true` iff `this` is `left`
   * isRight - `true` iff `this` is `right`
   * toOption() - `none` if `left`, `some` value of `right`
   * toArray() - `[]` if `left`, singleton value if `right`
   * flatMap(f) - monadic flatMap/bind
   * map(f) - functor map
   * ap(s) - applicative ap(ply)
   * append(s, plus) - semigroup append
**/

/**
   ### left(x)

   Constructor to represent the left case.
**/
function left(x) {
    if(!(this instanceof left)) return new left(x);
    this.fold = function(a, b) {
        return a(x);
    };
    this.swap = function() {
        return right(x);
    };
    this.isLeft = true;
    this.isRight = false;
    this.toOption = function() {
        return none;
    };
    this.toArray = function() {
        return [];
    };

    this.flatMap = function() {
        return this;
    };
    this.map = function() {
        return this;
    };
    this.ap = function(e) {
        return this;
    };
    this.append = function(l, plus) {
        var t = this;
        return l.fold(function(y) {
            return left(plus(x, y));
        }, function() {
            return t;
        });
    };
}

/**
   ### right(x)

   Constructor to represent the (biased) right case.
**/
function right(x) {
    if(!(this instanceof right)) return new right(x);
    this.fold = function(a, b) {
        return b(x);
    };
    this.swap = function() {
        return left(x);
    };
    this.isLeft = false;
    this.isRight = true;
    this.toOption = function() {
        return some(x);
    };
    this.toArray = function() {
        return [x];
    };

    this.flatMap = function(f) {
        return f(x);
    };
    this.map = function(f) {
        return right(f(x));
    };
    this.ap = function(e) {
        return e.map(x);
    };
    this.append = function(r, plus) {
        return r.fold(function(x) {
            return left(x);
        }, function(y) {
            return right(plus(x, y));
        });
    };
}

/**
   ## isEither(a)

   Returns `true` iff `a` is a `left` or a `right`.
**/
var isEither = bilby.liftA2(or, isInstanceOf(left), isInstanceOf(right));


bilby = bilby
    .property('some', some)
    .property('none', none)
    .property('isOption', isOption)
    .method('fold', isOption, function(a, b, c) {
        return a.fold(b, c);
    })
    .method('flatMap', isOption, function(a, b) {
        return a.flatMap(b);
    })
    .method('map', isOption, function(a, b) {
        return a.map(b);
    })
    .method('ap', isOption, function(a, b) {
        return a.ap(b);
    })
    .method('append', isOption, function(a, b) {
        return a.append(b, this.append);
    })

    .property('left', left)
    .property('right', right)
    .property('isEither', isEither)
    .method('flatMap', isEither, function(a, b) {
        return a.flatMap(b);
    })
    .method('map', isEither, function(a, b) {
        return a.map(b);
    })
    .method('ap', isEither, function(a, b) {
        return a.ap(b);
    })
    .method('append', isEither, function(a, b) {
        return a.append(b, this.append);
    });
