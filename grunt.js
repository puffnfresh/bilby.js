module.exports = function(grunt) {
    grunt.initConfig({
        lint: {
            src: ['src/*.js']
        },
        test: {
            src: ['test/*.js']
        },
        rigger: {
            'bilby.js': 'src/rigger-bilby.js'
        },
        min: {
            'bilby-min.js': 'bilby.js'
        }
    });

    grunt.registerMultiTask('rigger', 'File concatentation by rigger.', function() {
        var rigger = require('rigger'),
            fs = require('fs'),
            done = this.async(),
            target = this.target;

        rigger(this.data, function(err, output) {
            if(err) return grunt.log.error(err);
            fs.writeFileSync(target, output);
            done(true);
        });
    });

    grunt.registerTask('default', 'lint test rigger min');
};
