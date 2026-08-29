<script setup>
    import { useData } from 'vitepress';
    import { computed, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue';
    import { SANDPACK_THEMES_CDN_URL, SANDPACK_VUE3_CDN_URL, VUE_CDN_URL } from '../cdn.js';

    const props = defineProps({
        template: {
            type: String,
            default: 'vanilla-ts',
        },
        files: {
            type: Object,
            required: true,
        },
        customSetup: {
            type: Object,
            default: () => ({}),
        },
        options: {
            type: Object,
            default: () => ({}),
        },
    });

    const { isDark } = useData();
    const mount = shallowRef(null);
    const ready = shallowRef(false);
    const fallback = computed(() => {
        const entries = Object.values(props.files);
        const active = entries.find((file) => file?.active);
        return (active ?? entries[0])?.code ?? '';
    });

    let sandboxApp;

    async function renderSandbox() {
        const [{ createApp, h }, { Sandpack }, { githubLight, monokaiPro }] = await Promise.all([
            import(/* @vite-ignore */ VUE_CDN_URL),
            import(/* @vite-ignore */ SANDPACK_VUE3_CDN_URL),
            import(/* @vite-ignore */ SANDPACK_THEMES_CDN_URL),
        ]);

        sandboxApp?.unmount();
        sandboxApp = createApp({
            render: () =>
                h(Sandpack, {
                    template: props.template,
                    files: props.files,
                    customSetup: props.customSetup,
                    theme: isDark.value ? monokaiPro : githubLight,
                    options: {
                        editorHeight: 512,
                        editorWidthPercentage: 50,
                        showLineNumbers: true,
                        showTabs: false,
                        wrapContent: true,
                        showNavigator: false,
                        showRestartButton: false,
                        showRefreshButton: false,
                        showOpenInCodeSandbox: false,
                        ...props.options,
                    },
                }),
        });
        sandboxApp.mount(mount.value);
        ready.value = true;
    }

    onMounted(() => {
        renderSandbox().catch((error) => console.error('Failed to load the sandbox', error));
    });
    watch(isDark, () => {
        renderSandbox().catch((error) => console.error('Failed to load the sandbox', error));
    });
    onBeforeUnmount(() => sandboxApp?.unmount());
</script>

<template>
    <div class="code-sandbox">
        <div
            v-show="ready"
            ref="mount"
            class="code-sandbox-mount" />
        <pre
            v-if="!ready"
            class="code-placeholder"><code>{{ fallback }}</code></pre>
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
