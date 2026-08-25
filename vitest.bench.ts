import { playwright } from '@vitest/browser-playwright';
import type { UserConfig } from 'vite';
import { defineConfig, mergeConfig } from 'vitest/config';
import vitestConfig from './vite.config.ts';

export default mergeConfig(
    vitestConfig as UserConfig,
    defineConfig({
        resolve: {
            conditions: ['browser'],
        },
        server: {
            headers: {
                'Cross-Origin-Opener-Policy': 'same-origin',
                'Cross-Origin-Embedder-Policy': 'require-corp',
            },
        },
        test: {
            typecheck: {
                enabled: false,
            },
            benchmark: {
                include: ['./**/*.bench.{ts,tsx}'],
                reporters: ['default'],
            },
            browser: {
                enabled: true,
                provider: playwright(),
                headless: true,
                fileParallelism: false,
                instances: [
                    {
                        browser: 'chromium',
                    },
                ],
            },
        },
    }) as UserConfig
);
