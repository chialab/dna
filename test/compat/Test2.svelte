<script>
    import * as DNA from '@chialab/dna';

    DNA.define(
        'svelte-test-2',
        class extends DNA.Component {
            render() {
                return DNA.html`
                    <span>${this.childNodesBySlot(null)}</span>
                    <div>${this.childNodesBySlot('children')}</div>
                `;
            }
        }
    );

    /**
     * @type {string}
     */
    export let text;
</script>

<svelte-test-2>{text} {'children'}</svelte-test-2>
