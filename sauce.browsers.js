/* eslint-env node */

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

module.exports = {
    SL_Chrome_dev: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'macOS 10.12',
        version: 'dev',
    },
    SL_Chrome_beta: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'macOS 10.12',
        version: 'beta',
    },
    SL_Chrome: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Linux',
        version: 'latest',
    },
    SL_Chrome_1: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'OS X 10.10',
        version: 'latest-1',
    },
    SL_Chrome_2: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Linux',
        version: 'latest-2',
    },
    SL_Firefox_dev: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'Windows 10',
        version: 'dev',
    },
    SL_Firefox_beta: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'Windows 10',
        version: 'beta',
    },
    SL_Firefox: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'Linux',
        version: 'latest',
    },
    SL_Firefox_1: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'OS X 10.10',
        version: 'latest-1',
    },
    SL_Firefox_2: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'Linux',
        version: 'latest-2',
    },
    SL_Safari_8: {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'OS X 10.10',
        version: '8',
    },
    SL_Safari_9: {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'OS X 10.11',
        version: '9',
    },
    SL_Safari_10: {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'OS X 10.11',
        version: '10',
    },
    SL_IE_11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11',
    },
    SL_Edge_13: {
        base: 'SauceLabs',
        browserName: 'microsoftedge',
        platform: 'Windows 10',
        version: '13',
    },
    SL_Edge_14: {
        base: 'SauceLabs',
        browserName: 'microsoftedge',
        platform: 'Windows 10',
        version: '14',
    },
    SL_iOS_8: {
        base: 'SauceLabs',
        browserName: 'Safari',
        platform: 'iOS',
        version: '8.4',
        device: 'iPhone 5',
    },
    SL_iOS_9: {
        base: 'SauceLabs',
        browserName: 'Safari',
        platform: 'iOS',
        version: '9.3',
        device: 'iPhone 6',
    },
    SL_iOS_10: {
        base: 'SauceLabs',
        browserName: 'Safari',
        platform: 'iOS',
        version: '10.3',
        device: 'iPhone 7',
    },
    SL_Android_4: {
        base: 'SauceLabs',
        browserName: 'android',
        deviceName: 'Android Emulator',
        platform: 'Linux',
        version: '4.4',
    },
    SL_Android_5: {
        base: 'SauceLabs',
        browserName: 'android',
        deviceName: 'Android Emulator',
        deviceType: 'phone',
        platform: 'Linux',
        version: '5.1',
    },
    SL_Android_6: {
        base: 'SauceLabs',
        browserName: 'android',
        deviceName: 'Android Emulator',
        deviceType: 'phone',
        platform: 'Linux',
        version: '6.0',
    },
    SL_Android_7: {
        base: 'SauceLabs',
        browserName: 'android',
        deviceName: 'Android GoogleAPI Emulator',
        deviceType: 'phone',
        platform: 'Linux',
        version: '7.0',
    },
};
