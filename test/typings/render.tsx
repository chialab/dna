import { Fragment, h, render } from '@chialab/dna';
import { TestBuiltinElement, TestElement } from './Component';

render(<details open />);
render(<details ref={document.createElement('details')} />);
render(<x-test active={true} />);
render(<TestElement active={true} />);
render(
    <details
        is="x-test-builtin"
        active={true}
    />
);
render(<TestBuiltinElement active={true} />);
render(<div key={{}}></div>);
render(
    <unknown
        key={{}}
        slot="2"></unknown>
);

render(h('details', { open: true }));
render(h(document.createElement('details'), { open: true }));
render(h('details', { ref: document.createElement('details') }));
render(h('div', { key: {} }));
render(h(Fragment));

// @ts-expect-error Unknown is not a known property of a div
render(h('div', { key: {}, unknown: 2 }));
// @ts-expect-error Missing is not a known property of a div
render(h(TestBuiltinElement, { active: true, missing: false }));
render(
    <TestElement
        active={true}
        // @ts-expect-error Missing is not a known property of x-test
        missing={true}
    />
);
render(
    <TestBuiltinElement
        active={true}
        // @ts-expect-error Missing is not a known property of x-test
        missing={true}
    />
);
render(
    <TestBuiltinElement
        active={true}
        // @ts-expect-error nodeType is a read-only property
        nodeType={true}
    />
);
render(
    <details
        is="x-test-builtin"
        active={true}
        // @ts-expect-error nodeType is a read-only property
        nodeType={true}
    />
);
render(
    <details
        is="x-test-builtin"
        active={true}
        // @ts-expect-error connectedCallback is a method
        connectedCallback={() => {}}
    />
);
// @ts-expect-error Promise is not a HTMLElement constructor
render(<Promise />);
