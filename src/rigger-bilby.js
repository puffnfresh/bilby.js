(function() {
    var bilby = {};

    //= helpers.js

    //= multimethods.js

    //= do.js

    //= data.js

    //= patcher.js

    bilby.bilbify = function(o) {
        var i;

        if(typeof o == 'undefined' && this != bilby) {
            bilby.bilbify(o);
        }

        for(i in bilby)
            o[i] = bilby[i];

        patcher.all();
    };

    if(typeof exports != 'undefined') {
        exports = module.exports = bilby;
    } else {
        this.bilby = bilby;
    }
})(this);
