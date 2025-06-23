<template>
    <test-compat-1>{{ text }} children</test-compat-1>
</template>

<script lang="ts">
    export default {
        props: {
            text: {
                type: String,
            }
        },
    };
</script>
