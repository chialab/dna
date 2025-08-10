<script lang="ts">
    let {
        collapsed,
    }: {
        collapsed?: boolean;
    } = $props();
</script>

<test-compat-3 collapsed={collapsed}>
    <h1>Title</h1>
    <img src="data:image/png;base64," alt="" />
    <p>Body</p>
</test-compat-3>
