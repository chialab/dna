<script lang="ts">
    let {
        title,
    }: {
        title?: boolean;
    } = $props();
</script>

<test-frameworks-1>
    <span>Test</span>
    {#if title}<h1 slot="children">Title</h1>{/if}
    <span>Test</span>
    {#if title}<h2 slot="children">Title</h2>{/if}
    <span>Test</span>
</test-frameworks-1>
