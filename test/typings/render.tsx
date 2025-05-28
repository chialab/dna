import { Fragment, h, render } from '@chialab/dna';

render(<details open />);
render(<details ref={document.createElement('details')} />);
render(
    <x-test
        active={true}
        width={4}
        title="test"
    />
);
render(
    <details
        is="x-test-builtin"
        active={true}
    />
);
render(<div key={{}} />);
render(
    <unknown
        key={{}}
        slot="2"
    />
);

render(h('details', { open: true }));
render(h(document.createElement('details'), { open: true }));
render(h('details', { ref: document.createElement('details') }));
render(h('div', { key: {} }));
render(h(Fragment));

// @ts-expect-error Unknown is not a known property of a div
render(h('div', { key: {}, unknown: 2 }));
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
// @ts-expect-error Promise is not a a function component
render(<Promise />);
render('Hello');
