var λ = require('./lib/test');

exports.curriedTest = function(test) {
    test.equal(λ.add(1)(2), 3);
    test.done();
};

exports.uncurriedTest = function(test) {
    test.equal(λ.add(1, 2), 3);
    test.done();
};

exports.sequenceTest = function(test) {
    test.deepEqual(
        λ.sequence(Array, [
            [1, 2],
            [3],
            [4, 5]
        ]),
        [
            [1, 3, 4],
            [1, 3, 5],
            [2, 3, 4],
            [2, 3, 5]
        ]
    );
    test.done();
};

exports.taggedTest = λ.check(
    function(a) {
        var Id = λ.tagged('Id', ['value']);
        return Id(a).value == a;
    },
    [λ.AnyVal]
);

exports.taggedSumTest = λ.check(
    function(a, b) {
        var Either = λ.taggedSum({
            Left: ['leftValue'],
            Right: ['rightValue']
        });

        return (function() {
            var gotLeft = Either.Left(a).cata({Left: λ.identity, Right: λ.error("Got right")}) == a,
                gotRight = Either.Right(b).cata({Right: λ.identity, Left: λ.error("Got left")}) == b;
            return gotLeft && gotRight;
        })();
    },
    [λ.AnyVal, λ.AnyVal]
);

exports.fillTest = function(test) {
    test.deepEqual(
        λ.fill(10)(λ.identity),
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    );
    test.done();
};

exports.notTest = function(test) {
    test.ok(!λ.not(true));
    test.done();
};
