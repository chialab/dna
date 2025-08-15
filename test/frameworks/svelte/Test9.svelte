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

<!-- svelte-ignore attribute_avoid_is -->
 <!-- @TODO https://github.com/sveltejs/language-tools/pull/2824 -->
<!-- <a is="test-frameworks-6"
    href="/#"
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
</a> -->
