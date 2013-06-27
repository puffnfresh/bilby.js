var λ = require('./lib/test');

exports.streamForeachTest = function(test) {
    var result = [];
    var s = λ.Stream.sequential([1, 2, 3, 4]).foreach(function(a) {
        result.push(a);
    });

    setTimeout(function() {
        test.deepEqual(result, [1, 2, 3, 4]);
        test.done();
    }, 50);
};

exports.streamFilterTest = function(test) {
    var a = λ.Stream.sequential([1, 2, 3, 4]).filter(λ.isEven).toArray();

    setTimeout(function() {
        test.deepEqual(a, [2, 4]);
        test.done();
    }, 50);
};

exports.streamMapTest = function(test) {
    var a = λ.Stream.sequential([1, 2, 3, 4]).map(function(a) {
        return a * 2;
    }).toArray();

    setTimeout(function() {
        test.deepEqual(a, [2, 4, 6, 8]);
        test.done();
    }, 50);
};

exports.streamZipTest = function(test) {
    var a = λ.Stream.sequential([1, 3, 5, 7]);
    var b = λ.Stream.sequential([2, 4, 6, 8]);
    var c = a.zip(b).toArray();

    setTimeout(function() {
        test.deepEqual(c, [[1, 2], [3, 4], [5, 6], [7, 8]]);
        test.done();
    }, 50);
};

