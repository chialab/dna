<script lang="ts">
    import type { Snippet } from 'svelte';

    let {
        stringProp,
        booleanProp,
        numericProp,
        objectProp,
        onClick,
        onStringChange,
        children,
        icon,
    }: {
        stringProp?: string;
        booleanProp?: boolean;
        numericProp?: number;
        objectProp?: object;
        onClick?: (event: MouseEvent) => void;
        onStringChange?: (event: CustomEvent<string>) => void;
        children?: Snippet;
        icon?: Snippet;
    } = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<test-frameworks-5
    stringProp={stringProp}
    booleanProp={booleanProp}
    numericProp={numericProp}
    objectProp={objectProp}
    onclick={onClick}
    onstringchange={onStringChange}
    data-attr="test"
>
    {@render icon?.()}
    {@render children?.()}
</test-frameworks-5>
