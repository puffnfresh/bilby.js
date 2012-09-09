(function() {
    var bilby;

    //= environment.js

    bilby = environment();
    bilby = bilby.property('environment', environment);

    //= helpers.js

    //= do.js

    //= builtins.js

    //= data.js

    if(typeof exports != 'undefined') {
        exports = module.exports = bilby;
    } else {
        this.bilby = bilby;
    }
})(this);
