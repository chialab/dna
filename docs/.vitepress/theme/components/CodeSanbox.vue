<script setup>
    import { useData } from 'vitepress';
    import { defineAsyncComponent } from 'vue';
    import { githubLight, monokaiPro } from '@codesandbox/sandpack-themes';

    const { isDark } = useData();
    const Sandpack = defineAsyncComponent(() => import('sandpack-vue3').then((mod) => mod.Sandpack));
    const component = `import {
    Component,
    customElement,
    listen,
    property
} from '@chialab/dna';

@customElement('hello-world')
export class HelloWorld extends Component {
    /* define an observable property */
    @property() name = '';

    render() {
        return (
            <>
                <h1>Hello {this.name || 'World'}!</h1>
                <input
                    name="firstName"
                    placeholder="Type your name"
                    value={this.name}
                />
            </>
        );
    }

    /* listen input changes */
    @listen('input', 'input[name="firstName"]')
    protected onInputChange(event: Event, target: HTMLInputElement) {
        this.name = target.value;
    }
}
`;

    const files = {
        '/HelloWorld.tsx': { code: component, active: true },
        '/index.ts': {
            code: `import { render } from '@chialab/dna';
import { HelloWorld } from './HelloWorld';
import './styles.css';

document.getElementById('app').append(new HelloWorld());`,
            readOnly: true,
        },
        '/styles.css': {
            code: `
html {
    color-scheme: light dark;
    background: transparent;
    color: #3c3c43;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

body {
    margin: 0;
    padding: 2em;
}

h1 {
    margin: 0 0 0.5em;
    font-size: 1.75em;
}

input {
    padding: 0.5em 0.75em;
    border: solid 1px #c2c2c4;
    border-radius: 6px;
    background-color: #ffffff;
    color: inherit;
    font-size: inherit;
    font-family: inherit;
}

@media (prefers-color-scheme: dark) {
    html {
        color: #dfdfd6;
    }

    input {
        border-color: #3c3f44;
        background-color: #202127;
    }
}`,
            hidden: true
        },
        '/tsconfig.json': {
            code: JSON.stringify({
                compilerOptions: {
                    moduleResolution: 'bundler',
                    experimentalDecorators: true,
                    useDefineForClassFields: false,
                    jsx: 'react-jsx',
                    jsxImportSource: '@chialab/dna',
                }
            }),
            hidden: true,
        },
        '/index.html': {
            code: `<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>DNA sandbox</title>
    </head>
    <body>
        <div id="app"></div>
        <script type="module" src="/index.ts"><\/script>
    </body>
</html>`,
            hidden: true,
        },
        '/sandbox.config.json': {
            code: JSON.stringify({
                hardReloadOnChange: true
            }),
            hidden: true
        },
    };

    const customSetup = {
        entry: '/index.ts',
        dependencies: {
            '@chialab/dna': '^4.0.0',
        },
    };
</script>

<template>
    <div class="code-sandbox">
        <ClientOnly>
            <Sandpack
                template="vanilla-ts"
                :files="files"
                :custom-setup="customSetup"
                :theme="isDark ? monokaiPro : githubLight"
                :options="{
                    editorHeight: 512,
                    editorWidthPercentage: 50,
                    showLineNumbers: true,
                    showTabs: false,
                    wrapContent: true,
                    showNavigator: false,
                    showRestartButton: false,
                    showRefreshButton: false,
                    showOpenInCodeSandbox: false,
                }" />
            <template #fallback>
                <pre class="code-placeholder"><code>{{ component }}</code></pre>
            </template>
        </ClientOnly>
    </div>
</template>

<style scoped>
    .code-placeholder {
        margin: 0;
        padding: 16px 24px;
        height: 440px;
        overflow: hidden;
        background: var(--vp-c-bg-alt);
        color: var(--vp-c-text-2);
        font-family: var(--vp-font-family-mono);
        font-size: 13px;
        line-height: 1.6;
    }

    .code-sandbox :deep(.sp-wrapper) {
        --sp-space-1: 4px;
        --sp-colors-disabled: var(--vp-c-text-2);
        --sp-colors-surface1: transparent;
        --sp-colors-surface2: transparent;
        --scrollbar-size: 12px;
        --scrollbar-inset: 3px;
        --scrollbar-thumb: color-mix(in srgb, var(--vp-c-text-1) 18%, transparent);
        --scrollbar-thumb-hover: color-mix(in srgb, var(--vp-c-text-1) 32%, transparent);
        --scrollbar-thumb-active: color-mix(in srgb, var(--vp-c-brand-1) 70%, transparent);

        background: var(--vp-c-bg);
    }

    .code-sandbox :deep(.sp-layout) {
        border: 0;
        border-radius: 0;
    }

    .code-sandbox :deep(.cm-gutter.cm-lineNumbers) {
        font-size: 0.875em;
    }

    .code-sandbox :deep(.sp-preview-container) {
        background: var(--vp-c-bg);
    }

    .code-sandbox :deep(.sp-preview-actions) {
        display: none;
    }

    .code-sandbox :deep(.sp-stack:hover) {
        --scrollbar-thumb: var(--scrollbar-thumb-hover);
    }

    .code-sandbox :deep(.sp-wrapper *)::-webkit-scrollbar {
        width: var(--scrollbar-size);
        height: var(--scrollbar-size);
        background: transparent;
    }

    .code-sandbox :deep(.sp-wrapper *)::-webkit-scrollbar-track,
    .code-sandbox :deep(.sp-wrapper *)::-webkit-scrollbar-corner {
        background: transparent;
    }

    .code-sandbox :deep(.sp-wrapper *)::-webkit-scrollbar-thumb {
        min-width: 32px;
        min-height: 32px;
        border: solid var(--scrollbar-inset) transparent;
        border-radius: var(--scrollbar-size);
        background-color: var(--scrollbar-thumb);
        background-clip: padding-box;
        transition: background-color 0.2s ease;
    }

    .code-sandbox :deep(.sp-wrapper *)::-webkit-scrollbar-thumb:hover {
        background-color: var(--scrollbar-thumb-hover);
    }

    .code-sandbox :deep(.sp-wrapper *)::-webkit-scrollbar-thumb:active {
        background-color: var(--scrollbar-thumb-active);
    }

    @supports not selector(::-webkit-scrollbar) {
        .code-sandbox :deep(.sp-wrapper *) {
            scrollbar-width: thin;
            scrollbar-color: var(--scrollbar-thumb) transparent;
        }
    }
</style>
