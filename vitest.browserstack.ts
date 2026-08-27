import { createBrowserStackProvider } from '@chialab/vitest-provider-browserstack';
import { defineConfig, type UserConfig } from 'vite';
import { mergeConfig } from 'vitest/config';
import { vitestBrowserConfig } from './vitest.browser.ts';

const browserstack = createBrowserStackProvider({
    buildName: 'CI',
    projectName: 'DNA',
});

export default mergeConfig(
    vitestBrowserConfig as UserConfig,
    defineConfig({
        oxc: {
            target: 'es2020',
        },
        test: {
            // Cannot use element locator in browserstack, so we exclude tools
            // Also, exclude frameworks because we wont to test their compatibility
            exclude: ['./tools/**/*', './frameworks/**/*'],
            typecheck: {
                enabled: false,
            },
            browser: {
                enabled: true,
                provider: browserstack(),
                ui: false,
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
                                    os: 'Windows',
                                    osVersion: '10',
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
                                    os: 'Windows',
                                    osVersion: '10',
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
                                    os: 'Windows',
                                    osVersion: '10',
                                    browserVersion: 'latest-2',
                                },
                            },
                        }),
                    },
                    {
                        // oldest chrome supported by vitest
                        browser: 'browserstack:chrome-93',
                        provider: browserstack({
                            capabilities: {
                                browserName: 'Chrome',
                                'bstack:options': {
                                    os: 'Windows',
                                    osVersion: '10',
                                    browserVersion: '93',
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
                                    os: 'Windows',
                                    osVersion: '10',
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
                                    os: 'Windows',
                                    osVersion: '10',
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
                                    os: 'Windows',
                                    osVersion: '10',
                                    browserVersion: 'latest-2',
                                },
                            },
                        }),
                    },
                    {
                        // oldest firefox supported by vitest
                        browser: 'browserstack:firefox-92',
                        provider: browserstack({
                            capabilities: {
                                browserName: 'Firefox',
                                'bstack:options': {
                                    os: 'Windows',
                                    osVersion: '10',
                                    browserVersion: '92',
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
                                    browserVersion: 'latest',
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
