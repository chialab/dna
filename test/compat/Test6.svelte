<script>
/**
 * @type {boolean}
 */
export let switchValue;
</script>

<test-compat-4 switch={switchValue}>
    {#if switchValue}World{:else}Hello{/if}
</test-compat-4>
