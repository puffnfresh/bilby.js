// Option
function some(x) {
    if(!(this instanceof some)) return new some(x);
    this.x = x;
    this.getOrElse = function() {
        return x;
    };
    this.map = function(f) {
        return some(f(x));
    };

    this['>='] = function(f) {
        return f(x);
    };
    this['>'] = function(f) {
        return this.map(f);
    };
    this['*'] = function(s) {
        return s.map(x);
    };
    this['+'] = function(s) {
        return s.map(function(y) {
            return x['+'](y);
        });
    };
    Do.setValueOf(this);
}
bilby.some = some;

var none = {
    getOrElse: function(x) {
        return x;
    },
    map: function() {
        return this;
    },

    '>=': function() {
        return this;
    },
    '>': function() {
        return this;
    },
    '*': function() {
        return this;
    },
    '+': function() {
        return this;
    }
};
Do.setValueOf(none);
bilby.none = none;
