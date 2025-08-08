<script>
/**
 * @type {boolean}
 */
export let title;
</script>

<test-compat-1>
    <span>Test</span>
    {#if title}<h1 slot="children">Title</h1>{/if}
    <span>Test</span>
    {#if title}<h2 slot="children">Title</h2>{/if}
    <span>Test</span>
</test-compat-1>
