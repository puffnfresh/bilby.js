/**
    # List

        List a = Cons a + Nil

    The list type data type constructs objects which points to values. The `cons`
    constructor represents a value, the left is the head (`car`, the first element)
    and the right represents the tail (`cdr`, the second element). The `nil`
    constructor is defined as an empty list.

    The following example creates a list of values 1 and 2, where the nil terminates
    the list:

        cons(1, cons(2, nil));

    The following can also represent tree like structures (Binary Trees):

        cons(cons(1, cons(2, nil)), cons(3, cons(4, nil)));

             *
            / \
           *   *
          / \ / \
         1  2 3  4

    * concat(a) - semigroup concat
    * fold(a, b) - applies `a` to value if `cons` or defaults to `b`
    * map(f) - functor map
    * fold(f) - applies f to values
    * flatMap(f) - monadic flatMap
    * append(a) - append
    * appendAll(a) - append values
    * prepend(a) - prepend value
    * prependAll(a) - prepend values
    * reverse() - reverse
    * exists() - test by predicate
    * filter() - filter by predicate
    * partition() - partition by predicate
    * size() - size of the list
**/
var List = taggedSum({
    cons: ['car', 'cdr'],
    nil: []
});

List.range = curry(function(a, b) {
    var total = b - a;
    var rec = function(x, y) {
        if (y - a >= total) return done(x);
        return cont(function() {
            return rec(List.cons(y, x), ++y);
        });
    };
    return trampoline(rec(List.nil, a));
});

List.prototype.concat = function(s) {
    return this.appendAll(s);
};

List.prototype.fold = function(f) {
    if (this.isEmpty) return this;

    var rec = function(a, b) {
        if (a.isEmpty) return done(b);

        return cont(function() {
            return rec(a.cdr, f(a.car, b));
        });
    };
    return trampoline(rec(this.reverse(), List.nil));
};

List.prototype.map = function(f) {
    return this.fold(
        function(a, b) {
            return List.cons(f(a), b);
        }
    );
};

List.prototype.flatMap = function(f) {
    return this.fold(
      function(a, b) {
          return b.prependAll(f(a).reverse());
      }
    );
};

List.prototype.append = function(a) {
    return this.appendAll(List.cons(a, List.nil));
};

List.prototype.appendAll = function(a) {
    if (this.isEmpty) return this;

    var rec = function(a, b) {
        if (a.isEmpty) return done(b);

        return cont(function() {
            return rec(a.cdr, List.cons(a.car, b));
        });
    };
    return trampoline(rec(this.reverse(), a));
};

List.prototype.prepend = function(a) {
    return List.cons(a, this);
};

List.prototype.prependAll = function(a) {
    if (a.isEmpty) return this;

    var rec = function(a, b) {
        if (b.isEmpty) return done(a);

        return cont(function() {
            return rec(List.cons(b.car, a), b.cdr);
        });
    };
    return trampoline(rec(this, a));
};

List.prototype.reverse = function() {
    var rec = function(p, accum) {
        return p.cata({
            cons: function(a, b) {
                return cont(function() {
                    return rec(p.cdr, List.cons(a, accum));
                });
            },
            nil: function() {
                return done(accum);
            }
        });
    };
    return trampoline(rec(this, List.nil));
};

List.prototype.exists = function(f) {
    if (this.isEmpty) return false;

    var rec = function(a) {
        if (a.isEmpty) return done(false);
        if (f(a.car)) return done(true);

        return cont(function() {
            return rec(a.cdr);
        });
    };
    return trampoline(rec(this));
};

List.prototype.filter = function(f) {
    if (this.isEmpty) return this;

    var rec = function(a, b) {
        if (a.isEmpty) return done(b);

        return cont(function() {
            var c = curry(rec)(a.cdr);
            if (f(a.car)) {
                return c(List.cons(a.car, b));
            } else {
                return c(b);
            }
        });
    };
    return trampoline(rec(this, List.nil)).reverse();
};

List.prototype.partition = function(f) {
    if (this.isEmpty) return Tuple2(this, this);

    var rec = function(a, l, r) {
        if (a.isEmpty) return done(Tuple2(l.reverse(), r.reverse()));

        return cont(function() {
            var h = a.car;
            var cur = curry(List.cons)(h);
            if (f(h)) {
                return rec(a.cdr, cur(l), r);
            } else {
                return rec(a.cdr, l, cur(r));
            }
        });
    };
    return trampoline(rec(this, List.nil, List.nil));
};

List.prototype.size = function() {
    if (this.isEmpty) return 0;

    var rec = function(a, b) {
        if (a.isEmpty) return done(b);

        return cont(function() {
            return rec(a.cdr, ++b);
        });
    };
    return trampoline(rec(this, 0));
};

List.prototype.toArray = function() {
    if (this.isEmpty) return [];

    var rec = function(a, b) {
        if (a.isEmpty) return done(b);

        b.push(a.car);
        return cont(function() {
            return rec(a.cdr, b);
        });
    };
    return trampoline(rec(this, []));
};

List.prototype.toString = function() {
    return 'List(' + this.toArray().join(', ') + ')';
};

/**
   ## cons(a, b)

   Constructor to represent the existence of a value in a list, `a`
   and a reference to another `b`.
**/
List.cons.prototype.isEmpty = false;
List.cons.prototype.isNonEmpty = true;

/**
   ## nil

   Represents an empty list (absence of a list).
**/
List.nil.isEmpty = true;
List.nil.isNonEmpty = false;

/**
   ## isList(a)

   Returns `true` if `a` is a `cons` or `nil`.
**/
var isList = isInstanceOf(List);

bilby = bilby
    .property('cons', List.cons)
    .property('nil', List.nil)
    .property('isList', isList)
    .property('listRange', List.range)
    .method('concat', isList, function(a, b) {
        return a.concat(b);
    })
    .method('fold', isList, function(a, f, g) {
        return a.fold(f, g);
    })
    .method('map', isList, function(a, b) {
        return a.map(b);
    })
    .method('flatMap', isList, function(a, b) {
        return a.flatMap(b);
    })
    .method('equal', isList, function(a, b) {
        var env = this;
        return env.fold(env.zip(a, b), true, function(a, t) {
            return a && env.equal(t[0], t[1]);
        });
    })
    .method('zip', isList, function(a, b) {
        return zip(this.toArray(a), this.toArray(b));
    })
    .method('toArray', isList, function(a) {
        return a.toArray();
    });
