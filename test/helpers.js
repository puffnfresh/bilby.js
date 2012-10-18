var λ = require('../bilby');

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
