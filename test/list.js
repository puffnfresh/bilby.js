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

exports.listFlatMapTest = function(test) {
    var actual = λ.cons(2, λ.cons(1, λ.nil)),
        expected = λ.cons(3, λ.cons(2, λ.cons(3, λ.cons(1, λ.nil))));

    test.ok(λ.equal(actual.flatMap(function(a) {
        return λ.cons(3, λ.cons(a, λ.nil));
    }), expected));
    test.done();
};

exports.listFilterTest = function(test) {
    var actual = λ.cons(4, λ.cons(3, λ.cons(2, λ.cons(1, λ.nil)))),
        expected = λ.cons(4, λ.cons(2, λ.nil));

    test.ok(λ.equal(actual.filter(λ.isEven), expected));
    test.done();
};

exports.listPrependTest = λ.check(
    function(a) {
        return λ.equal(λ.nil.prepend(a), λ.cons(a, λ.nil));
    },
    [λ.AnyVal]
);

exports.listPrependAllTest = λ.check(
    function(a, b) {
        return λ.equal(λ.nil.prependAll(λ.cons(a, λ.cons(b, λ.nil))), λ.cons(b, λ.cons(a, λ.nil)));
    },
    [λ.AnyVal, λ.AnyVal]
);

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
    var actual = λ.cons(4, λ.cons(3, λ.cons(2, λ.cons(1, λ.nil)))),
        expected = λ.Tuple2(λ.cons(4, λ.cons(2, λ.nil)), λ.cons(3, λ.cons(1, λ.nil)));

    test.ok(λ.equal(actual.partition(λ.isEven), expected));
    test.done();
};

exports.listSizeTest = function(test) {
    var a = λ.randomRange(0, 50) | 0,
        b = λ.randomRange(51, 100) | 0,
        actual = λ.range(a, b);

    test.equal(actual.size(), b - a);
    test.done();
};