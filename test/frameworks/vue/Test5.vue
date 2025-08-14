<template>
    <test-frameworks-3 :collapsed="collapsed">
        <h1>Title</h1>
        <img src="data:image/png;base64," alt="" />
        <p>Body</p>
    </test-frameworks-3>
</template>

<script lang="ts">
export default {
	props: {
		collapsed: {
			type: Boolean,
		},
	},
};
</script>
