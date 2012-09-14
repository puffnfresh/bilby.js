var λ = require('./lib/test');

exports.monadTest = function(test) {
    test.equal(
        λ.Do()(
            λ.some(1) >= function(x) {
                return x < 0 ? λ.none : λ.some(x + 2);
            }
        ).getOrElse(0),
        3
    );

    test.done();
};

exports.kleisliTest = function(test) {
    test.equal(
        λ.Do()(
            function(x) {
                return x < 0 ? λ.none : λ.some(x + 1);
            } >> function(x) {
                return x % 2 !== 0 ? λ.none : λ.some(x + 1);
            }
        )(1).getOrElse(0),
        3
    );

    test.done();
};

exports.functorTest = function(test) {
    test.equal(
        λ.Do()(
            λ.some(1) < λ.add(2)
        ).getOrElse(0),
        3
    );
    test.done();
};

exports.applicativeTest = function (test) {
    test.equal(
        λ.Do()(
            λ.some(λ.add) * λ.some(1) * λ.some(2)
        ).getOrElse(0),
        3
    );
    test.done();
};

exports.semigroupTest = function (test) {
    test.equal(
        λ.Do()(
            λ.some(1) + λ.some(2)
        ).getOrElse(0),
        3
    );
    test.done();
};
