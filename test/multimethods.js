require('../bilby').bilbify(global);

exports.emptyTest = function(test) {
    var env = environment()
        .method('length', isArray, function(a) {
            return a.length;
        })
        .method('length', isString, function(s) {
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
    var env = environment()
        .property('one', 1);

    test.equal(env.one, 1);

    test.done();
};
