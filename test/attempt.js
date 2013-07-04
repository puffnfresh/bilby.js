var λ = require('./lib/test');

// Example adapted from "Applicative Programming, Disjoint Unions,
// Semigroups and Non-breaking Error Handling" (Tony Morris 2010)
exports.personExample = function(test) {
    function validAge(age) {
        var parsed = parseInt(age, 10);
        return isNaN(parsed) ? 
            λ.failure(["Age is not a number"]) :
            parsed <= 0 ? 
            λ.failure(["Age must be greater than 0"]) :
            parsed > 130 ?
            λ.failure(["Age must be less than 130"]) :
            λ.success(parsed);
    }

    function validName(name) {
        return name && name.match(/^[A-Z]/) ?
            λ.success(name) :
            λ.failure(["Name must begin with a capital letter"]);
    }

    function validPostcode(postcode) {
        return postcode.match(/^[0-9]{4}$/) ?
            λ.success(postcode) :
            λ.failure(["Postcode must be 4 digits"]);
    }

    var Person = λ.tagged('Person', ['age', 'name', 'postcode']),
        f = λ.curry(Person),
        age = validAge(22),
        name = validName("Brian"),
        postcode = validPostcode("4017");

    function validate(a, n, p) {
        var age = validAge(a),
            name = validName(n),
            postcode = validPostcode(p);
        return λ.ap(λ.ap(λ.map(age, f), name), postcode);
    }

    validate("22", "Brian", "4017").cata({
        success: function(value) {
            test.equal(value.age, 22);
            test.equal(value.name, "Brian");
            test.equal(value.postcode, "4017");
        },
        failure: function(errors) {
            test.fail();
        }
    });

    validate("-7", "red", "490000").cata({
        success: function(value) {
            test.fail();
        },
        failure: function(errors) {
            test.deepEqual(errors, [
                'Age must be greater than 0',
                'Name must begin with a capital letter',
                'Postcode must be 4 digits'
            ]);
        }
    });

    validate("boo", "Fred", "490000").cata({
        success: function(value) {
            test.fail();
        },
        failure: function(errors) {
            test.deepEqual(errors, [
                'Age is not a number',
                'Postcode must be 4 digits'
            ]);
        }
    });

    validate("30", "", "411x").cata({
        success: function(value) {
            test.fail();
        },
        failure: function(errors) {
            test.deepEqual(errors, [
                'Name must begin with a capital letter',
                'Postcode must be 4 digits'
            ]);
        }
    });

    test.done();
};

exports.successTest = λ.check(
    function(a) {
        return λ.success(a).value == a;
    },
    [λ.AnyVal]
);

exports.failureTest = λ.check(
    function(a) {
        return λ.equal(λ.failure(a).errors, a);
    },
    [λ.arrayOf(λ.AnyVal)]
);

exports.apSuccessSuccessTest = λ.check(
    function(a, b) {
        return λ.ap(
            λ.success(λ.constant(a)),
            λ.success(b)
        ).value == a;
    },
    [λ.AnyVal, λ.AnyVal]
);

exports.apSuccessFailureTest = λ.check(
    function(a, b) {
        var errors = λ.ap(
            λ.success(λ.constant(a)),
            λ.failure(b)
        ).errors;
        return λ.equal(errors, b);
    },
    [λ.AnyVal, λ.arrayOf(λ.AnyVal)]
);

exports.apFailureSuccessTest = λ.check(
    function(a, b) {
        var errors = λ.ap(
            λ.failure(a),
            λ.success(b)
        ).errors;
        return λ.equal(a, errors);
    },
    [λ.arrayOf(λ.AnyVal), λ.AnyVal]
);

exports.apFailureFailureTest = λ.check(
    function(a, b) {
        var errors = λ.ap(
            λ.failure(a),
            λ.failure(b)
        ).errors;
        return λ.equal(errors, a.concat(b));
    },
    [λ.arrayOf(λ.AnyVal), λ.arrayOf(λ.AnyVal)]
);
