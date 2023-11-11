import { defineConfig, mergeConfig } from 'vitest/config';
import vitestConfig from './vitest.config';

export default mergeConfig(
    vitestConfig,
    defineConfig({
        test: {
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
