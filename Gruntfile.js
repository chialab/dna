var grunt = require('grunt');

require('load-grunt-tasks')(grunt);

grunt.initConfig({
    clean: {
        dist: ['dist/**/*'],
    },
    systemjs: {
        options: {
            sfx: false,
            minify: false,
            build: {
                mangle: false
            },
            // systemjs config
            builder: {
                baseURL: '.',
                transpiler: 'babel',
                meta: {
                    './node_modules/babel/*': {
                        format: 'cjs'
                    },
                    '*.next.js': {
                        format: 'esm'
                    }
                }
            }
        },
        dist: {
            files: [{
                src: 'src/index.next.js',
                dest: 'dist/dna-components.bundle.js'
            }]
        }
    }
});

grunt.registerTask('build', ['clean', 'systemjs']);
