var λ = require('../bilby');

exports.arrayFoldTest = function(test) {
    test.equal(
        λ.fold([1, 2, 3], 0, function(a, b) {
            return a + b;
        }),
        6
    );
    test.done();
};

exports.arrayEqualTest = function(test) {
    test.equal(
        λ.equal([1, 2, 3], [4, 5, 6]),
        false
    );
    test.equal(
        λ.equal([1, 2, 3], [1, 2, 3]),
        true
    );
    test.done();
};
