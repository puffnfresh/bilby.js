var λ = require('./lib/test');

exports.listTest = λ.check(
    function(a) {
        return λ.cons(a, λ.nil).car === a;
    },
    [λ.AnyVal]
);

exports.listMapTest = λ.check(
    function(a) {
        return λ.cons(a, λ.nil).map(λ.identity).car === a;
    },
    [λ.AnyVal]
);

exports.listFlatMapTest = λ.check(
    function(a) {
        return λ.equal(λ.cons(2, λ.cons(1, λ.nil)).flatMap(function(a) {
            return λ.cons(3, λ.cons(a, λ.nil));
        }), λ.cons(3, λ.cons(2, λ.cons(3, λ.cons(1, λ.nil)))));
    },
    [λ.AnyVal]
);
