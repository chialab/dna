var grunt = require('grunt');

require('load-grunt-tasks')(grunt);

grunt.initConfig({
    clean: {
        dist: ['dist/**/*'],
    },
    systemjs: {
        options: {
            sfx: true,
            minify: true,
            build: {
                mangle: true
            },
            // systemjs config
            builder: {
                baseURL: '.',
                transpiler: 'babel',
                defaultJSExtensions: true,
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
