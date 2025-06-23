<template>
    <test-compat-4 :switch="switchValue">
        <template v-if="switchValue">
            World
        </template>
        <template v-else>
            Hello
        </template>
    </test-compat-4>
</template>

<script lang="ts">
export default {
	props: {
		switchValue: {
			type: Boolean,
		},
	},
};
</script>
