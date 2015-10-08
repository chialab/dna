var grunt = require('grunt');

require('load-grunt-tasks')(grunt);

grunt.initConfig({
    clean: {
        dist: ['dist'],
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
            sourceMap: true,
            modules: 'ignore'
        },
        dist: {
            files: {
                'dist/dna-base-component.next.js': 'src/dna-base-component.next.js',
                'dist/dna-mixed-component.next.js': 'src/dna-mixed-component.next.js'
            }
        }
    }
});

grunt.registerTask('build', ['clean', 'copy', 'babel']);
