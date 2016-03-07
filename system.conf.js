(function () {

    System.config({
        meta: {
            '*.html': { loader: 'dna/loaders/template' },
            '*.css': { loader: 'dna/loaders/css', format: 'esm' },
            '*.sass': { loader: 'dna/loaders/sass' },
            '*.scss': { loader: 'dna/loaders/sass' },
            'dna/delegate': {
                format: 'cjs'
            }
        },
        packages: {
            'node_modules/dna-polyfills': {
                meta: {
                    '*.js': {
                        format: 'global'
                    },
                    '*.next.js': {
                        format: 'esm'
                    },
                }
            }
        },
        paths: {
            'dna/delegate': 'node_modules/dom-delegate/lib/delegate.js',
            'dna/polyfills/*': 'node_modules/dna-polyfills/*',
            'dna/components': 'node_modules/dna-components/src/dna.next.js',
            'dna/loaders/*': 'node_modules/dna-components/loaders/*.js',
        }
    });

})();
