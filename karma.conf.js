module.exports = function(karma) {
    karma.set({
        client: {
            mocha: {
                timeout: 10 * 1000,
            },
        },
    });
    karma.files.unshift(
        'node_modules/dna-polyfills/src/extra/custom-elements.js',
        'node_modules/virtual-dom/dist/virtual-dom.js'
    );
    karma.files.push('node_modules/dom-delegate/lib/delegate.js');
};
