import { defineConfig, mergeConfig } from 'vitest/config';
import vitestConfig from './vitest.config';
import './test/providers/vitest-saucelabs-provider.d';

export default mergeConfig(
    vitestConfig,
    defineConfig({
        esbuild: {
            include: /\.(m?(t|j)s|[jt]sx)$/,
            target: ['es2020'],
        },
        test: {
            alias: {
                $env: './src/env.browser.ts',
            },
            coverage: {
                provider: 'istanbul',
            },
            browser: {
                enabled: true,
                provider: './test/providers/vitest-saucelabs-provider.ts',
                name: 'remote:chrome-latest',
                slowHijackESM: false,
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
                // oldest chrome supported by vitest
                'chrome-80': {
                    browserName: 'Chrome',
                    browserVersion: '80',
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
                // oldest firefox supported by vitest
                'firefox-90': {
                    browserName: 'Firefox',
                    browserVersion: '90',
                },
                'safari-latest': {
                    browserName: 'Safari',
                    browserVersion: 'latest',
                },
                'safari-15': {
                    browserName: 'Safari',
                    browserVersion: '15',
                },
                // oldest safari supported by vitest
                'safari-14': {
                    browserName: 'Safari',
                    browserVersion: '14',
                },
                'edge-latest': {
                    browserName: 'MicrosoftEdge',
                    browserVersion: 'latest',
                },
            },
        },
    })
);
