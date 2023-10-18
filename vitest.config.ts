import { defineConfig } from 'vitest/config';

const job = (() => {
    if (process.env.TRAVIS) {
        return `TRAVIS ${process.env.TRAVIS_BUILD_ID}#${process.env.TRAVIS_BUILD_NUMBER}`;
    }
    if (process.env.GITLAB_CI) {
        return `GITLAB ${process.env.CI_JOB_ID}#${process.env.CI_JOB_NAME}`;
    }
    if (process.env.GITHUB_ACTIONS) {
        return `GITHUB ${process.env.GITHUB_JOB}#${process.env.GITHUB_RUN_NUMBER}`;
    }

    return null;
})();

export default defineConfig({
    test: {
        name: `DNA${job ? ` (${job})` : ''}`,
        dir: './test',
        include: ['./*.spec.js'],
        alias: {
            '@chialab/dna': './src/index.ts',
        },
    },
});
