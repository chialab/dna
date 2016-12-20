/**
 * Copyright 2016 Chialab. All Rights Reserved.
 *
 * The MIT License (MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var path = require('path');
var json = require('./package.json');

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai'],


        // list of files / patterns to load in the browser
        files: [
            'packages/**/*.spec.js',
        ],


        // list of files to exclude
        exclude: [],

        rollupPreprocessor: Object.assign({
            sourceMap: false,
            format: 'iife',
        }, require('./rollup.config.js')),

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'packages/**/*.js': ['rollup'],
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: [
            process.env.CI ? 'dots' : 'progress',
            'coverage',
        ],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome', 'Firefox'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,
    });

    if (process.env.CI) {
        config.set({
            client: {
                captureConsole: false,
            },
            logLevel: config.LOG_ERROR,
        });

        switch (process.env.CI_BUILD_TYPE) {
            config.set({
                coverageReporter: {
                    dir: 'coverage',
                    reporters: [
                        {
                            type: 'lcov',
                            subdir: function(browserName) {
                                return path.join('report-lcov', browserName);
                            },
                        },
                    ],
                },
            });
            case 'saucelabs':
                var saucelabsBrowsers = require('./sl.browsers.js');
                config.set({
                    browserDisconnectTimeout: 10000,
                    browserDisconnectTolerance: 1,
                    browserNoActivityTimeout: 4 * 60 * 1000,
                    captureTimeout: 4 * 60 * 1000,
                    reporters: ['dots', 'coverage', 'saucelabs'],
                    sauceLabs: {
                        startConnect: false,
                        options: {},
                        username: process.env.SAUCE_USERNAME,
                        accessKey: process.env.SAUCE_ACCESS_KEY,
                        build: process.env.TRAVIS ?
                            `TRAVIS # ${process.env.TRAVIS_BUILD_NUMBER} (${process.env.TRAVIS_BUILD_ID})` :
                            undefined,
                        tunnelIdentifier: process.env.TRAVIS ?
                            process.env.TRAVIS_JOB_NUMBER :
                            undefined,
                        recordScreenshots: true,
                    },
                    customLaunchers: saucelabsBrowsers,
                    browsers: Object.keys(saucelabsBrowsers),
                });
                break;
            default:
                config.set({
                    customLaunchers: {
                        Chrome_CI: {
                            base: 'Chrome',
                            flags: ['--no-sandbox'],
                        },
                    },
                    browsers: ['Chrome_CI', 'Firefox'],
                });
                break;
        }
    } else {
        config.set({
            coverageReporter: {
                dir: 'coverage',
                reporters: [
                    {
                        type: 'html',
                        subdir: function(browserName) {
                            return path.join('report-html', browserName);
                        },
                    },
                    {
                        type: 'lcov',
                        subdir: function(browserName) {
                            return path.join('report-lcov', browserName);
                        },
                    },
                ],
            },
        });
    }
};
