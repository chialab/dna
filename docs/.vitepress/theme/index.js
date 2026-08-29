import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import Footer from './components/Footer.vue';
import Sandbox from './components/Sandbox.vue';
import { customSetup, files } from './sandboxes/hello-world.js';
import './theme.css';

export default {
    extends: DefaultTheme,
    Layout() {
        return h(DefaultTheme.Layout, null, {
            'home-features-after': () => [h(Sandbox, { files, customSetup })],
            'layout-bottom': () => h(Footer),
        });
    },
};
