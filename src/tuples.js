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

    * arb() - arbitrary value

**/
var Tuple2 = tagged('Tuple2', ['_1', '_2']),
    Tuple3 = tagged('Tuple3', ['_1', '_2', '_3']),
    Tuple4 = tagged('Tuple4', ['_1', '_2', '_3', '_4']),
    Tuple5 = tagged('Tuple5', ['_1', '_2', '_3', '_4', '_5']);

/**
    ## Tuple2

    * flip() - flip values
    * concat() - Semigroup (value must also be a Semigroup)
    * map() - functor map
**/
Tuple2.prototype.flip = function() {
    return Tuple2(this._2, this._1);
};

Tuple2.prototype.concat = function(b) {
    return Tuple2(
        bilby.concat(this._1, b._1),
        bilby.concat(this._2, b._2)
    );
};

Tuple2.prototype.map = function(f) {
    return Tuple2(f(this._1), f(this._2));
};

/**
    ## Tuple3

    * concat() - Semigroup (value must also be a Semigroup)
    * map() - functor map
**/
Tuple3.prototype.concat = function(b) {
    return Tuple3(
        bilby.concat(this._1, b._1),
        bilby.concat(this._2, b._2),
        bilby.concat(this._3, b._3)
    );
};

Tuple3.prototype.map = function(f) {
    return Tuple3(f(this._1), f(this._2), f(this._3));
};


/**
    ## Tuple4

    * concat() - Semigroup (value must also be a Semigroup)
    * map() - functor map
**/
Tuple4.prototype.concat = function(b) {
    return Tuple4(
        bilby.concat(this._1, b._1),
        bilby.concat(this._2, b._2),
        bilby.concat(this._3, b._3),
        bilby.concat(this._4, b._4)
    );
};

Tuple4.prototype.map = function(f) {
    return Tuple4(f(this._1), f(this._2), f(this._3), f(this._4));
};


/**
    ## Tuple5

    * concat() - Semigroup (value must also be a Semigroup)
    * map() - functor map
**/
Tuple5.prototype.concat = function(b) {
    return Tuple5(
        bilby.concat(this._1, b._1),
        bilby.concat(this._2, b._2),
        bilby.concat(this._3, b._3),
        bilby.concat(this._4, b._4),
        bilby.concat(this._5, b._5)
    );
};

Tuple5.prototype.map = function(f) {
    return Tuple5(f(this._1), f(this._2), f(this._3), f(this._4), f(this._5));
};

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
    .property('isTuple2', isTuple2)
    .property('isTuple3', isTuple3)
    .property('isTuple4', isTuple4)
    .property('isTuple5', isTuple5)
    .method('concat', isTuple2, function(a, b) {
        return a.concat(b, this.concat);
    })
    .method('concat', isTuple3, function(a, b) {
        return a.concat(b, this.concat);
    })
    .method('concat', isTuple4, function(a, b) {
        return a.concat(b, this.concat);
    })
    .method('concat', isTuple5, function(a, b) {
        return a.concat(b, this.concat);
    })
    .method('map', isTuple2, function(a, b) {
        return a.map(b);
    })
    .method('map', isTuple3, function(a, b) {
        return a.map(b);
    })
    .method('map', isTuple4, function(a, b) {
        return a.map(b);
    })
    .method('map', isTuple5, function(a, b) {
        return a.map(b);
    })
    .method('arb', strictEquals(Tuple2), function() {
        var env = this;
        var t = env.fill(2)(function() {
            return String;
        });
        return Tuple2.apply(this, env.map(t, function(arg) {
            return env.arb(arg, t.length);
        }));
    })
    .method('arb', strictEquals(Tuple3), function() {
        var env = this;
        var t = env.fill(3)(function() {
            return String;
        });
        return Tuple3.apply(this, env.map(t, function(arg) {
            return env.arb(arg, t.length);
        }));
    })
    .method('arb', strictEquals(Tuple4), function() {
        var env = this;
        var t = env.fill(4)(function() {
            return String;
        });
        return Tuple4.apply(this, env.map(t, function(arg) {
            return env.arb(arg, t.length);
        }));
    })
    .method('arb', strictEquals(Tuple5), function() {
        var env = this;
        var t = env.fill(5)(function() {
            return String;
        });
        return Tuple5.apply(this, env.map(t, function(arg) {
            return env.arb(arg, t.length);
        }));
    })
    .method('equal', isTuple2, function(a, b) {
        return  this.equal(a._1, b._1) &&
                this.equal(a._2, b._2);
    })
    .method('equal', isTuple3, function(a, b) {
        return  this.equal(a._1, b._1) &&
                this.equal(a._2, b._2) &&
                this.equal(a._3, b._3);
    })
    .method('equal', isTuple4, function(a, b) {
        return  this.equal(a._1, b._1) &&
                this.equal(a._2, b._2) &&
                this.equal(a._3, b._3) &&
                this.equal(a._4, b._4);
    })
    .method('equal', isTuple5, function(a, b) {
        return  this.equal(a._1, b._1) &&
                this.equal(a._2, b._2) &&
                this.equal(a._3, b._3) &&
                this.equal(a._4, b._4) &&
                this.equal(a._5, b._5);
    })
    .method('toArray', isTuple2, function(a) {
        return [a._1, a._2];
    })
    .method('toArray', isTuple3, function(a) {
        return [a._1, a._2, a._3];
    })
    .method('toArray', isTuple4, function(a) {
        return [a._1, a._2, a._3, a._4];
    })
    .method('toArray', isTuple5, function(a) {
        return [a._1, a._2, a._3, a._4, a._5];
    });
