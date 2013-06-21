/**
    # Tuples

    Tuples are another way of storing multiple values in a single value.
    They have a fixed number of elements (immutable), and so you can't
    cons to a tuple.
    Elements of a tuple do not need to be all of the same type

    Example usage:

         bilby.Tuple2(1, 2);
         bilby.Tuple3(1, 2, 3);
         bilby.Tuple4(1, 2, 3, 4);
         bilby.Tuple5(1, 2, 3, 4, 5);

    * arb() - TODO
    * fold() - TODO
    * map() - TODO
    * equal() - TODO

**/
var Tuple2 = tagged('Tuple2', ['_1', '_2']),
    Tuple3 = tagged('Tuple3', ['_1', '_2', '_3']),
    Tuple4 = tagged('Tuple4', ['_1', '_2', '_3', '_4']),
    Tuple5 = tagged('Tuple5', ['_1', '_2', '_3', '_4', '_5']);

/**
    ## Tuple2

    * flip() - TODO
    * concat() - Semigroup (value must also be a Semigroup)
**/
Tuple2.prototype.flip = function() {
    return Tuple2.of(this._2, this._1);
};

Tuple2.prototype.concat = function(b) {
    return Tuple2.of(
        bilby.concat(this._1, b._1),
        bilby.concat(this._2, b._2)
    );
};

/**
   ## of(x)

   Constructor `of` Monad creating `Tuple2`.
**/
Tuple2.of = function(a, b) {
    return Tuple2(a, b);
};

/**
    ## Tuple3

    * concat() - Semigroup (value must also be a Semigroup)
**/
Tuple3.prototype.concat = function(b) {
    return Tuple3.of(
        bilby.concat(this._1, b._1),
        bilby.concat(this._2, b._2),
        bilby.concat(this._3, b._3)
    );
};


/**
   ## of(x)

   Constructor `of` Monad creating `Tuple3`.
**/
Tuple3.of = function(a, b, c) {
    return Tuple3(a, b, c);
};

/**
    ## Tuple4

    * concat() - Semigroup (value must also be a Semigroup)
**/
Tuple4.prototype.concat = function(b) {
    return Tuple4.of(
        bilby.concat(this._1, b._1),
        bilby.concat(this._2, b._2),
        bilby.concat(this._3, b._3),
        bilby.concat(this._4, b._4)
    );
};


/**
   ## of(x)

   Constructor `of` Monad creating `Tuple4`.
**/
Tuple4.of = function(a, b, c, d) {
    return Tuple4(a, b, c, d);
};

/**
    ## Tuple5

    * concat() - Semigroup (value must also be a Semigroup)
**/
Tuple5.prototype.concat = function(b) {
    return Tuple5.of(
        bilby.concat(this._1, b._1),
        bilby.concat(this._2, b._2),
        bilby.concat(this._3, b._3),
        bilby.concat(this._4, b._4),
        bilby.concat(this._5, b._5)
    );
};


/**
   ## of(x)

   Constructor `of` Monad creating `Tuple5`.
**/
Tuple5.of = function(a, b, c, d, e) {
    return Tuple5(a, b, c, d, e);
};

/**
   ## isTuple(a)

   Returns `true` if `a` is `Tuple`.
**/
var isTuple = curry(function(o) {
    // TODO (Simon) : Could use lift.
    return isTuple2(o) || isTuple3(o) || isTuple4(o) || isTuple5(o);
});

/**
   ## isTuple2(a)

   Returns `true` if `a` is `Tuple2`.
**/
var isTuple2 = isInstanceOf(Tuple2);

/**
   ## isTuple4(a)

   Returns `true` if `a` is `Tuple3`.
**/
var isTuple3 = isInstanceOf(Tuple3);

/**
   ## isTuple4(a)

   Returns `true` if `a` is `Tuple4`.
**/
var isTuple4 = isInstanceOf(Tuple4);

/**
   ## isTuple5(a)

   Returns `true` if `a` is `Tuple5`.
**/
var isTuple5 = isInstanceOf(Tuple5);

bilby = bilby
    .property('Tuple2', Tuple2)
    .property('Tuple3', Tuple3)
    .property('Tuple4', Tuple4)
    .property('Tuple5', Tuple5)
    .property('isTuple', isTuple)
    .property('isTuple2', isTuple2)
    .property('isTuple3', isTuple3)
    .property('isTuple4', isTuple4)
    .property('isTuple5', isTuple5)
    .method('arb', strictEquals(Tuple2), function() {
        var env = this;
        var t = env.fill(2)(function() {
            return String;
        });
        return Tuple2.of.apply(this, env.map(t, function(arg) {
            return env.arb(arg, t.length);
        }));
    })
    .method('arb', strictEquals(Tuple3), function() {
        var env = this;
        var t = env.fill(3)(function() {
            return String;
        });
        return Tuple3.of.apply(this, env.map(t, function(arg) {
            return env.arb(arg, t.length);
        }));
    })
    .method('arb', strictEquals(Tuple4), function() {
        var env = this;
        var t = env.fill(4)(function() {
            return String;
        });
        return Tuple4.of.apply(this, env.map(t, function(arg) {
            return env.arb(arg, t.length);
        }));
    })
    .method('arb', strictEquals(Tuple5), function() {
        var env = this;
        var t = env.fill(5)(function() {
            return String;
        });
        return Tuple5.of.apply(this, env.map(t, function(arg) {
            return env.arb(arg, t.length);
        }));
    })
    .method('equal', isTuple, function(a, b) {
        var env = this;
        return env.fold(env.zip(env.toArray(a), env.toArray(b)), true, function(a, t) {
            return a && env.equal(t[0], t[1]);
        });
    })
    .method('toArray', isTuple, function(a) {
        var accum = [],
            total = functionLength(a.constructor),
            i;

        for(i = 0; i < total; i++) {
            accum[i] = a['_' + (i + 1)];
        }

        return accum;
    })
    .method('fold', isTuple, function(a, b, c) {
        var i;
        for(i = 0; i < a.length; i++) {
            b = c(b, a[i]);
        }
        return b;
    })
    .method('map', isTuple, function(a, b) {
        var accum = [],
            total = functionLength(a.constructor),
            i;

        for(i = 0; i < total; i++) {
            accum[i] = b(a['_' + (i + 1)]);
        }

        var ctr = a.of || a.constructor.of;
        return ctr.apply(this, accum);
    })
    .method('concat', isTuple, function(a, b) {
        return a.concat(b, this.concat);
    });

