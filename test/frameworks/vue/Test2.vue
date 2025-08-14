<template>
    <test-frameworks-1>{{ text }} children</test-frameworks-1>
</template>

<script lang="ts">
export default {
	props: {
		text: {
			type: String,
		},
	},
};
</script>
