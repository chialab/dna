'use strict';

module.exports = function(karma) {
    karma.set({
        client: {
            mocha: {
                timeout: 10 * 1000,
            },
        },
    });
    karma.files.unshift(
        'node_modules/dna-polyfills/src/extra/weak-map.js',
        'node_modules/incremental-dom/dist/incremental-dom.js',
        'node_modules/skin-template/src/parser.js',
        'node_modules/skin-template/src/render.js',
        'node_modules/skin-template/src/template.js',
        'node_modules/mixwith/src/mixwith.js'
    );
};
