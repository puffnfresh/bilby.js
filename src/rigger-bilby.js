(function() {
    var bilby;

    //= environment.js

    bilby = environment();
    bilby = bilby.property('environment', environment);

    //= helpers.js

    //= do.js

    //= data.js

    //= builtins.js

    if(typeof exports != 'undefined') {
        exports = module.exports = bilby;
    } else {
        this.bilby = bilby;
    }
})(this);
