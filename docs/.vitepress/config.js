import { defineConfig } from 'vitepress';
import llmstxt from 'vitepress-plugin-llms';

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: 'DNA',
    description: 'Progressive Web Components',
    base: '/dna/',
    outDir: '../public',

    vite: {
        plugins: [llmstxt()]
    },

    head: [
        ['link', { rel: 'icon', href: '/dna/favicon.png' }],
        ['script', {}, `var _paq = window._paq = window._paq || [];
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push(["setDomains", ["*.chialab.github.io/dna","*.chialab.github.io/loock","*.chialab.github.io/rna"]]);
    _paq.push(["disableCookies"]);
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    (function() {
        var u="https://analytics.chialab.io/";
        _paq.push(['setTrackerUrl', u+'matomo.php']);
        _paq.push(['setSiteId', '2']);
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
    })();`]
    ],

    themeConfig: {
        logo: '/chialab.svg',

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
                    { text: 'Loock', link: 'https://chialab.github.io/loock/' },
                    { text: 'RNA', link: 'https://chialab.github.io/rna/' },
                    { text: 'Catalog', link: 'https://catalog.chialab.io/' },
                    { text: 'Synapse', link: 'https://github.com/chialab/synapse/' },
                ],
            },
            {
                text: 'Chialab',
                link: 'https://www.chialab.it',
            },
        ],

        sidebar: [
            {
                text: 'Guide',
                items: [
                    { text: 'Why DNA', link: '/guide/why-dna' },
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
                        text: 'Testing',
                        link: '/guide/testing',
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
            copyright: 'Copyright © 2017-present Chialab',
        },
    },
    lastUpdated: true,
});
