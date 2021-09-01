import { DOM, Fragment, h, render } from '@chialab/dna';
import './Component';

h('details', { open: true });
h(DOM.createElement('details'), { open: true });
h('details', { ref: DOM.createElement('details') });
h(Fragment);

render(<details open />);
render(<details ref={DOM.createElement('details')} />);
render(<x-test active={true} />);
render(<details is="x-test-builtin" active={true} />);
