import type { UserConfig } from 'vite';
import { defineConfig, mergeConfig } from 'vitest/config';
import vitestConfig from './vite.config';

export default mergeConfig(
    vitestConfig as UserConfig,
    defineConfig({
        test: {
            include: ['./module.spec.ts', './node.spec.ts'],
            typecheck: {
                enabled: false,
            },
        },
    }) as UserConfig
);
