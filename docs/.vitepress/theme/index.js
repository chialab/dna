import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import CodeSanbox from './components/CodeSanbox.vue';
import Footer from './components/Footer.vue';
import './theme.css';

export default {
    extends: DefaultTheme,
    Layout() {
        return h(DefaultTheme.Layout, null, {
            'home-features-after': () => [h(CodeSanbox)],
            'layout-bottom': () => h(Footer),
        });
    },
};
