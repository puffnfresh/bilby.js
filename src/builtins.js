bilby = bilby
    .method('<', isFunction, function(a, b) {
        return compose(b, a);
    })
    .method('*', isFunction, function(a, b) {
        return function(x) {
            return a(x)(b(x));
        };
    });

bilby = bilby
    .method('>>', isFunction, function(a, b) {
        var env = this;
        return function(x) {
            return env['>='](a(x), b);
        };
    })

    .method('equal', isBoolean, strictEquals)
    .method('equal', isNumber, strictEquals)
    .method('equal', isString, strictEquals)
    .method('equal', isArray, function(a, b) {
        var env = this;
        return env.fold(zip(a, b), true, function(a, t) {
            return a && env.equal(t[0], t[1]);
        });
    })

    .method('fold', isArray, function(a, b, c) {
        var i;
        for(i = 0; i < a.length; i++) {
            b = c(b, a[i]);
        }
        return b;
    })

    .method('>=', isArray, function(a, b) {
        var accum = [],
            i;

        for(i = 0; i < a.length; i++) {
            accum = accum.concat(b(a[i]));
        }

        return accum;
    })
    .method('<', isArray, function(a, b) {
        var accum = [],
            i;

        for(i = 0; i < a.length; i++) {
            accum[i] = b(a[i]);
        }

        return accum;
    })
    .method('*', isArray, function(a, b) {
        var accum = [],
            i,
            j;

        for(i = 0; i < a.length; i++) {
            for(j = 0; j < b.length; j++) {
                accum.push(a[i](b[j]));
            }
        }

        return accum;
    })
    .method('+', isArray, function(a, b) {
        return a.concat(b);
    })

    .method('+', bilby.liftA2(or, isNumber, isString), function(a, b) {
        return a + b;
    })

    .property('oneOf', function(a) {
        return a[Math.floor(this.randomRange(0, a.length))];
    })
    .property('randomRange', function(a, b) {
        return Math.random() * (b - a) + a;
    })

    .method('arb', isArrayOf, function(a, s) {
        var accum = [],
            length = this.randomRange(0, s),
            i;

        for(i = 0; i < length; i++) {
            accum.push(this.arb(a.type, s - 1));
        }

        return accum;
    })
    .method('arb', isObjectLike, function(a, s) {
        var o = {},
            i;

        for(i in a.props) {
            o[i] = this.arb(a.props[i]);
        }

        return o;
    })
    .method('arb', strictEquals(AnyVal), function(a, s) {
        var types = [Boolean, Number, String];
        return this.arb(this.oneOf(types), s - 1);
    })
    .method('arb', strictEquals(Array), function(a, s) {
        return this.arb(arrayOf(AnyVal), s - 1);
    })
    .method('arb', strictEquals(Boolean), function(a, s) {
        return Math.random() < 0.5;
    })
    .method('arb', strictEquals(Char), function(a, s) {
        return String.fromCharCode(Math.floor(this.randomRange(32, 127)));
    })
    .method('arb', strictEquals(Number), function(a, s) {
        // Half the number of bits to represent Number.MAX_VALUE
        var bits = 511,
            variance = Math.pow(2, (s * bits) / this.goal);
        return this.randomRange(-variance, variance);
    })
    .method('arb', strictEquals(Object), function(a, s) {
        var o = {},
            length = this.randomRange(0, s),
            i;

        for(i = 0; i < length; i++) {
            o[this.arb(String, s - 1)] = this.arb(arrayOf(AnyVal), s - 1);
        }

        return o;
    })
    .method('arb', strictEquals(String), function(a, s) {
        return this.arb(arrayOf(Char), s - 1).join('');
    })

    .method('shrink', isBoolean, function() {
        return function(b) {
            return b ? [False] : [];
        };
    })
    .method('shrink', isNumber, function(n) {
        var accum = [0],
            x = n;

        if(n < 0)
            accum.push(-n);

        while(x) {
            x = x / 2;
            x = x < 0 ? Math.ceil(x) : Math.floor(x);
            if(x) {
                accum.push(n - x);
            }
        }

        return accum;
    });

Do.setValueOf(Array.prototype);
Do.setValueOf(Function.prototype);
