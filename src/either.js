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
   * concat(s, plus) - semigroup concat
**/

var Either = taggedSum({
    left: ['x'],
    right: ['x']
});

Either.prototype.fold = function(a, b) {
    return this.cata({
        left: a,
        right: b
    });
};
Either.prototype.swap = function() {
    return this.fold(
        function(x) {
            return Either.right.of(x);
        },
        function(x) {
            return Either.left.of(x);
        }
    );
};
Either.prototype.toOption = function() {
    return this.fold(
        function() {
            return Option.none.of();
        },
        function(x) {
            return Option.some.of(x);
        }
    );
};
Either.prototype.toArray = function() {
    return this.fold(
        function() {
            return [];
        },
        function(x) {
            return [x];
        }
    );
};
Either.prototype.flatMap = function(f) {
    return this.fold(
        function() {
            return this;
        },
        function(x) {
            return f(x);
        }
    );
};
Either.prototype.map = function(f) {
    return this.fold(
        function() {
            return this;
        },
        function(x) {
            return Either.right.of(f(x));
        }
    );
};
Either.prototype.ap = function(e) {
    return this.fold(
        function() {
            return this;
        },
        function(x) {
            return e.map(x);
        }
    );
};
Either.prototype.concat = function(s, plus) {
    return this.fold(
        function() {
            var left = this;
            return s.fold(
                constant(left),
                constant(s)
            );
        },
        function(y) {
            return s.map(function(x) {
                return plus(x, y);
            });
        }
    );
};

/**
   ## left(x)

   Constructor to represent the left case.
**/
Either.left.prototype.isLeft = true;
Either.left.prototype.isRight = false;

/**
   ## of(x)

   Constructor `of` Monad creating `Either.left`.
**/
Either.left.of = function(x) {
    return Either.left(x);
};

/**
   ## right(x)

   Constructor to represent the (biased) right case.
**/
Either.right.prototype.isLeft = false;
Either.right.prototype.isRight = true;

/**
   ## of(x)

   Constructor `of` Monad creating `Either.right`.
**/
Either.right.of = function(x) {
    return Either.right(x);
};

/**
   ## isEither(a)

   Returns `true` iff `a` is a `left` or a `right`.
**/
var isEither = isInstanceOf(Either);

bilby = bilby
    .property('left', Either.left)
    .property('right', Either.right)
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
    .method('concat', isEither, function(a, b) {
        return a.concat(b, this.concat);
    });
