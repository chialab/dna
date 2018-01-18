/* eslint-env node */

const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');

const istanbul = require('rollup-plugin-istanbul');
const uglify = require('rollup-plugin-uglify');

module.exports = {
    moduleName: 'DNA',
    plugins: [
        resolve(),
        replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
        (process.env.NODE_ENV === 'test') ? istanbul({
            include: [
                'packages/**/*.js',
            ],
            exclude: [
                'packages/*/node_modules/**',
                'packages/*/test/**',
                'packages/core/src/helpers/custom-event.js',
                'packages/core/src/helpers/matches.js',
            ],
        }) : {},
        babel({
            include: [
                'packages/*/node_modules/incremental-dom/**/*.js',
                'packages/*/node_modules/@dnajs/**/*.js',
                'packages/*/src/**',
                'packages/*/test/**',
                'packages/*/index.js',
            ],
        }),
        commonjs({
            include: [
                'packages/*/node_modules/fbjs/**',
                'packages/*/node_modules/object-assign/**',
                'packages/*/node_modules/prop-types/**',
                'packages/*/node_modules/create-react-class/**',
                'packages/*/node_modules/react/**',
                'packages/*/node_modules/react-dom/**',
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
