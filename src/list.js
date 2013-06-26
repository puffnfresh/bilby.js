/**
    # List

    * fold(a, b) - applies `a` to value if `cons` or defaults to `b`
    * map(f) - functor map
**/
var List = taggedSum({
    cons: ['car', 'cdr'],
    nil: []
});

List.range = function(a, b) {
    var accum = List.nil,
        total = b - a,
        i;

    var diff = b - a;
    for (i = a; i < a + total; i++) {
        accum = List.cons.of(i, accum);
    }

    return accum;
};

List.prototype.fold = function(f, g) {
    var accum = List.nil;

    var p = this;
    while(p.isNonEmpty) {
        // Not sure is we should create list.cons here or in map
        accum = f(p.car, accum);
        p = p.cdr;
    }

    return accum;
};

List.prototype.map = function(f) {
    return this.fold(
        function(a, b) {
            return List.cons.of(f(a), b);
        },
        function() {
            return this;
        }
    );
};

List.prototype.flatMap = function(f) {
    return this.fold(
      function(a, b) {
          return b.prependAll(f(a));
      },
      function() {
          return this;
      }
    ).reverse();
};

List.prototype.append = function(a) {
    return this.appendAll(List.cons.of(a, List.nil.of()));
};

List.prototype.appendAll = function(a) {
    var accum = a;

    var p = this.reverse();
    while(p.isNonEmpty) {
        accum = List.cons.of(p.car, accum);
        p = p.cdr;
    }

    return accum;
};

List.prototype.prepend = function(a) {
    return List.cons.of(a, this);
};

List.prototype.prependAll = function(a) {
    var accum = this;
    while(a.isNonEmpty) {
        accum = List.cons.of(a.car, accum);
        a = a.cdr;
    }
    return accum;
};

List.prototype.reverse = function() {
    // Not sure this is the most optimized way of doing this.
    function recursive(p, accum) {
        return p.cata({
            cons: function(a, b) {
                return recursive(b, List.cons.of(a, accum));
            },
            nil: function() {
                return accum;
            }
        });
    }
    return recursive(this, List.nil);
};

List.prototype.exists = function(f) {
    var p = this;
    while(p.isNonEmpty) {
        if(f(p.car)) {
            return true;
        }
        p = p.cdr;
    }
    return false;
};

List.prototype.filter = function(f) {
    var accum = List.nil;

    var p = this;
    while(p.isNonEmpty) {
        if (f(p.car)) {
            accum = List.cons.of(p.car, accum);
        }
        p = p.cdr;
    }
    return accum.reverse();
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
    var left = List.nil;
    var right = List.nil;

    var p = this;
    while(p.isNonEmpty) {
        if (f(p.car)) {
            left = List.cons.of(p.car, left);
        } else {
            right = List.cons.of(p.car, right);
        }
        p = p.cdr;
    }
    return Tuple2(left.reverse(), right.reverse());
};

List.prototype.size = function() {
    // We can do this because items are immutable.
    // Also this will coerce undefined to a number.
    if (this._size >= 0) {
        return this._size;
    }

    var s = 0;
    var p = this;
    while(p.isNonEmpty) {
        s++;
        p = p.cdr;
    }

    this._size = s;
    return s;
};

List.prototype.toArray = function() {
    var accum = [];
    var p = this;
    while(p.isNonEmpty) {
        accum.push(p.car);
        p = p.cdr;
    }
    return accum;
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
    .property('range', List.range)
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
