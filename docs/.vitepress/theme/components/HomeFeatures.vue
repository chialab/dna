<template>
    <div class="container">
        <div class="content">
            <div class="features">
                <article>
                    <h3>Customized built-in elements</h3>
                    <p>DNA simplifies and promotes the usage of customized built-in elements. Customized built-in elements inherit methods and properties from standard HTML, preserving usability and accessibility features.</p>
                </article>
                <article>
                    <h3>Properties, states and attributes</h3>
                    <p>DNA provides <strong>@property</strong> and <strong>@state</strong> decorators to add reactivity to component's class fields. Every change is reflected to the component's template. Properties and states can be watched, synced with attributes and dispatch changes as events.</p>
                </article>
                <article>
                    <h3>Listeners and async events</h3>
                    <p>DNA uses event delegation to listen events from component's elements or slotted contents. It also provides a <strong>@listen</strong> decorator to simplify the event delegation process. Events can be async and can be dispatched from the component's class.</p>
                </article>
                <article>
                    <h3>Slots</h3>
                    <p>DNA does not use ShadowDOM to render slotted children, but a custom implementation named <strong>Quantum</strong>. This simplifies the usage of custom elements inside forms and provides a more flexible management of slotted contents. In fact, you can iterate, wrap, map or alter slotted elements. And differently from ShadowDOM, it also works for builtin elements, so you can use <strong>&lt;slot&gt;</strong> even inside buttons.</p>
                </article>
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

    .features {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
    }

    @media (max-width: 640px) {
        .features {
            grid-template-columns: 1fr;
        }
    }

    .features article {
        display: flex;
        flex-direction: column;
        padding: 24px;
        background-color: var(--vp-c-bg-soft);
        border: 1px solid var(--vp-c-bg-soft);
        border-radius: 12px;
    }

    .features h3 {
        line-height: 24px;
        font-size: 16px;
        font-weight: 600;
    }

    .features p {
        flex-grow: 1;
        padding-top: 8px;
        line-height: 24px;
        font-size: 14px;
        font-weight: 500;
        color: var(--vp-c-text-2);
    }
</style>
