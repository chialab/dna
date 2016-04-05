(function() {
    System.config({
        meta: {
            'dna/delegate': {
                format: 'cjs',
            },
            'node_modules/virtual-dom/dist/virtual-dom.js': {
                format: 'global',
            },
        },
        packages: {
            'node_modules/dna-polyfills': {
                meta: {
                    '*.js': {
                        format: 'global',
                    },
                    '*.next.js': {
                        format: 'esm',
                    },
                },
            },
        },
        paths: {
            'dna/delegate': 'node_modules/dom-delegate/lib/delegate.js',
            'dna/polyfills/*': 'node_modules/dna-polyfills/*',
            'dna/components': 'node_modules/dna-components/dist/dna.js',
        },
    });
}());
