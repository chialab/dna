var grunt = require('grunt');

require('load-grunt-tasks')(grunt);

grunt.initConfig({
    clean: {
        dist: ['dist/**/*'],
    },
    systemjs: {
        options: {
            sfx: true,
            baseURL: '.',
            configFile: './system.config.js',
            minify: true,
            build: {
                mangle: true
            }
        },
        dist: {
            files: [{
                src: 'src/dna-components.next.js',
                dest: 'dist/dna-components.min.js'
            }]
        }
    }
});

grunt.registerTask('build', ['clean', 'systemjs']);
