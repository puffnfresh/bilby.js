var λ = require('../bilby');

exports.emptyTest = function(test) {
    var env = λ.environment()
        .method('length', λ.isArray, function(a) {
            return a.length;
        })
        .method('length', λ.isString, function(s) {
            return s.length;
        })
        .property('empty', function(o) {
            return !this.length(o);
        });

    test.equal(env.empty([]), true);
    test.equal(env.empty([1, 2, 3]), false);

    test.equal(env.empty(''), true);
    test.equal(env.empty('abc'), false);

    test.done();
};

exports.propertyTest = function(test) {
    var env = λ.environment()
        .property('one', 1);

    test.equal(env.one, 1);

    test.done();
};

exports.appendTest = function(test) {
    var env = λ.environment()
        .method('length', λ.isArray, function(a) {
            return a.length;
        })
        .append(
            λ.environment()
                .method('length', λ.isString, function(s) {
                    return s.length;
                })
        );

    test.equal(env.length([1, 2, 3]), 3);
    test.equal(env.length('test'), 4);

    test.done();
};
