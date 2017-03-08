var path = require('path');
var babel = require('rollup-plugin-babel');
var resolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var replace = require('rollup-plugin-replace');

var istanbul = require('rollup-plugin-istanbul');
var uglify = require('rollup-plugin-uglify');
var alias = require('rollup-plugin-alias');

module.exports = {
    moduleName: 'DNA',
    plugins: [
        alias({
            // packages
            '@dnajs/core': path.resolve('./packages/dna-core'),
            '@dnajs/custom-elements-v0': path.resolve('./packages/dna-custom-elements-v0'),
            '@dnajs/custom-elements-v1': path.resolve('./packages/dna-custom-elements-v1'),
            '@dnajs/idom': path.resolve('./packages/dna-idom'),
            '@dnajs/react': path.resolve('./packages/dna-react'),
            // dev
            'react-dom': path.resolve('./node_modules/react-dom/dist/react-dom.min.js'),
            'react': path.resolve('./node_modules/react/dist/react.min.js'),
        }),
        resolve({
            skip: ['react', 'react-dom'],
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
        (process.env.NODE_ENV === 'test') ? istanbul({
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
    external: process.env.min === 'true' ? ['react', 'react-dom'] : [],
};
