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
    if (!process.env.TRAVIS && !process.env.CI) {
        karma.set({
            cordovaSettings: {
                platforms: [],
                hostip: 'localhost',
            },
        });
        karma.browsers.push('Cordova');
        karma.plugins.push('karma-cordova-launcher');
        karma.files.push('node_modules/dom-delegate/lib/delegate.js');
        if (process.platform === 'darwin') {
            karma.browsers.push('Safari');
            karma.plugins.push('karma-safari-launcher');
            karma.cordovaSettings.platforms.push('ios');
        } else if (process.platform === 'win32') {
            karma.browsers.push('IE');
            karma.plugins.push('karma-ie-launcher');
        }
    }
};
