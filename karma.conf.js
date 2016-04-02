module.exports = function(karma) {
    karma.set({
        client: {
            mocha: {
                timeout: 10 * 1000,
            },
        },
    });
    karma.files.unshift('node_modules/dna-polyfills/src/extra/custom-elements.js');
};
