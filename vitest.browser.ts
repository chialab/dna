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
                name: 'chromium',
                provider: 'playwright',
            },
        },
    })
);
