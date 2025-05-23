<script>
    import * as DNA from '@chialab/dna';

    DNA.define(
        'svelte-test-3',
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
     * @type {boolean}
     */
    export let title;
</script>

<svelte-test-3>
    Text
    {#if title}
        <h1 slot="children">Title</h1>
    {:else}
        <h2 slot="children">Subitle</h2>
    {/if}
    end
</svelte-test-3>
