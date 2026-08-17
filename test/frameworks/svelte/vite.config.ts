import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, mergeConfig } from 'vite';
import viteConfig from '../../../vite.config.ts';

export default defineConfig(
    mergeConfig(viteConfig, {
        plugins: [
            svelte({
                compilerOptions: {
                    customElement: true,
                },
            }),
        ],
    })
);
