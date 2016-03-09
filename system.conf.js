(function () {

    System.config({
        meta: {
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
            'dna/components': 'node_modules/dna-components/dist/dna.js',
        }
    });

})();
