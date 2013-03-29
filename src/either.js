/**
   # Either

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
   ## left(x)

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
   ## right(x)

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
