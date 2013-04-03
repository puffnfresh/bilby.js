var λ = require('../../bilby');

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
    .property('badLeft', λ.error("Got left side"))
    .property('badRight', λ.error("Got right side"));

exports = module.exports = λ;
