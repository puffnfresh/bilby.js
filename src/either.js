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
    var self = getInstance(this, left);
    self.fold = function(a, b) {
        return a(x);
    };
    self.swap = function() {
        return right(x);
    };
    self.isLeft = true;
    self.isRight = false;
    self.toOption = function() {
        return none;
    };
    self.toArray = function() {
        return [];
    };

    self.flatMap = function() {
        return self;
    };
    self.map = function() {
        return self;
    };
    self.ap = function(e) {
        return self;
    };
    self.append = function(l, plus) {
        var t = this;
        return l.fold(function(y) {
            return left(plus(x, y));
        }, function() {
            return t;
        });
    };
    return self;
}

/**
   ## right(x)

   Constructor to represent the (biased) right case.
**/
function right(x) {
    var self = getInstance(this, right);
    self.fold = function(a, b) {
        return b(x);
    };
    self.swap = function() {
        return left(x);
    };
    self.isLeft = false;
    self.isRight = true;
    self.toOption = function() {
        return some(x);
    };
    self.toArray = function() {
        return [x];
    };

    self.flatMap = function(f) {
        return f(x);
    };
    self.map = function(f) {
        return right(f(x));
    };
    self.ap = function(e) {
        return e.map(x);
    };
    self.append = function(r, plus) {
        return r.fold(function(x) {
            return left(x);
        }, function(y) {
            return right(plus(x, y));
        });
    };
    return self;
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
