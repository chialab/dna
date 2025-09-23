<template>
    <test-frameworks-1>
        Text
        <!-- eslint-disable-next-line -->
        <h1 v-if="title" slot="children">Title</h1>
        <!-- eslint-disable-next-line -->
        <h2 v-else slot="children">Subtitle</h2>
        end
    </test-frameworks-1>
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
