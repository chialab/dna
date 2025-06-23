<template>
    <test-compat-1>
        <span>Test</span>
        <!-- eslint-disable-next-line -->
        <h1 v-if="title" slot="children">Title</h1>
        <span>Test</span>
        <!-- eslint-disable-next-line -->
        <h2 v-if="title" slot="children">Title</h2>
        <span>Test</span>
    </test-compat-1>
</template>

<script lang="ts">
export default {
	props: {
		title: {
			type: Boolean,
		},
	},
};
</script>
