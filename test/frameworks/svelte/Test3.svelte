<script lang="ts">
    let {
        title,
    }: {
        title?: boolean;
    } = $props();
</script>

<test-frameworks-1>
    Text
    {#if title}
        <h1 slot="children">Title</h1>
    {:else}
        <h2 slot="children">Subtitle</h2>
    {/if}
    end
</test-frameworks-1>
