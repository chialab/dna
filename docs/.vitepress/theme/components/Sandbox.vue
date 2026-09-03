<script>
    const ESBUILD_WASM_VERSION = '0.28.2';
    const ESBUILD_WASM_CDN_URL = `https://esm.sh/esbuild-wasm@${ESBUILD_WASM_VERSION}`;
    const ESBUILD_WASM_BINARY_URL = `https://esm.sh/esbuild-wasm@${ESBUILD_WASM_VERSION}/esbuild.wasm`;

    function languageForPath(path, { javascript, css, html }) {
        if (/\.(tsx?|jsx?|mjs|cjs|json)$/.test(path)) {
            return javascript({ jsx: true, typescript: /\.tsx?$/.test(path) });
        }
        if (/\.css$/.test(path)) {
            return css();
        }
        if (/\.html?$/.test(path)) {
            return html();
        }
        return [];
    }

    let esbuildPromise = null;

    function loadEsbuild() {
        if (!esbuildPromise) {
            esbuildPromise = import(/* @vite-ignore */ ESBUILD_WASM_CDN_URL).then(async (module) => {
                const esbuild = module.default;
                await esbuild.initialize({ wasmURL: ESBUILD_WASM_BINARY_URL });
                return esbuild;
            });
        }
        return esbuildPromise;
    }
</script>

