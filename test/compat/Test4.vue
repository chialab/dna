<template>
    <test-compat-2>
        <!-- eslint-disable-next-line -->
        <h1 v-if="title" slot="title">Title</h1>
        <img src="data:image/png;base64," alt="" />
        <p>Body</p>
    </test-compat-2>
</template>

<script lang="ts">
    export default {
        props: {
            title: {
                type: Boolean,
            }
        },
    };
</script>
