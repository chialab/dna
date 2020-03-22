import { customElements } from '../../../dna';

Object.defineProperty(customElements, 'components', {
    configurable: false,
    get() {
        return this.registry;
    },
});

export { customElements as registry };
