module.exports = function(karma) {
    karma.set({
        client: {
            mocha: {
                timeout: 10 * 1000
            }
        }
    })
    karma.systemjs.serveFiles.push('node_modules/dom-delegate/lib/delegate.js');
};
