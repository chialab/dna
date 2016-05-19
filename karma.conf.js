module.exports = function(karma) {
    karma.set({
        client: {
            mocha: {
                timeout: 10 * 1000,
            },
        },
    });
    karma.files.unshift(
        'node_modules/dna-polyfills/src/array/foreach.js',
        'node_modules/dna-polyfills/src/array/from.js',
        'node_modules/dna-polyfills/src/array/is-array.js',
        'node_modules/dna-polyfills/src/dom/class-list.js',
        'node_modules/dna-polyfills/src/object/set-prototype-of.js',
        'node_modules/dna-polyfills/src/function/name.js',
        'node_modules/dna-polyfills/src/extra/custom-elements.js',
        'node_modules/virtual-dom/dist/virtual-dom.js'
    );
};
