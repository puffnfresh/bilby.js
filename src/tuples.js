/**
    # Tuples

*/
var Tuple2 = tagged('Tuple2', ['_1', '_2']),
    Tuple3 = tagged('Tuple3', ['_1', '_2', '_3']),
    Tuple4 = tagged('Tuple4', ['_1', '_2', '_3', '_4']),
    Tuple5 = tagged('Tuple5', ['_1', '_2', '_3', '_4', '_5']);

Tuple2.prototype.flip = function() {
    return Tuple2(this._2, this._1);
};

Tuple2.prototype.append = function(b) {
    return Tuple2(
        bilby.append(this._1, b._1),
        bilby.append(this._2, b._2)
    );
};

Tuple3.prototype.append = function(b) {
    return Tuple3(
        bilby.append(this._1, b._1),
        bilby.append(this._2, b._2),
        bilby.append(this._3, b._3)
    );
};

Tuple4.prototype.append = function(b) {
    return Tuple4(
        bilby.append(this._1, b._1),
        bilby.append(this._2, b._2),
        bilby.append(this._3, b._3),
        bilby.append(this._4, b._4)
    );
};

Tuple5.prototype.append = function(b) {
    return Tuple5(
        bilby.append(this._1, b._1),
        bilby.append(this._2, b._2),
        bilby.append(this._3, b._3),
        bilby.append(this._4, b._4),
        bilby.append(this._5, b._5)
    );
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
    .method('append', isTuple2, function (a, b) {
        return a.append(b, this.append);
    })
    .method('append', isTuple3, function (a, b) {
        return a.append(b, this.append);
    })
    .method('append', isTuple4, function (a, b) {
        return a.append(b, this.append);
    })
    .method('append', isTuple5, function (a, b) {
        return a.append(b, this.append);
    });

