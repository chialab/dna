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
        paths: {
            'dna/polyfills/*': 'node_modules/dna-polyfills/*',
            'dna/components': 'node_modules/dna-components/lib/dna.js',
            'vdom': 'node_modules/virtual-dom/dist/virtual-dom.js',
            'mixwith': 'node_modules/mixwith/src/mixwith.js',
        },
    });
}());
