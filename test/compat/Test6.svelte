<script lang="ts">
    let {
        switchValue,
    }: {
        switchValue?: boolean;
    } = $props();
</script>

<test-compat-4 switch={switchValue}>
    {#if switchValue}World{:else}Hello{/if}
</test-compat-4>
