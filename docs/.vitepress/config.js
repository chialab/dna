import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: 'DNA',
    description: 'Progressive Web Components',
    base: '/dna/',
    outDir: '../public',

    head: [['link', { rel: 'icon', href: 'https://www.chialab.it/favicon.png' }]],

    themeConfig: {
        logo: 'https://raw.githubusercontent.com/chialab/dna/main/logo.svg',

        editLink: {
            pattern: 'https://github.com/chialab/dna/edit/main/docs/:path',
            text: 'Suggest changes to this page',
        },

        search: {
            provider: 'algolia',
            options: {
                appId: 'WBLIAQCHBK',
                apiKey: 'a2567fb662c4f0da10b5385512d00995',
                indexName: 'dna-guide',
            },
        },

        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {
                text: 'Home',
                link: '/',
            },
            {
                text: 'Guide',
                link: '/guide/',
            },
            {
                text: 'Ecosystem',
                items: [
                    { text: 'Quantum', link: 'https://chialab.github.io/quantum/' },
                    { text: 'Plasma', link: 'https://chialab.github.io/plasma/' },
                    { text: 'Loock', link: 'https://chialab.github.io/loock/' },
                    { text: 'Synapse', link: 'https://github.com/chialab/synapse/' },
                ],
            },
            {
                text: 'Chialab.io',
                link: 'https://www.chialab.io',
            },
        ],

        sidebar: [
            {
                text: 'Guide',
                items: [
                    {
                        text: 'Get started',
                        link: '/guide/',
                    },
                    {
                        text: 'Reactive properties',
                        link: '/guide/properties',
                    },
                    {
                        text: 'Lifecycle',
                        link: '/guide/lifecycle',
                    },
                    {
                        text: 'Events',
                        link: '/guide/events',
                    },
                    {
                        text: 'Rendering',
                        link: '/guide/rendering',
                    },
                    {
                        text: 'Styling',
                        link: '/guide/styling',
                    },
                    {
                        text: 'Integrations',
                        link: '/guide/integrations',
                    },
                    {
                        text: 'Tools',
                        link: '/guide/tools',
                    },
                ],
            },
        ],

        socialLinks: [
            {
                icon: 'github',
                link: 'https://github.com/chialab/dna',
            },
        ],

        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2023 - DNA project - Chialab',
        },
    },
    lastUpdated: true,
});
