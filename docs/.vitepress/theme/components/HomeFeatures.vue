<template>
    <div class="container">
        <div class="content">
            <div class="features">
                <article>
                    <h3>Customized built-in elements</h3>
                    <p
                        >DNA simplifies and encourages the use of customized built-in elements, which inherit methods
                        and properties from standard HTML, preserving usability and accessibility features.</p
                    >
                </article>
                <article>
                    <h3>Properties, states and attributes</h3>
                    <p
                        >DNA offers <strong>@property</strong> and <strong>@state</strong> decorators for adding
                        reactivity to a component's class fields, ensuring that any changes are reflected in the
                        component's template. These properties and states can be monitored, synchronized with
                        attributes, and trigger change events.</p
                    >
                </article>
                <article>
                    <h3>Listeners and async events</h3>
                    <p>
                        DNA uses event delegation for listening to events from a component's elements or slotted
                        contents, offering the <strong>@listen</strong> decorator to streamline the process. Events can
                        be asynchronous and dispatched from the component's class.</p
                    >
                </article>
                <article>
                    <h3>Slots</h3>
                    <p
                        >DNA uses <strong>Quantum</strong> instead of ShadowDOM to render slotted children, simplifying
                        the usage of custom elements inside forms and providing a more flexible management of slotted
                        contents. Unlike ShadowDOM, Quantum also works for built-in elements, allowing you to use
                        <strong>&lt;slot&gt;</strong> even inside buttons.</p
                    >
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
