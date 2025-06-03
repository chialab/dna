<script>
/**
 * @type {boolean}
 */
export let title;
</script>

<svelte-test-4>
    {#if title}
        <h1 slot="title">Title</h1>
    {/if}
    <img src="data:image/png;base64," alt="" />
    <p>Body</p>
</svelte-test-4>
