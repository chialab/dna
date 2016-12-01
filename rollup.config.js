var babel = require('rollup-plugin-babel');
var resolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var replace = require('rollup-plugin-replace');

var entries = require('rollup-plugin-multi-entry');
var istanbul = require('rollup-plugin-istanbul');
var uglify = require('rollup-plugin-uglify');

module.exports = {
    moduleName: 'DNA',
    plugins: [
        entries(),
        resolve(),
        replace({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
        (process.env.NODE_ENV === 'test' && process.env.CI_BUILD_TYPE !== 'saucelabs') ? istanbul({
            include: [
                'packages/**/*.js',
            ],
            exclude: [
                'packages/dna-core/src/lib/custom-event.js',
                'packages/dna-core/src/lib/matches.js',
                'packages/**/test/**/*.js',
            ],
        }) : {},
        babel({
            include: [
                'node_modules/incremental-dom/**/*.js',
                'node_modules/@dnajs/**/*.js',
                'packages/**/*.js',
            ],
        }),
        commonjs({
            include: [
                'node_modules/fbjs/**',
                'node_modules/object-assign/**',
                'node_modules/react/**',
                'node_modules/react-dom/**',
            ],
        }),
        process.env.min === 'true' ? uglify({
            output: {
                comments: /@license/,
            },
        }) : {},
    ],
    external: process.env.min === true ? ['react', 'react-dom'] : [],
};
