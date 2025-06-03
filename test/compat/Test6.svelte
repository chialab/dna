<script>
/**
 * @type {boolean}
 */
export let switchValue;
</script>

<svelte-test-6 switch={switchValue}>
    {#if switchValue}World{:else}Hello{/if}
</svelte-test-6>
