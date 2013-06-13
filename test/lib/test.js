var λ = require('../../dist/bilby');

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
        // TODO (Simon) : Make this better!
        function fill(num) {
            var a = [];
            while (--num > -1) {
                a.push(num);
            }
            return a;
        }
        // Go through and check all the tagged arguments.
        var length = λ.functionLength(type);
        fill(length).forEach(function (value, index) {
            function property() {
                return access(type.apply(this, arguments), index) == arguments[index];
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
