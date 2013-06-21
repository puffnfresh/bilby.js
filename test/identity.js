var λ = require('./lib/test');

exports.identityTest = λ.checkTaggedArgs(
    λ.Identity,
    [λ.AnyVal],
    function (id, index) {
        return id.x;
    }
);
