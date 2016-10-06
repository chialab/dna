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
        'node_modules/incremental-dom/dist/incremental-dom.js',
        'node_modules/skin-template/src/*.js',
        'node_modules/mixwith/src/mixwith.js'
    );
};
