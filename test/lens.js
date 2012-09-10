var λ = require('../bilby');
    addressLens = λ.objectLens('address'),
    streetLens = λ.objectLens('street'),
    stateLens = λ.objectLens('state'),
    person = {
        name: "Jemantha",
        address: {
            number: "13",
            street: "Blacksheep Pde",
            state: "TAS"
        }
    };

exports.composedGetterTest = function(test) {
    test.equal(
        streetLens.compose(addressLens).run(person).getter,
        "Blacksheep Pde"
    );
    test.equal(
        stateLens.compose(addressLens).run(person).getter,
        "TAS"
    );

    test.done();
};

exports.composedSetterTest = function(test) {
    var newPerson = stateLens.compose(addressLens).run(person).setter("QLD");
    test.notEqual(person.address.state, newPerson.address.state);
    test.equal(newPerson.address.state, "QLD");
    test.done();
};
