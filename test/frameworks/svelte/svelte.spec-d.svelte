<script lang="ts">
    import '@chialab/dna/svelte';
    import '../TestElements';
</script>
<div id="app">
    <a href="#/">Test</a>
    {/* @ts-expect-error Active is not a known property of the core details element */ null}
    <a href="#/" booleanProp={true}>Test</a>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <test-frameworks-5
        class:test={true}
        style:color="red"
        booleanProp={true}
        numericProp={4}
        title="test"
        onclick={(event) => {
            if (event.button === 0) {
                //
            }
        }}
        data-test="2"
        onstringchange={(event) => {
            if (event.detail === '') {
                //
            }
            // @ts-expect-error onselected expects a string, not a boolean
            if (event.detail === true) {
                //
            }
        }}
    ></test-frameworks-5>
    {/* @ts-expect-error numericProp accepts only numbers */ null}
    <test-frameworks-5 numericProp={true}></test-frameworks-5>
    {/* @ts-expect-error Missing is not a known property of test-frameworks-5 */ null}
    <test-frameworks-5 missing={true}></test-frameworks-5>
    {/* @ts-expect-error nodeType is an inherited read-only property */ null}
    <test-frameworks-5 nodeType={true}></test-frameworks-5>
    {/* @ts-expect-error connectedCallback is a method */ null}
    <test-frameworks-5 connectedCallback={() => {}}></test-frameworks-5>
    <!-- svelte-ignore attribute_avoid_is -->
    <a
        is="test-frameworks-6"
        href="/#"
        booleanProp={true}
    >Test</a>
</div>
