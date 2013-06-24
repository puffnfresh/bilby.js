var λ = require('./lib/test');

exports.listTest = λ.check(
    function(a) {
        return λ.cons(a, λ.nil).car === a;
    },
    [λ.AnyVal]
);

exports.listMapTest = λ.check(
    function(a) {
        return λ.cons(a, λ.nil).map(λ.identity).car === a;
    },
    [λ.AnyVal]
);

exports.listFlatMapTest = λ.check(
    function(a) {
        return λ.equal(λ.cons(2, λ.cons(1, λ.nil)).flatMap(function(a) {
            return λ.cons(3, λ.cons(a, λ.nil));
        }), λ.cons(3, λ.cons(2, λ.cons(3, λ.cons(1, λ.nil)))));
    },
    [λ.AnyVal]
);

exports.listFilterTest = function(test) {
    var actual = λ.cons(4, λ.cons(3, λ.cons(2, λ.cons(1, λ.nil))));
    var expected = λ.cons(4, λ.cons(2, λ.nil));

    test.ok(λ.equal(actual.filter(λ.isEven), expected));
    test.done();
};

exports.listForeachTest = λ.check(
    function(a, b, c) {
        var accum = 0;
        λ.cons(a, λ.cons(b, λ.cons(c, λ.nil))).foreach(function(a) {
            accum += a;
        });
        return accum === (a + b + c);
    },
    [Number, Number, Number]
);

exports.listPartitionTest = function(test) {
    var actual = λ.cons(4, λ.cons(3, λ.cons(2, λ.cons(1, λ.nil))));
    var expected = λ.Tuple2(λ.cons(4, λ.cons(2, λ.nil)), λ.cons(3, λ.cons(1, λ.nil)));

    test.ok(λ.equal(actual.partition(λ.isEven), expected));
    test.done();
};
