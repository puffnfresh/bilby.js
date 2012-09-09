// Option
function some(x) {
    if(!(this instanceof some)) return new some(x);
    this.x = x;
    this.getOrElse = function() {
        return x;
    };

    this.bind = function(f) {
        return f(x);
    };
    this.map = function(f) {
        return some(f(x));
    };
    this.apply = function(s) {
        return s.map(x);
    };
    this.append = function(s, plus) {
        return s.map(function(y) {
            return plus(x, y);
        });
    };
    Do.setValueOf(this);
}

var none = {
    getOrElse: function(x) {
        return x;
    },
    bind: function() {
        return this;
    },
    map: function() {
        return this;
    },
    apply: function() {
        return this;
    },
    append: function() {
        return this;
    }
};
Do.setValueOf(none);

var isOption = function(x) {
    return isInstanceOf(some, x) || x === none;
};

bilby = bilby
    .property('some', some)
    .property('none', none)
    .property('isOption', isOption)
    .method('>=', isOption, function(a, b) {
        return a.bind(b);
    })
    .method('>', isOption, function(a, b) {
        return a.map(b);
    })
    .method('*', isOption, function(a, b) {
        return a.apply(b);
    })
    .method('+', isOption, function(a, b) {
        return a.append(b, this['+']);
    });
