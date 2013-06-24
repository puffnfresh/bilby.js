var λ = require('./lib/test');

exports.streamTest = function(test) {
    λ.Stream.sequential([1, 2, 3, 4]);
    test.ok(true);
    test.done();
};
