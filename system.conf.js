(function() {
    System.config({
        meta: {
            'node_modules/virtual-dom/dist/virtual-dom.js': {
                format: 'global',
            },
            'src/plugins/*': {
                format: 'esm',
            },
            'dna/polyfills/src/extra/custom-elements.js': {
                format: 'esm',
            },
        },
        packages: {
            'snabbdom/h': {
                main: 'h.js',
                format: 'cjs',
                defaultExtension: 'js',
            },
            'snabbdom/snabbdom': {
                main: 'snabbdom.js',
                format: 'cjs',
                defaultExtension: 'js',
            },
            'snabbdom/attributes': {
                main: 'modules/attributes.js',
                format: 'cjs',
                defaultExtension: 'js',
            },
            'snabbdom/style': {
                main: 'modules/style.js',
                format: 'cjs',
                defaultExtension: 'js',
            },
            'snabbdom/class': {
                main: 'modules/class.js',
                format: 'cjs',
                defaultExtension: 'js',
            },
        },
        paths: {
            'dna/polyfills/*': 'node_modules/dna-polyfills/*',
            'dna/components': 'node_modules/dna-components/lib/dna.js',
            'snabbdom/snabbdom': 'node_modules/snabbdom',
            'snabbdom/h': 'node_modules/snabbdom',
            'snabbdom/attributes': 'node_modules/snabbdom',
            'snabbdom/style': 'node_modules/snabbdom',
            'snabbdom/class': 'node_modules/snabbdom',
            'mixwith': 'node_modules/mixwith/src/mixwith.js',
        },
    });
}());
