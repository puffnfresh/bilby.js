// Option
function some(x) {
    if(!(this instanceof some)) return new some(x);
    this.getOrElse = function() {
        return x;
    };
    this.toLeft = function() {
        return left(x);
    };
    this.toRight = function() {
        return right(x);
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
    toLeft: function(r) {
        return right(r);
    },
    toRight: function(l) {
        return left(l);
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

var isOption = bilby.liftA2(or, isInstanceOf(some), strictEquals(none));


// Either (right biased)
function left(x) {
    if(!(this instanceof left)) return new left(x);
    this.fold = function(a, b) {
        return a(x);
    };
    this.swap = function() {
        return right(x);
    };
    this.isLeft = true;
    this.isRight = false;
    this.toOption = function() {
        return none;
    };
    this.toArray = function() {
        return [];
    };

    this.bind = function() {
        return this;
    };
    this.map = function() {
        return this;
    };
    this.apply = function(e) {
        return this;
    };
    this.append = function(l, plus) {
        var t = this;
        return l.fold(function(y) {
            return left(plus(x, y));
        }, function() {
            return t;
        });
    };
}

function right(x) {
    if(!(this instanceof right)) return new right(x);
    this.fold = function(a, b) {
        return b(x);
    };
    this.swap = function() {
        return left(x);
    };
    this.isLeft = false;
    this.isRight = true;
    this.toOption = function() {
        return some(x);
    };
    this.toArray = function() {
        return [x];
    };

    this.bind = function(f) {
        return f(x);
    };
    this.map = function(f) {
        return right(f(x));
    };
    this.apply = function(e) {
        return e.map(x);
    };
    this.append = function(r, plus) {
        return r.fold(function(x) {
            return left(x);
        }, function(y) {
            return right(plus(x, y));
        });
    };
}

var isEither = bilby.liftA2(or, isInstanceOf(left), isInstanceOf(right));


bilby = bilby
    .property('some', some)
    .property('none', none)
    .property('isOption', isOption)
    .method('>=', isOption, function(a, b) {
        return a.bind(b);
    })
    .method('<', isOption, function(a, b) {
        return a.map(b);
    })
    .method('*', isOption, function(a, b) {
        return a.apply(b);
    })
    .method('+', isOption, function(a, b) {
        return a.append(b, this['+']);
    })

    .property('left', left)
    .property('right', right)
    .property('isEither', isEither)
    .method('>=', isEither, function(a, b) {
        return a.bind(b);
    })
    .method('<', isEither, function(a, b) {
        return a.map(b);
    })
    .method('*', isEither, function(a, b) {
        return a.apply(b);
    })
    .method('+', isEither, function(a, b) {
        return a.append(b, this['+']);
    });