<script setup>
    import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

    const props = defineProps({
        files: {
            type: Object,
            required: true,
        },
        customSetup: {
            type: Object,
            default: () => ({}),
        },
    });

    function findDefaultPath() {
        const entries = Object.entries(props.files).filter(([, file]) => !file?.hidden);
        return (entries.find(([, file]) => file?.active) ?? entries[0])?.[0] ?? '';
    }

    const tabs = computed(() => Object.keys(props.files).filter((path) => !props.files[path]?.hidden));
    const currentPath = ref(findDefaultPath());
    const currentCode = computed(() => props.files[currentPath.value]?.code ?? '');
    const currentReadOnly = computed(() => !!props.files[currentPath.value]?.readOnly);
    const ready = ref(false);
    const editorContainer = ref(null);
    const previewFrame = ref(null);
    const editorStates = new Map();

    let editorView = null;
    let esbuild = null;
    let updateTimer = null;
    let cm = null;

    function createVirtualFsPlugin(files) {
        return {
            name: 'virtual-fs',
            setup(build) {
                build.onResolve({ filter: /.*/ }, (args) => {
                    if (args.kind === 'entry-point') {
                        return { path: args.path, namespace: 'sandbox' };
                    }
                    if (args.path.startsWith('.')) {
                        const base = new URL(args.path, `file://${args.importer}`).pathname.replace(/^\//, '');
                        const candidate = ['', '.tsx', '.ts', '.jsx', '.js', '.css'].map((ext) => base + ext).find((path) => files[path]);
                        if (candidate) {
                            return { path: candidate, namespace: 'sandbox' };
                        }
                    }
                    return { path: args.path, external: true };
                });
                build.onLoad({ filter: /.*/, namespace: 'sandbox' }, (args) => {
                    const loader = args.path.match(/\.(tsx|ts|jsx|js|css|json)$/)?.[1] ?? 'text';
                    return { contents: files[args.path]?.code ?? '', loader };
                });
            },
        };
    }

    function buildImportMap(dependencies = {}) {
        const imports = {};
        for (const [name, range] of Object.entries(dependencies)) {
            const base = `https://esm.sh/${name}@${range}`;
            imports[name] = base;
            imports[`${name}/`] = `${base}/`;
        }
        return { imports };
    }

    function escapeRegExp(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function escapeHtml(value) {
        return value.replace(/[&<>]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[char]);
    }

    function buildPreviewHtml({ indexHtml, importMap, css, entry, js }) {
        const head = `<script type="importmap">${JSON.stringify(importMap)}<\/script>${css ? `<style>${css}</style>` : ''}`;
        const entryScriptPattern = new RegExp(`<script[^>]*\\ssrc=["'](?:\.\/|\/)?${escapeRegExp(entry)}["'][^>]*><\\/script>`);

        return indexHtml
            .replace('<head>', `<head>${head}`)
            .replace(entryScriptPattern, `<script type="module">${js}<\/script>`);
    }

    function buildErrorHtml(error) {
        const message = (error.errors ?? [{ text: error.message }]).map((item) => item.text).join('\n');
        return `<!doctype html><body style="margin:0;padding:16px;background:var(--vp-c-bg);color:#c0392b;font-family:monospace;white-space:pre-wrap;font-size:13px;">${escapeHtml(message)}</body>`;
    }

    async function buildPreview() {
        const files = { ...props.files };
        for (const [path, state] of editorStates) {
            files[path] = { ...files[path], code: state.doc.toString() };
        }
        try {
            const result = await esbuild.build({
                entryPoints: [props.customSetup.entry],
                bundle: true,
                write: false,
                format: 'esm',
                outdir: '/out',
                target: 'es2022',
                tsconfigRaw: props.files['tsconfig.json']?.code,
                plugins: [createVirtualFsPlugin(files)],
            });
            const js = result.outputFiles.find((file) => file.path.endsWith('.js'))?.text ?? '';
            const css = result.outputFiles.find((file) => file.path.endsWith('.css'))?.text ?? '';
            const indexHtml = files['index.html']?.code ?? '<!doctype html><html><head></head><body></body></html>';
            previewFrame.value.srcdoc = buildPreviewHtml({
                indexHtml,
                importMap: buildImportMap(props.customSetup.dependencies),
                css,
                entry: props.customSetup.entry,
                js,
            });
        } catch (error) {
            previewFrame.value.srcdoc = buildErrorHtml(error);
        }
    }

    function scheduleSandboxUpdate() {
        clearTimeout(updateTimer);
        updateTimer = setTimeout(() => buildPreview(), 400);
    }

    function createEditorState(path) {
        const file = props.files[path] ?? {};
        return cm.EditorState.create({
            doc: file.code ?? '',
            extensions: [
                cm.basicSetup,
                languageForPath(path, cm.langModule),
                cm.syntaxHighlighting(cm.highlightStyle),
                cm.EditorState.readOnly.of(!!file.readOnly),
                cm.chromeTheme,
                cm.EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        // EditorState is immutable: every change produces a new state object,
                        // so the cache has to be re-pointed at it or buildPreview() would keep
                        // reading the stale, original content for this file.
                        editorStates.set(path, update.state);
                        scheduleSandboxUpdate();
                    }
                }),
            ],
        });
    }

    function selectFile(path) {
        if (!editorView || path === currentPath.value) {
            return;
        }
        if (!editorStates.has(path)) {
            editorStates.set(path, createEditorState(path));
        }
        editorView.setState(editorStates.get(path));
        currentPath.value = path;
    }

    onMounted(async () => {
        const [
            { basicSetup, EditorView },
            { EditorState },
            { syntaxHighlighting, HighlightStyle },
            { javascript },
            { css },
            { html },
            { tags },
            esbuildInstance,
        ] = await Promise.all([
            import(/* @vite-ignore */ 'https://esm.sh/codemirror'),
            import(/* @vite-ignore */ 'https://esm.sh/@codemirror/state'),
            import(/* @vite-ignore */ 'https://esm.sh/@codemirror/language'),
            import(/* @vite-ignore */ 'https://esm.sh/@codemirror/lang-javascript'),
            import(/* @vite-ignore */ 'https://esm.sh/@codemirror/lang-css'),
            import(/* @vite-ignore */ 'https://esm.sh/@codemirror/lang-html'),
            import(/* @vite-ignore */ 'https://esm.sh/@lezer/highlight'),
            loadEsbuild(),
        ]).catch((error) => {
            console.error('Failed to load the sandbox from the CDN', error);
            return [];
        });

        if (!basicSetup || !editorContainer.value || !previewFrame.value) {
            return;
        }

        esbuild = esbuildInstance;
        cm = {
            EditorState,
            EditorView,
            basicSetup,
            langModule: { javascript, css, html },
            syntaxHighlighting: syntaxHighlighting,
            highlightStyle: HighlightStyle.define([
                { tag: tags.keyword, color: 'var(--cm-keyword)' },
                { tag: [tags.atom, tags.number, tags.bool], color: 'var(--cm-static)' },
                { tag: tags.variableName, color: 'var(--cm-plain)' },
                { tag: [tags.function(tags.variableName), tags.definition(tags.function(tags.variableName))], color: 'var(--cm-definition)' },
                { tag: tags.tagName, color: 'var(--cm-tag)' },
                { tag: tags.propertyName, color: 'var(--cm-property)' },
                { tag: [tags.literal, tags.inserted, tags.string], color: 'var(--cm-string)' },
                { tag: tags.punctuation, color: 'var(--cm-punctuation)' },
                { tag: [tags.comment, tags.quote], color: 'var(--cm-comment)', fontStyle: 'italic' },
            ]),
            chromeTheme: EditorView.theme({
                '&': { height: '100%', fontSize: '13px' },
                '.cm-content': { fontFamily: 'var(--vp-font-family-mono)', caretColor: 'var(--vp-c-brand-1)' },
                '.cm-scroller': { fontFamily: 'var(--vp-font-family-mono)', lineHeight: '1.6' },
                '.cm-gutters': { backgroundColor: 'transparent', color: 'var(--vp-c-text-3)', border: 'none' },
                '.cm-activeLine': { backgroundColor: 'var(--vp-c-bg-soft)' },
                '.cm-activeLineGutter': { backgroundColor: 'var(--vp-c-bg-soft)' },
                '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
                    backgroundColor: 'var(--vp-c-bg-mute) !important',
                },
            }),
        };

        editorStates.set(currentPath.value, createEditorState(currentPath.value));
        editorView = new EditorView({
            parent: editorContainer.value,
            state: editorStates.get(currentPath.value),
        });

        ready.value = true;
        buildPreview();
    });

    onBeforeUnmount(() => {
        clearTimeout(updateTimer);
        editorView?.destroy();
    });
