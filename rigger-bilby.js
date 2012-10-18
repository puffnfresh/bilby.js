(function(root) {
    'use strict';

    /* bilby's environment means `this` is special */
    /*jshint validthis: true*/

    /* bilby uses the !(this instanceof c) trick to remove `new` */
    /*jshint newcap: false*/

    var bilby;

    //= src/environment.js

    bilby = environment();
    bilby = bilby.property('environment', environment);

    //= src/helpers.js

    //= src/do.js

    //= src/builtins.js

    //= src/data.js

    //= src/lens.js

    //= src/io.js

    //= src/check.js

    if(typeof exports != 'undefined') {
        /*jshint node: true*/
        exports = module.exports = bilby;
    } else {
        root.bilby = bilby;
    }
})(this);
