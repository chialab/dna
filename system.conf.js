(function() {
    System.config({
        meta: {
            'node_modules/virtual-dom/dist/virtual-dom.js': {
                format: 'global',
            },
            'src/plugins/*': {
                format: 'esm',
            },
        },
        packages: {
            'node_modules/dna-polyfills': {
                meta: {
                    '*.js': {
                        format: 'global',
                    },
                },
            },
        },
        paths: {
            'dna/polyfills/*': 'node_modules/dna-polyfills/*',
            'dna/components': 'node_modules/dna-components/lib/dna.js',
            'vdom': 'node_modules/virtual-dom/dist/virtual-dom.js',
            'es6-classes/*': 'node_modules/es6-classes/*',
        },
    });
}());
