<script lang="ts">
    let {
        collapsed,
    }: {
        collapsed?: boolean;
    } = $props();
</script>

<test-frameworks-3 collapsed={collapsed}>
    <h1>Title</h1>
    <img src="data:image/png;base64," alt="" />
    <p>Body</p>
</test-frameworks-3>
