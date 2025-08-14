<script lang="ts">
    let {
        switchValue,
    }: {
        switchValue?: boolean;
    } = $props();
</script>

<test-frameworks-4 switch={switchValue}>
    {#if switchValue}World{:else}Hello{/if}
</test-frameworks-4>
