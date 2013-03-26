module.exports = function(grunt) {
    grunt.initConfig({
        lint: {
            src: ['src/*.js']
        },
        test: {
            src: ['test/*.js']
        },
        rigger: {
            'bilby.js': 'rigger-bilby.js'
        },
        min: {
            'bilby-min.js': 'bilby.js'
        },
        emu: {
            'README.md': 'bilby.js'
        },
        watch: {
            files: ['<config:lint.src>', '<config:test.src>'],
            tasks: 'rigger lint test'
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

    grunt.registerMultiTask('emu', 'Documentation extraction by emu.', function() {
        var emu = require('emu'),
            fs = require('fs'),
            source = fs.readFileSync(this.data, 'utf8');

        fs.writeFileSync(this.target, emu.getComments(source));
    });

    grunt.registerTask('default', 'lint rigger test emu min');
};
