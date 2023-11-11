<template>
    <div class="container">
        <div class="content">
            <div class="window-frame">
                <div class="window-controls">
                    <div class="window-buttons">
                        <span class="close"></span>
                        <span class="minimise"></span>
                        <span class="maximise"></span>
                    </div>
                    <span class="window-filename">BestCodingAppEver</span>
                </div>
                <iframe
                    src="https://stackblitz.com/edit/dna-sandbox?embed=1&file=HelloWorld.tsx&hideExplorer=1&hideNavigation=1"></iframe>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .container {
        padding: 0 16px;
    }

    .content {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin: 16px auto 0;
        max-width: 1152px;
    }

    .window-frame {
        width: 100%;
        border-radius: 12px;
        box-shadow: 0 0 3px var(--vp-c-bg-soft);
        border: solid 1px var(--vp-c-bg-soft);
        overflow: hidden;
    }

    .window-controls {
        display: flex;
        align-items: center;
        padding: 12px 24px;
        color: var(--vp-c-text-2);
        background: var(--vp-c-bg-soft);
        border-bottom: solid 1px rgba(0, 0, 0, 0.1);
    }

    .window-buttons {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .window-buttons span {
        display: inline-block;
        width: 15px;
        height: 15px;
        border-radius: 50px;
    }

    .window-buttons span.close {
        background: #ff8585;
    }

    .window-buttons span.minimise {
        background: #ffd071;
    }

    .window-buttons span.maximise {
        background: #74ed94;
    }

    .window-filename {
        flex: 1 auto;
        text-align: center;
    }

    iframe {
        width: 100%;
        height: 512px;
        aspect-ratio: 16 / 9;
        border: 0;
    }
</style>
