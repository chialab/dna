/// <reference types="@chialab/vitest-provider-browserstack" />

import { mergeConfig } from 'vitest/config';
import vitestConfig from './vite.config';

export default mergeConfig(vitestConfig, {
    test: {
        // Cannot use element locator in browserstack, so we exclude vitest.spec.js
        exclude: ['./compat/vitest.spec.js'],
        browser: {
            enabled: true,
            provider: '@chialab/vitest-provider-browserstack',
            slowHijackESM: false,
            api: {
                host: '0.0.0.0',
                port: 5176,
            },
            instances: [
                { browser: 'browserstack:chrome-latest' },
                { browser: 'browserstack:chrome-latest-1' },
                { browser: 'browserstack:chrome-latest-2' },
                { browser: 'browserstack:chrome-87' },
                { browser: 'browserstack:firefox-latest' },
                { browser: 'browserstack:firefox-latest-1' },
                { browser: 'browserstack:firefox-latest-2' },
                { browser: 'browserstack:firefox-90' },
                { browser: 'browserstack:safari-latest' },
                { browser: 'browserstack:safari-16' },
                { browser: 'browserstack:safari-15' },
                { browser: 'browserstack:edge-latest' },
            ],
        },
        browserstack: {
            capabilities: {
                'chrome-latest': {
                    browserName: 'Chrome',
                    'bstack:options': {
                        browserVersion: 'latest',
                    },
                },
                'chrome-latest-1': {
                    browserName: 'Chrome',
                    'bstack:options': {
                        browserVersion: 'latest-1',
                    },
                },
                'chrome-latest-2': {
                    browserName: 'Chrome',
                    'bstack:options': {
                        browserVersion: 'latest-2',
                    },
                },
                // oldest chrome supported by vitest
                'chrome-87': {
                    browserName: 'Chrome',
                    'bstack:options': {
                        browserVersion: '87',
                    },
                },
                'firefox-latest': {
                    browserName: 'Firefox',
                    'bstack:options': {
                        browserVersion: 'latest',
                    },
                },
                'firefox-latest-1': {
                    browserName: 'Firefox',
                    'bstack:options': {
                        browserVersion: 'latest-1',
                    },
                },
                'firefox-latest-2': {
                    browserName: 'Firefox',
                    'bstack:options': {
                        browserVersion: 'latest-2',
                    },
                },
                // oldest firefox supported by vitest
                'firefox-90': {
                    browserName: 'Firefox',
                    'bstack:options': {
                        browserVersion: '90',
                    },
                },
                'safari-latest': {
                    browserName: 'Safari',
                    'bstack:options': {
                        browserVersion: 'latest',
                    },
                },
                'safari-16': {
                    browserName: 'Safari',
                    'bstack:options': {
                        browserVersion: '16',
                    },
                },
                // oldest safari supported by vitest
                'safari-15': {
                    browserName: 'Safari',
                    'bstack:options': {
                        browserVersion: '15.6',
                    },
                },
                'edge-latest': {
                    browserName: 'MicrosoftEdge',
                    'bstack:options': {
                        browserVersion: 'latest',
                    },
                },
            },
        },
    },
});
