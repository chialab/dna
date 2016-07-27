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
        'node_modules/dna-polyfills/src/extra/custom-elements.js',
        'node_modules/dna-polyfills/src/extra/dom-parser.js',
        'node_modules/mixwith/src/mixwith.js',
        'node_modules/snabbdom/dist/snabbdom.js',
        'node_modules/snabbdom/dist/snabbdom_class.js',
        'node_modules/snabbdom/dist/snabbdom_style.js',
        'node_modules/snabbdom/dist/snabbdom_attributes.js',
        'node_modules/snabbdom/dist/h.js'
    );
    karma.systemjsPreprocessor.packages = {};
    karma.systemjsPreprocessor.paths['snabbdom/snabbdom'] = 'node_modules/snabbdom/dist/snabbdom.js';
    karma.systemjsPreprocessor.paths['snabbdom/h'] = 'node_modules/snabbdom/dist/h.js';
    karma.systemjsPreprocessor.paths['snabbdom/attributes'] = 'node_modules/snabbdom/dist/snabbdom_attributes.js';
    karma.systemjsPreprocessor.paths['snabbdom/style'] = 'node_modules/snabbdom/dist/snabbdom_style.js';
    karma.systemjsPreprocessor.paths['snabbdom/class'] = 'node_modules/snabbdom/dist/snabbdom_class.js';
};
