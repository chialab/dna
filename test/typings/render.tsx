// eslint-disable-next-line import/no-unresolved
import { DOM, Fragment, h, render } from '@chialab/dna';
import { TestElement, TestBuiltinElement } from './Component';

render(<details open />);
render(<details ref={DOM.createElement('details')} />);
render(<x-test active={true} />);
render(<TestElement active={true} />);
render(<details is="x-test-builtin" active={true} />);
render(<TestBuiltinElement active={true} />);
render(<div key={{}}></div>);

render(h('details', { open: true }));
render(h(DOM.createElement('details'), { open: true }));
render(h('details', { ref: DOM.createElement('details') }));
render(h('div', { key: {} }));
render(h(Fragment));

// @ts-expect-error Unknown is not a known property of a div
render(h('div', { key: {}, unknown: 2 }));
// @ts-expect-error Unknown is not a known property of a div
render(h(TestBuiltinElement, { active: true, missing: false }));
// @ts-expect-error Unknown is not a known property of x-test
render(<TestElement active={true} missing={true} />);
// @ts-expect-error Unknown is not a known property of x-test
render(<TestBuiltinElement active={true} missing={true} />);
// @ts-expect-error Promise is not a HTMLElement constructor
render(<Promise />);
