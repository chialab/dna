import { Fragment, h, render } from '@chialab/dna';
import './Component';

render(<details open />);
render(<details ref={document.createElement('details')} />);
render(
    <x-test
        class={{ test: true }}
        style={{ color: 'red' }}
        active={true}
        width={4}
        title="test"
        // @ts-expect-error Missing is not a known property of the core details element
        missing={true}
    />
);
render(
    <details
        is="x-test-builtin"
        active={true}
        open
    />
);
// @ts-expect-error Active is not a known property of the core details element
render(<details active={true} />);
render(<details open />);
render(<div key={{}} />);
render(
    <unknown
        key={{}}
        slot="2"
    />
);

render(h('details', { open: true }));
render(h('x-test', { active: true, width: 4, title: 'test' }));
// @ts-expect-error Active is not a known property of the core details element
render(h('details', { active: true }));
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
render(<>Hello</>);
render(<svg viewBox="0 0 100 100"></svg>);
render('Hello');
