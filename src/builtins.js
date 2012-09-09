bilby = bilby
    .method('>>', isFunction, function(a, b) {
        return this['>='](a, b);
    })
    .method('+', isArray, function(a, b) {
        return a.concat(b);
    })
    .method('+', isNumber, function(a, b) {
        return a + b;
    })
    .method('+', isString, function(a, b) {
        return a + b;
    });
