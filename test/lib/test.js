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
        // Go through and check all the tagged arguments.
        var length = λ.functionLength(type);
        λ.fill(length)(λ.identity).forEach(function (value, index) {
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
    .property('checkTaggedConcat', λ.curry(function(type, args, exec, access, test) {
        var length = λ.functionLength(type);
        λ.fill(length)(λ.identity).forEach(function (value, index) {
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
    .property('checkStream', λ.curry(function(property, args, test) {
        var env = this,
            failures = [],
            expected = 0,
            inputs,
            applied,
            i,
            check = env.curry(function(state, inputs, index, result) {
                state(
                    !result ?
                    env.some(
                        λ.failureReporter(
                            inputs,
                            index + 1
                        )
                    ) :
                    env.none
                );
            }),
            reporter = function(report) {
                failures.push({
                    valid: report.isNone,
                    msg: report.fold(
                        function(fail) {
                            return 'Failed after ' + fail.tries + ' tries: ' + fail.inputs.toString();
                        },
                        function() {
                            return 'OK';
                        }
                    )
                });
            },
            checkDone = function() {
                return function() {
                    test.ok(true, 'OK');
                };
            },
            generateInputs = function(env, args, size) {
                return env.map(args, function(arg) {
                    return env.arb(arg, size);
                });
            };

        for(i = 0; i < env.goal; i++) {
            inputs = generateInputs(env, args, i);
            applied = property.apply(this, inputs);
            applied.fork(check(reporter, inputs, i), checkDone());
        }

        var valid = λ.fold(failures, true, function(a, b) {
                return a && b.valid;
            }),
            words = valid ? 'OK' : λ.fold(failures, '', function(a, b) {
                return b.valid ? a : a + '\n' + b.msg;
            });

        test.expect(env.goal + 1);
        test.ok(valid, words);
        test.done();
    }))
    .property('badLeft', λ.error("Got left side"))
    .property('badRight', λ.error("Got right side"));

exports = module.exports = λ;
