import { DOM, Fragment, h } from '@chialab/dna';

h('details', { open: true });
h(DOM.createElement('details'), { open: true });
h('details', { ref: DOM.createElement('details') });
h(Fragment);
