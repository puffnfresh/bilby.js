var λ = require('../../dist/bilby');

// TODO (Simon) : Make this better!
function fill(nrOfItems) {
    var a = new Array(nrOfItems);
    var index = 0;
    while (index < nrOfItems) {
        a[index] = index++;
    }
    return a;
}

λ = λ
    .property('check', λ.curry(function(property, args, test) {
        var report = λ.forAll(property, args);

        test.ok(report.isNone, report.fold(
            function(fail) {
                return "Failed after " + fail.tries + " tries: " + fail.inputs.toString();
            },
            function() {
                return "OK";
            }
        ));

        test.done();
    }))
    .property('checkTaggedArgs', λ.curry(function(type, args, access, test) {
        // Go through and check all the tagged arguments.
        var length = λ.functionLength(type);
        fill(length).forEach(function (value, index) {
            function property() {
                return access(type.apply(this, arguments), index) === arguments[index];
            }
            property._length = length;

            var report = λ.forAll(property, args);
            test.ok(report.isNone, report.fold(
                function(fail) {
                    return "Failed after " + fail.tries + " tries: " + fail.inputs.toString();
                },
                function() {
                    return "OK";
                }
            ));
        });

        test.done();
    }))
    // Possibly rename this if it's useful with other things.
    .property('checkTaggedAppend', λ.curry(function(type, args, exec, access, test) {
        var length = λ.functionLength(type);
        fill(length).forEach(function (value, index) {
            function property() {
                var a = type.apply(this, arguments);

                // We need different arguments for b.
                var b = type.apply(this, λ.map(args, function(arg) {
                    return λ.arb(arg, length);
                }));
                return access(exec(a, b), index) === exec(access(a, index), access(b, index));
            }
            property._length = length;

            var report = λ.forAll(property, args);
            test.ok(report.isNone, report.fold(
                function(fail) {
                    return "Failed after " + fail.tries + " tries: " + fail.inputs.toString();
                },
                function() {
                    return "OK";
                }
            ));
        });

        test.done();
    }))
    .property('badLeft', λ.error("Got left side"))
    .property('badRight', λ.error("Got right side"));

exports = module.exports = λ;
