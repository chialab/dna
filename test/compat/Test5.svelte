<script>
import * as DNA from '@chialab/dna';

DNA.define(
    'svelte-test-5-card',
    class MyCard extends DNA.Component {
        render() {
            return DNA.html`<slot />`;
        }
    }
);

/**
 * @type {boolean}
 */
export let collapsed;
</script>

<svelte-test-5 collapsed={collapsed}>
    <h1>Title</h1>
    <img src="data:image/png;base64," alt="" />
    <p>Body</p>
</svelte-test-5>
