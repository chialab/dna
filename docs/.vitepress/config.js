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

        search: {
            provider: 'algolia',
            options: {
                appId: 'WBLIAQCHBK',
                apiKey: '8e04392c95664ae9b73cc7a46c659ea9',
                indexName: 'vitejs',
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
                        text: 'Life cycle',
                        link: '/guide/life-cycle',
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
