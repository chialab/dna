(function() {
    System.config({
        meta: {
            'dna/polyfills/src/extra/custom-elements.js': {
                format: 'esm',
            },
        },
        paths: {
            'dna/polyfills/*': 'node_modules/dna-polyfills/*',
            'dna/components': 'node_modules/dna-components/dist/dna.js',
            'mixwith': 'node_modules/mixwith/src/mixwith.js',
            'google/incremental-dom': 'node_modules/incremental-dom/dist/incremental-dom.js',
            'skin-template/*': 'node_modules/skin-template/*',
        },
    });
}());
