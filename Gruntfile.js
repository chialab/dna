var grunt = require('grunt');

require('load-grunt-tasks')(grunt);

grunt.initConfig({
    clean: {
        dist: ['dist/**/*']
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
            plugins: [
                'check-es2015-constants',
                'transform-es2015-arrow-functions',
                'transform-es2015-block-scoped-functions',
                'transform-es2015-block-scoping',
                'transform-es2015-classes',
                'transform-es2015-computed-properties',
                'transform-es2015-destructuring',
                'transform-es2015-for-of',
                'transform-es2015-function-name',
                'transform-es2015-literals',
                'transform-es2015-object-super',
                'transform-es2015-parameters',
                'transform-es2015-shorthand-properties',
                'transform-es2015-spread',
                'transform-es2015-sticky-regex',
                'transform-es2015-template-literals',
                'transform-es2015-typeof-symbol',
                'transform-es2015-unicode-regex',
                'transform-regenerator',
                'transform-proto-to-assign'
            ]
        },
        dist: {
            options: {
                sourceMaps: false,
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
        }
    },
    uglify: {
        standalone: {
            options: {
                mangle: true,
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
                }, {
                    match: /export\sclass/g,
                    replacement: 'class'
                }]
            },
            files: {
                'dist/dna-components.js': 'dist/dna-components.js',
            }
        }
    }
});

grunt.registerTask('build', ['clean', 'vulcanize', 'crisper', 'replace', 'babel', 'uglify']);
