import { fileURLToPath } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';
import vue from '@vitejs/plugin-vue';
import { playwright } from '@vitest/browser-playwright';
import type { UserConfig } from 'vite';
import { defineConfig, mergeConfig } from 'vitest/config';
import vitestConfig from './vite.config';

export default mergeConfig(
    vitestConfig as UserConfig,
    defineConfig({
        plugins: [
            vue({
                template: {
                    compilerOptions: {
                        isCustomElement: (tag) => tag.startsWith('test-frameworks-'),
                    },
                },
            }),
            svelte(),
            svelteTesting(),
        ],
        optimizeDeps: {
            include: ['react/jsx-dev-runtime', 'preact/jsx-dev-runtime', 'vue'],
        },
        resolve: {
            conditions: ['browser'],
            alias: {
                '@chialab/dna/react': fileURLToPath(new URL('./src/frameworks/react.d.ts', import.meta.url)),
                '@chialab/dna/preact': fileURLToPath(new URL('./src/frameworks/preact.d.ts', import.meta.url)),
                '@chialab/dna/svelte': fileURLToPath(new URL('./src/frameworks/svelte.d.ts', import.meta.url)),
                // We need to define the cjs version of Vue to avoid issues with @testing-library/vue
                'vue': fileURLToPath(new URL('./node_modules/vue/dist/vue.cjs.js', import.meta.url)),
            },
        },
        test: {
            include: ['./**/*.spec.{js,ts,tsx}'],
            exclude: ['./node.spec.ts'],
            browser: {
                enabled: true,
                provider: playwright(),
                headless: true,
                fileParallelism: false,
                instances: [
                    {
                        browser: 'chromium',
                    },
                    {
                        browser: 'webkit',
                    },
                    {
                        browser: 'firefox',
                    },
                ],
            },
        },
    }) as UserConfig
);
