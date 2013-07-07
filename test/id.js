var λ = require('./lib/test');

exports.idTest = λ.checkTaggedArgs(
    λ.Id,
    [λ.AnyVal],
    function (id, index) {
        return id.value;
    }
);

exports.idConcatTest = λ.checkTaggedConcat(
    λ.Id,
    [String],
    function (a, b) {
        return λ.concat(a, b);
    },
    function (id, index) {
        return id.value;
    }
);

exports.idEmptyTest = function(test) {
    test.deepEqual(
        λ.empty(λ.idOf(Number)),
        λ.empty(λ.idOf(Number))
    );
    test.done();
};

exports.idMapTest = λ.check(
    function(a) {
        return λ.equal(λ.Id(a).map(λ.identity).value, a);
    },
    [λ.AnyVal]
);

exports.idChainTest = λ.check(
    function(a) {
        return λ.equal(λ.Id(a).chain(λ.identity), a);
    },
    [λ.AnyVal]
);
