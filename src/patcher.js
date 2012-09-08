var patcher = {};

patcher.functions = function() {
    Do.setValueOf(Function.prototype);
    Function.prototype.curry = curry;
    Function.prototype['>>'] = function(g) {
        var f = this;
        return function(x) {
            return f(x)['>='](g);
        };
    };

    if(!Function.prototype.bind)
        Function.prototype.bind = function(o) {
            var f = this,
                length = f._length || f.length,
                args = [].slice.call(arguments, 1),
                g = function() {
                    return f.apply(o || this, args.concat([].slice.call(arguments)));
                };

            // Can't override length but can set _length for currying
            g._length = length - args.length;

            return g;
        };
};

patcher.arrays = function() {
    Do.setValueOf(Array.prototype);
    Array.prototype['>='] = function(f) {
        var accum = [],
            i;

        for(i = 0; i < this.length; i++) {
            accum = accum.concat(f(this[i]));
        }

        return accum;
    };
    Array.prototype['>'] = function(f) {
        var accum = [],
            i;

        for(i = 0; i < this.length; i++) {
            accum[i] = f(this[i]);
        }

        return accum;
    };
    Array.prototype['*'] = function(a) {
        var accum = [],
            i,
            j;

        for(i = 0; i < this.length; i++) {
            for(j = 0; j < a.length; j++) {
                accum.push(this[i](a[j]));
            }
        }

        return accum;
    };
    Array.prototype['+'] = function(a) {
        return this.concat(a);
    };
};

patcher.numbers = function() {
    Number.prototype['+'] = function(n) {
        return this + n;
    };
};

patcher.strings = function() {
    String.prototype['+'] = function(s) {
        return this + s;
    };
};

patcher.all = function() {
    patcher.functions();
    patcher.arrays();
    patcher.numbers();
    patcher.strings();
};

bilby.patcher = patcher;
