/** @jsxImportSource react */

import { createRoot } from 'react-dom/client';
import '@chialab/dna/react';
import '../../typings/Component';

const root = createRoot(document.body);

root.render(<details open />);
// @ts-expect-error Active is not a known property of the core details element
root.render(<details active={true} />);
root.render(
    // biome-ignore lint/a11y/noStaticElementInteractions: This is a typings interaction test
    <x-test
        className="test"
        style={{
            color: 'red',
        }}
        active={true}
        width={4}
        title="test"
        onClick={(event) => {
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
// @ts-expect-error Width accepts only numbers
root.render(<x-test width={true} />);
// @ts-expect-error Missing is not a known property of x-test
root.render(<x-test missing={true} />);
// @ts-expect-error nodeType is an inherited read-only property
root.render(<x-test nodeType={true} />);
// @ts-expect-error connectedCallback is a method
root.render(<x-test connectedCallback={() => {}} />);
root.render(
    <details
        is="x-test-builtin"
        active={true}
        open
    />
);
