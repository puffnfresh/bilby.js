/**
   # Option

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
   ## some(x)

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
   ## none

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
    });
