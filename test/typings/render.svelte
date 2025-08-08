<script lang="ts">
    import '@chialab/dna/svelte';
    import './Component';
</script>
<div id="app">
    <details open></details>
    {/* @ts-expect-error Active is not a known property of the core details element */ null}
    <details active={true}></details>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <x-test
        class:test={true}
        style:color="red"
        active={true}
        width={4}
        title="test"
        onclick={(event) => {
            if (event.button === 0) {
                //
            }
        }}
        data-test="2"
        onselected={(event) => {
            if (event.detail === true) {
                //
            }
            // @ts-expect-error onselected expects a boolean, not a string
            if (event.detail === '') {
                //
            }
        }}
    ></x-test>
    {/* @ts-expect-error Width accepts only numbers */ null}
    <x-test width={true}></x-test>
    {/* @ts-expect-error Missing is not a known property of x-test */ null}
    <x-test missing={true}></x-test>
    {/* @ts-expect-error nodeType is an inherited read-only property */ null}
    <x-test nodeType={true}></x-test>
    {/* @ts-expect-error connectedCallback is a method */ null}
    <x-test connectedCallback={() => {}}></x-test>
    <!-- svelte-ignore attribute_avoid_is -->
    <details
        is="x-test-builtin"
        active={true}
        open
    ></details>
</div>
