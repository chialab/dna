import { createBrowserStackProvider } from '@chialab/vitest-provider-browserstack';
import { defineConfig, type UserConfig } from 'vite';
import { mergeConfig } from 'vitest/config';
import vitestConfig from './vitest.browser';

const browserstack = createBrowserStackProvider();

export default mergeConfig(
    vitestConfig as UserConfig,
    defineConfig({
        test: {
            // Cannot use element locator in browserstack, so we exclude tools
            exclude: ['./tools/*.tsx'],
            typecheck: {
                enabled: false,
            },
            browser: {
                enabled: true,
                provider: browserstack(),
                api: {
                    host: '0.0.0.0',
                    port: 5176,
                },
                instances: [
                    {
                        browser: 'browserstack:chrome-latest',
                        provider: browserstack({
                            capabilities: {
                                browserName: 'Chrome',
                                'bstack:options': {
                                    browserVersion: 'latest',
                                },
                            },
                        }),
                    },
                    {
                        browser: 'browserstack:chrome-latest-1',
                        provider: browserstack({
                            capabilities: {
                                browserName: 'Chrome',
                                'bstack:options': {
                                    browserVersion: 'latest-1',
                                },
                            },
                        }),
                    },
                    {
                        browser: 'browserstack:chrome-latest-2',
                        provider: browserstack({
                            capabilities: {
                                browserName: 'Chrome',
                                'bstack:options': {
                                    browserVersion: 'latest-2',
                                },
                            },
                        }),
                    },
                    {
                        // oldest chrome supported by vitest
                        browser: 'browserstack:chrome-87',
                        provider: browserstack({
                            capabilities: {
                                browserName: 'Chrome',
                                'bstack:options': {
                                    browserVersion: '87',
                                },
                            },
                        }),
                    },
                    {
                        browser: 'browserstack:firefox-latest',
                        provider: browserstack({
                            capabilities: {
                                browserName: 'Firefox',
                                'bstack:options': {
                                    browserVersion: 'latest',
                                },
                            },
                        }),
                    },
                    {
                        browser: 'browserstack:firefox-latest-1',
                        provider: browserstack({
                            capabilities: {
                                browserName: 'Firefox',
                                'bstack:options': {
                                    browserVersion: 'latest-1',
                                },
                            },
                        }),
                    },
                    {
                        browser: 'browserstack:firefox-latest-2',
                        provider: browserstack({
                            capabilities: {
                                browserName: 'Firefox',
                                'bstack:options': {
                                    browserVersion: 'latest-2',
                                },
                            },
                        }),
                    },
                    {
                        // oldest firefox supported by vitest
                        browser: 'browserstack:firefox-90',
                        provider: browserstack({
                            capabilities: {
                                browserName: 'Firefox',
                                'bstack:options': {
                                    browserVersion: '90',
                                },
                            },
                        }),
                    },
                    {
                        browser: 'browserstack:safari-latest',
                        provider: browserstack({
                            capabilities: {
                                browserName: 'Safari',
                                'bstack:options': {
                                    // Safari 26 is not fully supported by vitest provider yet
                                    // browserVersion: 'latest',
                                    browserVersion: '18.4',
                                },
                            },
                        }),
                    },
                    {
                        browser: 'browserstack:safari-16',
                        provider: browserstack({
                            capabilities: {
                                browserName: 'Safari',
                                'bstack:options': {
                                    browserVersion: '16',
                                },
                            },
                        }),
                    },
                    {
                        // oldest safari supported by vitest
                        browser: 'browserstack:safari-15',
                        provider: browserstack({
                            capabilities: {
                                browserName: 'Safari',
                                'bstack:options': {
                                    browserVersion: '15.6',
                                },
                            },
                        }),
                    },
                    {
                        browser: 'browserstack:edge-latest',
                        provider: browserstack({
                            capabilities: {
                                browserName: 'MicrosoftEdge',
                                'bstack:options': {
                                    browserVersion: 'latest',
                                },
                            },
                        }),
                    },
                ],
            },
        },
    }) as UserConfig
);
