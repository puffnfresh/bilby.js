var λ = require('./lib/test'),
    λ = λ
    .method('filter', λ.isArray, λ.curry(function(a, f) {
        var accum = [],
            total,
            i;

        for (i = 0, total = a.length; i < total; i++) {
            if (f(a[i])) {
                accum.push(a[i]);
            }
        }

        return accum;
    }))
    .method('zipWithIndex', λ.isArray, λ.curry(function(a) {
        var accum = [],
            total = a.length,
            i;

        for (i = 0; i < total; i++) {
            accum[i] = λ.Tuple2(a[i], i);
        }

        return accum;
    }));

exports.stream = {
    'when testing fork should call next correct number of times': λ.check(
        function(a) {
            var accum = 0,
                stream = λ.Stream.fromArray(a);
            stream.fork(
                function() {
                    accum += 1;
                },
                λ.identity
            );
            return accum === a.length;
        },
        [λ.arrayOf(λ.AnyVal)]
    ),
    'when testing fork should call done correct number of times': λ.check(
        function(a) {
            var accum = 0,
                stream = λ.Stream.fromArray(a);
            stream.fork(
                λ.identity,
                function() {
                    accum += 1;
                }
            );
            return accum === 1;
        },
        [λ.arrayOf(λ.AnyVal)]
    ),
    'when testing map and then fork should call done correct number of times': λ.check(
        function(a) {
            var accum = 0,
                stream = λ.Stream.fromArray(a).map(
                    function(x) {
                        return a + 1;
                    }
                );
            stream.fork(
                λ.identity,
                function() {
                    accum += 1;
                }
            );
            return accum === 1;
        },
        [λ.arrayOf(λ.AnyVal)]
    ),
    'when testing equal and then fork should call done correct number of times': λ.check(
        function(a) {
            var accum = 0,
                stream = λ.Stream.fromArray(a).equal(λ.Stream.fromArray(a));
            stream.fork(
                λ.identity,
                function() {
                    accum += 1;
                }
            );
            return accum === 1;
        },
        [λ.arrayOf(λ.AnyVal)]
    ),
    'when testing concat with the stream should dispatch all items': λ.checkStream(
        function(a, b) {
            var x = λ.Stream.fromArray(a),
                y = λ.Stream.fromArray(b),
                actual = x.concat(y),
                expected = λ.Stream.fromArray(λ.concat(a, b));

            return actual.equal(expected);
        },
        [λ.arrayOf(λ.AnyVal), λ.arrayOf(λ.AnyVal)]
    ),
    'when testing drop with the stream should dispatch all items': λ.checkStream(
        function(a) {
            var x = λ.Stream.fromArray(a),
                len = a.length,
                rnd = Math.floor(λ.randomRange(len || 1, len)),
                actual = x.drop(rnd),
                expected = λ.Stream.fromArray(a.slice(rnd));

            return actual.equal(expected);
        },
        [λ.arrayOf(λ.AnyVal)]
    ),
    'when testing equality with same stream should return true': λ.checkStream(
        function(a) {
            return a.equal(a);
        },
        [λ.streamOf(λ.AnyVal)]
    ),
    'when testing extract with the stream should dispatch all items': λ.check(
        function(a) {
            var actual = λ.Stream.fromArray(a).extract();
            return actual === null;
        },
        [λ.arrayOf(Number)]
    ),
    'when testing filter with the stream should dispatch all items': λ.checkStream(
        function(a) {
            var actual = λ.Stream.fromArray(a).filter(λ.isEven),
                expected = λ.Stream.fromArray(λ.filter(a, λ.isEven));

            return actual.equal(expected);
        },
        [λ.arrayOf(Number)]
    ),
    'when testing length with the stream should dispatch all items': λ.checkStream(
        function(a) {
            var actual = λ.Stream.fromArray(a).length(),
                expected = λ.Stream.fromArray(a.length);

            return actual.equal(expected);
        },
        [λ.arrayOf(Number)]
    ),
    'when testing map with the stream should dispatch all items': λ.checkStream(
        function(a) {
            var actual = λ.Stream.fromArray(a).map(λ.identity),
                expected = λ.Stream.fromArray(λ.map(a, λ.identity));

            return actual.equal(expected);
        },
        [λ.arrayOf(Number)]
    ),
    'when testing merge with the stream should dispatch all items': λ.checkStream(
        function(a, b) {
            var x = λ.Stream.fromArray(a),
                y = λ.Stream.fromArray(b),
                actual = x.merge(y),
                expected = λ.Stream.fromArray(λ.concat(a, b));

            return actual.equal(expected);
        },
        [λ.arrayOf(λ.AnyVal), λ.arrayOf(λ.AnyVal)]
    ),
    'when testing pipe with the stream should dispatch all items': λ.checkStream(
        function(a, b) {
            var x = λ.Stream.fromArray(a),
                y = λ.Stream(function (next, done) {
                    // Pretent to be a state/writer monad
                    x.pipe({
                        run: next
                    });
                }),
                expected = λ.Stream.fromArray(a);

            return expected.equal(y);
        },
        [λ.arrayOf(λ.AnyVal), λ.arrayOf(λ.AnyVal)]
    ),
    'when testing scan with the stream should dispatch all items': λ.checkStream(
        function(a) {
            var x = λ.Stream.fromArray(a),
                sum = function(a, b) {
                    return a + b;
                },
                inc = function(a) {
                    var x = 0;
                    return λ.map(
                        a,
                        function(y) {
                            x = sum(x, y);
                            return x;
                        }
                    );
                },
                actual = x.scan(0, sum),
                expected = λ.Stream.fromArray(inc(a));

            return actual.equal(expected);
        },
        [λ.arrayOf(Number)]
    ),
    'when testing take with the stream should dispatch all items': λ.checkStream(
        function(a) {
            var x = λ.Stream.fromArray(a),
                rnd = λ.randomRange(0, a.length),
                actual = x.take(rnd),
                expected = λ.Stream.fromArray(a.slice(0, rnd));

            return actual.equal(expected);
        },
        [λ.arrayOf(λ.AnyVal)]
    ),
    'when testing zip with the stream should dispatch all items': λ.checkStream(
        function(a, b) {
            var x = λ.Stream.fromArray(a),
                y = λ.Stream.fromArray(b),
                actual = x.zip(y),
                expected = λ.Stream.fromArray(λ.zip(a, b));

            return actual.equal(expected);
        },
        [λ.arrayOf(λ.AnyVal), λ.arrayOf(λ.AnyVal)]
    ),
    'when testing zipWithIndex with the stream should dispatch all items': λ.checkStream(
        function(a) {
            var x = λ.Stream.fromArray(a),
                actual = x.zipWithIndex(),
                expected = λ.Stream.fromArray(λ.zipWithIndex(a));

            return actual.equal(expected);
        },
        [λ.arrayOf(λ.AnyVal)]
    )
};
