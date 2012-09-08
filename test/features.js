require('../bilby').bilbify(global);

var add = curry(function(a, b) {
    return a + b;
});

exports.curryTest = function(test) {
    // Curried and uncurried application
    test.equal( add(1)(2) , 3);
    test.equal( add(1, 2) , 3);

    test.done();
};

exports.optionTest = function(test) {
    test.equal( some(3).getOrElse(0) , 3);
    test.equal( none.getOrElse(0) , 0);

    test.done();
};

exports.monadTest = function(test) {
    test.equal(
        Do()(some(1) >= function(x) {
            return x < 0 ? none : some(x + 2);
        }).getOrElse(0),

        3
    );

    test.done();
};

exports.kleisliTest = function(test) {
    test.equal(
        Do()(function(x) {
            return x < 0 ? none : some(x + 1);
        } >> function(x) {
            return x % 2 !== 0 ? none : some(x + 1);
        })(1).getOrElse(0),

        3
    );

    test.done();
};

exports.functorTest = function(test) {
    test.equal( Do()(some(1) > add(2)).getOrElse(0) , 3);
    test.done();
};

exports.applicativeTest = function (test) {
    test.equal( Do()(some(add) * some(1) * some(2)).getOrElse(0) , 3);
    test.done();
};

exports.semigroupTest = function (test) {
    test.equal( Do()(some(1) + some(2)).getOrElse(0) , 3);
    test.done();
};