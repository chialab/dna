/** @jsxImportSource preact */

import { render } from 'preact';
import '@chialab/dna/preact';
import '../../typings/Component';

render(<details open />, document.body);
// @ts-expect-error Active is not a known property of the core details element
render(<details active={true} />, document.body);
render(
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
    />,
    document.body
);
// @ts-expect-error Width accepts only numbers
render(<x-test width={true} />, document.body);
// @ts-expect-error Missing is not a known property of x-test
render(<x-test missing={true} />, document.body);
// @ts-expect-error nodeType is an inherited read-only property
render(<x-test nodeType={true} />, document.body);
// @ts-expect-error connectedCallback is a method
render(<x-test connectedCallback={() => {}} />, document.body);
/** @TODO https://github.com/preactjs/preact/pull/4885 */
// render(
//     <details
//         is="x-test-builtin"
//         active={true}
//         open
//     />,
//     document.body
// );
