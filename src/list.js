/**
    # List

    * concat(a) - TODO
    * fold(a, b) - applies `a` to value if `cons` or defaults to `b`
    * map(f) - functor map
**/
var List = taggedSum({
    cons: ['car', 'cdr'],
    nil: []
});

List.range = function(a, b) {
    var total = b - a;
    var rec = function(x, y) {
        if (y - a >= total) return x;
        return rec(List.cons.of(y, x), ++y);
    };
    return rec(List.nil, a);
};

List.prototype.concat = function(s) {
    return this.appendAll(s);
};

List.prototype.fold = function(f) {
    if (this.isEmpty) return this;

    var rec = function(a, b) {
        if (a.isEmpty) return b;

        return rec(a.cdr, f(a.car, b));
    };
    return rec(this, List.nil);
};

List.prototype.map = function(f) {
    return this.fold(
        function(a, b) {
            return List.cons.of(f(a), b);
        }
    );
};

List.prototype.flatMap = function(f) {
    return this.fold(
      function(a, b) {
          return b.prependAll(f(a));
      }
    ).reverse();
};

List.prototype.append = function(a) {
    return this.appendAll(List.cons.of(a, List.nil.of()));
};

List.prototype.appendAll = function(a) {
    if (this.isEmpty) return this;

    var rec = function(a, b) {
        if (a.isEmpty) return b;

        return rec(a.cdr, List.cons.of(a.car, b));
    };
    return rec(this.reverse(), a);
};

List.prototype.prepend = function(a) {
    return List.cons.of(a, this);
};

List.prototype.prependAll = function(a) {
    if (a.isEmpty) return this;

    var rec = function(a, b) {
        if (b.isEmpty) return a;

        return rec(List.cons.of(b.car, a), b.cdr);
    };
    return rec(this, a);
};

List.prototype.reverse = function() {
    var rec = function(p, accum) {
        return p.cata({
            cons: function(a, b) {
                return rec(b, List.cons.of(a, accum));
            },
            nil: function() {
                return accum;
            }
        });
    };
    return rec(this, List.nil);
};

List.prototype.exists = function(f) {
    if (this.isEmpty) return false;

    var rec = function(a) {
        if (a.isEmpty) return false;
        if (f(a.car)) return true;

        return rec(a.cdr);
    };
    return rec(this);
};

List.prototype.filter = function(f) {
    if (this.isEmpty) return this;

    var rec = function(a, b) {
        if (a.isEmpty) return b;

        var cur = curry(rec)(a.cdr);
        if (f(a.car)) return cur(List.cons.of(a.car, b));

        return cur(b);
    };
    return rec(this, List.nil).reverse();
};

List.prototype.foreach = function(f) {
    return this.fold(
        function(a, b) {
            f(a);
            return this;
        },
        function() {
            return this;
        }
    );
};

List.prototype.partition = function(f) {
    if (this.isEmpty) return Tuple2(this, this);

    var rec = function(a, l, r) {
        if (a.isEmpty) return Tuple2(l.reverse(), r.reverse());

        var h = a.car;
        var cur = curry(List.cons.of)(h);

        if (f(h)) return rec(a.cdr, cur(l), r);
        else return rec(a.cdr, l, cur(r));
    };
    return rec(this, List.nil, List.nil);
};

List.prototype.size = function() {
    if (this.isEmpty) return 0;

    var rec = function(a) {
        if (a.isEmpty) return 0;

        return 1 + rec(a.cdr);
    };
    return rec(this);
};

List.prototype.toArray = function() {
    if (this.isEmpty) return [];

    var rec = function(a, b) {
        if (a.isEmpty) return a;

        b.push(a.car);
        return rec(a.cdr, b);
    };
    return rec(this, []);
};

List.prototype.toString = function() {
    return 'List(' + this.toArray().join(', ') + ', nil)';
};

/**
   ## cons(a, b)

   Constructor to represent the existence of a value in a list, `a`
   and a reference to another `b`.
**/
List.cons.prototype.isEmpty = false;
List.cons.prototype.isNonEmpty = true;

/**
   ## of(x)

   Constructor `of` Monad creating `List.some` with value of `a` and `b`.
**/
List.cons.of = function(a, b) {
    return List.cons(a, b);
};

/**
   ## nil

   Represents an empty list (absence of a list).
**/
List.nil.isEmpty = true;
List.nil.isNonEmpty = false;

/**
   ## of(x)

   Constructor `of` Monad creating `List.nil`.
**/
List.nil.of = function() {
    return List.nil;
};

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
