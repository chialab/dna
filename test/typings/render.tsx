import { Fragment, h, render } from '@chialab/dna';
import './Component';

render(<details open />);
render(<details ref={document.createElement('details')} />);
render(<div key={{}} />);
// @ts-expect-error Active is not a known property of the core details element
render(<details active={true} />);
render(
    <x-test
        class={{ test: true }}
        style={{ color: 'red' }}
        active={true}
        width={4}
        title="test"
        onclick={(event) => {
            if (event.button === 0) {
                //
            }
        }}
        data-test="2"
        onselected={(event) => {
            if (event.detail === true) {
                //
            }
            // @ts-expect-error onselected expects a boolean, not a string
            if (event.detail === '') {
                //
            }
        }}
    />
);
render(
    <x-test
        // @ts-expect-error Width accepts only numbers
        width={true}
    />
);
render(
    <x-test
        // @ts-expect-error Missing is not a known property of x-test
        missing={true}
    />
);
render(
    <x-test
        // @ts-expect-error nodeType is an inherited read-only property
        nodeType={true}
    />
);
render(
    <x-test
        // @ts-expect-error connectedCallback is a method
        connectedCallback={() => {}}
    />
);
render(<x-test on:unknown={(event) => {}} />);
render(
    <details
        is="x-test-builtin"
        active={true}
        open
    />
);
render(
    <unknown
        key={{}}
        slot="2"
    />
);

render(h('details', { open: true }));
render(
    h('x-test', {
        active: true,
        width: 4,
        title: 'test',
        onselected: (event) => {
            if (event.detail === true) {
                //
            }
            // @ts-expect-error onselected expects a boolean, not a string
            if (event.detail === '') {
                //
            }
        },
    })
);
// @ts-expect-error Active is not a known property of the core details element
render(h('details', { active: true }));
render(h(document.createElement('details'), { open: true }));
render(h('details', { ref: document.createElement('details') }));
render(h('div', { key: {} }));
render(h(Fragment));

// @ts-expect-error Unknown is not a known property of a div
render(h('div', { key: {}, unknown: 2 }));
// @ts-expect-error Missing is not a known property of x-test
render(h('x-test', { key: {}, missing: true }));
// @ts-expect-error Width accepts only numbers
render(h('x-test', { key: {}, width: true }));
// @ts-expect-error Promise is not a a function component
render(<Promise />);
render(
    <>
        {'Hello'} {'world'}
    </>
);
render(
    <svg
        viewBox="0 0 100 100"
        title=""
    />
);
render('Hello');