</script>

<template>
    <div class="code-sandbox">
        <ClientOnly>
            <div
                class="sandbox-layout"
                v-show="ready">
                <div class="sandbox-editor">
                    <div
                        class="sandbox-tabs"
                        role="tablist">
                        <button
                            v-for="path in tabs"
                            :key="path"
                            type="button"
                            role="tab"
                            :aria-selected="path === currentPath"
                            :class="['sandbox-tab', { active: path === currentPath }]"
                            @click="selectFile(path)">
                            {{ path.replace(/^\//, '') }}
                            <span
                                v-if="props.files[path]?.readOnly"
                                class="sandbox-tab-lock"
                                title="Read-only"
                                aria-label="Read-only">🔒</span>
                        </button>
                    </div>
                    <div
                        class="sandbox-editor-view-wrapper">
                        <div
                            ref="editorContainer"
                            class="sandbox-editor-view" />
                        <span
                            v-if="currentReadOnly"
                            class="sandbox-readonly-badge">Read-only</span>
                    </div>
                </div>
                <iframe
                    ref="previewFrame"
                    class="sandbox-preview"
                    title="Sandbox preview"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups" />
            </div>
            <pre
                v-show="!ready"
                class="code-placeholder"><code>{{ currentCode }}</code></pre>
            <template #fallback>
                <pre class="code-placeholder"><code>{{ currentCode }}</code></pre>
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

    .sandbox-layout {
        display: flex;
        height: 512px;
        background: var(--vp-c-bg);
    }

    .sandbox-editor {
        display: flex;
        flex-direction: column;
        flex: 1 1 50%;
        min-width: 0;
        border-right: 1px solid var(--vp-c-divider);
    }

    .sandbox-tabs {
        display: flex;
        flex: none;
        overflow-x: auto;
        border-bottom: 1px solid var(--vp-c-divider);
        background: var(--vp-c-bg-alt);
    }

    .sandbox-tab {
        flex: none;
        padding: 8px 16px;
        border: 0;
        border-bottom: 2px solid transparent;
        background: none;
        color: var(--vp-c-text-2);
        font-family: var(--vp-font-family-mono);
        font-size: 12px;
        cursor: pointer;
    }

    .sandbox-tab:hover {
        color: var(--vp-c-text-1);
    }

    .sandbox-tab.active {
        border-bottom-color: var(--vp-c-brand-1);
        color: var(--vp-c-text-1);
    }

    .sandbox-tab-lock {
        margin-left: 4px;
        font-size: 10px;
        vertical-align: 1px;
    }

    .sandbox-editor-view-wrapper {
        position: relative;
        display: flex;
        flex: 1 1 auto;
        min-height: 0;
    }

    .sandbox-editor-view {
        flex: 1 1 auto;
        min-width: 0;
        overflow: auto;
    }

    .sandbox-editor-view :deep(.cm-editor) {
        height: 100%;
    }

    .sandbox-readonly-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 2px 8px;
        border-radius: 999px;
        background: var(--vp-c-bg-mute);
        color: var(--vp-c-text-2);
        font-family: var(--vp-font-family-mono);
        font-size: 11px;
        pointer-events: none;
    }

    .sandbox-preview {
        flex: 1 1 50%;
        min-width: 0;
        height: 100%;
        border: 0;
        background: #fff;
    }

    @media (max-width: 40rem) {
        .sandbox-layout {
            flex-direction: column;
            height: auto;
        }

        .sandbox-editor {
            flex: none;
            height: 280px;
            border-right: none;
            border-bottom: 1px solid var(--vp-c-divider);
        }

        .sandbox-preview {
            flex: none;
            height: 280px;
        }
    }

    .sandbox-editor-view :deep(*)::-webkit-scrollbar {
        width: 12px;
        height: 12px;
        background: transparent;
    }

    .sandbox-editor-view :deep(*)::-webkit-scrollbar-track,
    .sandbox-editor-view :deep(*)::-webkit-scrollbar-corner {
        background: transparent;
    }

    .sandbox-editor-view :deep(*)::-webkit-scrollbar-thumb {
        min-width: 32px;
        min-height: 32px;
        border: solid 3px transparent;
        border-radius: 12px;
        background-color: color-mix(in srgb, var(--vp-c-text-1) 18%, transparent);
        background-clip: padding-box;
        transition: background-color 0.2s ease;
    }

    .sandbox-editor-view :deep(*)::-webkit-scrollbar-thumb:hover {
        background-color: color-mix(in srgb, var(--vp-c-text-1) 32%, transparent);
    }

    .sandbox-editor-view :deep(*)::-webkit-scrollbar-thumb:active {
        background-color: color-mix(in srgb, var(--vp-c-brand-1) 70%, transparent);
    }

    @supports not selector(::-webkit-scrollbar) {
        .sandbox-editor-view :deep(*) {
            scrollbar-width: thin;
            scrollbar-color: color-mix(in srgb, var(--vp-c-text-1) 18%, transparent) transparent;
        }
    }
</style>
