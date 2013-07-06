module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        rig: {
            compile: {
                options: {
                    banner: '/* Compiled : <%= grunt.template.today("yyyy-mm-dd HH:MM") %> */\n'
                },
                files: {
                    'dist/bilby.js': [
                        'lib/rigger/rigger.js'
                    ]
                }
            }
        },
        jshint: {
            all: [
                'Gruntfile.js',
                'dist/bilby.js',
                'src/*.js',
                'test/*.js'
            ]
        },
        nodeunit: {
            all: [
                'test/*.js'
            ]
        },
        uglify: {
            all: {
                options: {
                    beautify: false,
                    sourceMap: 'dist/bilby.min.map.js'
                },
                files: {
                    'dist/bilby.min.js': ['dist/bilby.js']
                }
            }
        },
        emu: {
            'README.md': 'dist/bilby.js'
        },
        watch: {
            options: {
                interrupt: true,
                debounceDelay: 250
            },
            files: [
                'src/*',
                'test/*'
            ],
            tasks: [
                'rig',
                'jshint',
                'nodeunit'
            ]
        }
    });

    grunt.loadNpmTasks('grunt-rigger');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerMultiTask('emu', 'Documentation extraction by emu.', function() {
        var emu = require('emu'),
            fs = require('fs'),
            source = fs.readFileSync(this.data, 'utf8');

        fs.writeFileSync(this.target, emu.getComments(source));
    });

    grunt.registerTask('default', ['rig', 'jshint', 'nodeunit', 'uglify', 'emu']);

    grunt.registerTask('dist', ['rig', 'uglify', 'emu']);
};
