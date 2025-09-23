<script lang="ts">
    let {
        title,
    }: {
        title?: boolean;
    } = $props();
</script>

<test-frameworks-2>
    {#if title}
        <h1 slot="title">Title</h1>
    {/if}
    <img src="data:image/png;base64," alt="" />
    <p>Body</p>
</test-frameworks-2>
