var λ = require('../../bilby');

λ = λ
    .property('check', λ.curry(function(property, args, test) {
        var report = λ.forAll(property, args);

        test.ok(report.success, report.fold(
            "OK",
            function(inputs, tries) {
                return "Failed after " + tries + " tries: " + inputs.toString();
            }
        ));

        test.done();
    }))
    .property('badLeft', λ.error("Got left side"))
    .property('badRight', λ.error("Got right side"));

exports = module.exports = λ;
