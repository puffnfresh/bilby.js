var λ = require('./lib/test');

exports.streamTest = function(test) {
    var s = λ.Stream.sequential([1, 2, 3, 4]).foreach(function(a) {
        console.log(a);
    });

    test.ok(true);
    test.done();
};
