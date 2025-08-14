<template>
    <test-frameworks-5
        @click="onClick"
        @stringchange="onStringChange"
        :stringProp="stringProp"
        :booleanProp="booleanProp"
        :numericProp="numericProp"
        :objectProp="objectProp"
        data-attr="test"
    ></test-frameworks-5>
</template>

<script lang="ts">
export default {
	props: {
		stringProp: {
            type: String,
        },
        booleanProp: {
            type: Boolean,
        },
        numericProp: {
            type: Number,
        },
        objectProp: {
            type: Object,
        },
        onClick: {
            type: Function,
        },
        onStringChange: {
            type: Function,
        },
	},
};
</script>
