<script lang="ts">
    let {
        title,
    }: {
        title?: boolean;
    } = $props();
</script>

<test-compat-1>
    Text
    {#if title}
        <h1 slot="children">Title</h1>
    {:else}
        <h2 slot="children">Subitle</h2>
    {/if}
    end
</test-compat-1>
