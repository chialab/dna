var grunt = require('grunt');

require('load-grunt-tasks')(grunt);

grunt.initConfig({
    clean: {
        dist: ['dist/**/*'],
        standalone: ['dist/**/*.js']
    },
    copy: {
        dist: {
            files: [{
                cwd: 'src',
                expand: true,
                src: ['**/*'],
                dest: 'dist/'
            }]
        }
    },
    babel: {
        options: {
            modules: 'ignore'
        },
        dist: {
            options: {
                sourceMap: false,
            },
            files: [{
                'dist/dna-components.js': 'dist/dna-components.js'
            }]
        }
    },
    vulcanize: {
        options: {
            inlineScripts: true,
            inlineCss: true,
            stripComments: true,
        },
        dist: {
            files: {
                'dist/dna-components.html': 'src/dna-components.html'
            },
        },
        standalone: {
            files: {
                'dist/dna-components.html': 'dist/dna-components.html'
            },
        }
    },
    uglify: {
        standalone: {
            options: {
                mangle: false,
                sourceMap: false
            },
            files: {
                'dist/dna-components.js': ['dist/dna-components.js']
            }
        }
    },
    crisper: {
        dist: {
            options: {
                cleanup: false
            },
            files: {
                'dist/dna-components.html': 'dist/dna-components.html'
            }
        }
    },
    replace: {
        standalone: {
            options: {
                patterns: [{
                    match: /import[^;|\n]+[;|\n]?/g,
                    replacement: ''
                }]
            },
            files: {
                'dist/dna-components.js': 'dist/dna-components.js',
            }
        }
    }
});

grunt.registerTask('build', ['clean', 'vulcanize:dist', 'crisper', 'replace', 'babel', 'uglify', 'vulcanize:standalone', 'clean:standalone']);
