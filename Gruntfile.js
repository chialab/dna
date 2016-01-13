var grunt = require('grunt');

require('load-grunt-tasks')(grunt);

grunt.initConfig({
    clean: {
        dist: ['dist/**/*'],
        doc: ['doc/**/*'],
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
    },
    jsdoc2md : {
        options: {
            'module-index-format': 'dl',
            'member-index-format': 'grouped',
            'property-list-format': 'table',
            'param-list-format': 'table',
            'name-format': 'code'
        },
        doc: {
            files: (function() {
                var sources = grunt.file.expand({ filter: 'isFile'}, ['src/*.js', '!src/index.next.js']),
                    res = [];
                sources.forEach(function (source) {
                    res.push({
                        src: source,
                        dest: source.replace('src/', 'doc/').replace(/(\.next)?\.js/i, '.md')
                    });
                });
                return res;
            })(),
        }
    }
});

grunt.registerTask('build', ['clean:dist', 'systemjs']);
grunt.registerTask('doc', ['clean:doc', 'jsdoc2md:doc']);
