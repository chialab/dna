import { defineConfig, mergeConfig } from 'vitest/config';
import vitestConfig from './vitest.config';

export default mergeConfig(
    vitestConfig,
    defineConfig({
        test: {
            alias: {
                $env: './src/env.browser.ts',
            },
            coverage: {
                provider: 'istanbul',
            },
            browser: {
                enabled: true,
                headless: true,
                provider: './test/providers/vitest-saucelabs-provider.ts',
                name: 'sauce:chrome-latest',
                api: {
                    host: '0.0.0.0',
                    port: 5176,
                },
            },
        },
        saucelabs: {
            capabilities: {
                'chrome-latest': {
                    browserName: 'Chrome',
                    browserVersion: 'latest',
                },
                'chrome-latest-1': {
                    browserName: 'Chrome',
                    browserVersion: 'latest-1',
                },
                'chrome-latest-2': {
                    browserName: 'Chrome',
                    browserVersion: 'latest-2',
                },
                'chrome-69': {
                    browserName: 'Chrome',
                    browserVersion: '69',
                },

                'firefox-latest': {
                    browserName: 'Firefox',
                    browserVersion: 'latest',
                },
                'firefox-latest-1': {
                    browserName: 'Firefox',
                    browserVersion: 'latest-1',
                },
                'firefox-latest-2': {
                    browserName: 'Firefox',
                    browserVersion: 'latest-2',
                },
                'firefox-78': {
                    browserName: 'Firefox',
                    browserVersion: '78',
                },

                'safari-latest': {
                    browserName: 'Safari',
                    browserVersion: '14',
                },
                'safari-latest-1': {
                    browserName: 'Safari',
                    browserVersion: '13',
                },
                'safari-12': {
                    browserName: 'Safari',
                    browserVersion: '12',
                },

                'edge-latest': {
                    browserName: 'Edge',
                    browserVersion: 'latest',
                },
                'edge-17': {
                    browserName: 'Edge',
                    browserVersion: '17.17134',
                },
                'edge-18': {
                    browserName: 'Edge',
                    browserVersion: '18.17763',
                },
            },
        },
    })
);
