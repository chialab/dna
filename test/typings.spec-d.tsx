import {
    Component,
    customElement,
    type EventHandler,
    type EventType,
    Fragment,
    fires,
    HTML,
    h,
    listen,
    observe,
    property,
    render,
} from '@chialab/dna';
import { describe, expectTypeOf, test } from 'vitest';

describe('typings', () => {
    test('should have correct type for custom element', () => {
        @customElement('x-test')
        class TestElement extends Component {
            active?: boolean;

            @property({
                type: Number,
            })
            width = 2;

            @property({
                type: String,
            })
            title = 'test';

            get computed(): string {
                return this.getInnerPropertyValue('computed');
            }
            set computed(value) {
                this.setInnerPropertyValue('computed', value);
            }

            @fires()
            onselected?: EventHandler<CustomEvent<boolean>>;

            @property()
            private privateSymbol = 1;

            @listen('click')
            handleClick(event: MouseEvent) {}

            @listen('click')
            protected handleClick2(event: MouseEvent) {}

            @listen('click')
            private handleClick3(event: MouseEvent) {}
        }

        const element = new TestElement();
        expectTypeOf(element).toEqualTypeOf<TestElement>();
        expectTypeOf(element.active).toEqualTypeOf<boolean | undefined>();
        expectTypeOf(element.width).toEqualTypeOf<number>();
        expectTypeOf(element.title).toEqualTypeOf<string>();
        expectTypeOf(element.computed).toEqualTypeOf<string>();
        expectTypeOf(element.onselected).toEqualTypeOf<EventHandler<CustomEvent<boolean>> | undefined>();
        expectTypeOf(element.onselected).parameter(0).toEqualTypeOf<CustomEvent<boolean>>();
    });

    test('should have correct type for custom element with extends', () => {
        @customElement('x-test-builtin', { extends: 'details' })
        class TestBuiltinElement extends HTML.Details {
            /**
             * Active prop.
             */
            active?: boolean;
        }
        const element = new TestBuiltinElement();
        expectTypeOf(element).toEqualTypeOf<TestBuiltinElement>();
        expectTypeOf(element.open).toEqualTypeOf<boolean>();
        expectTypeOf(element.active).toEqualTypeOf<boolean | undefined>();
    });

    test('can invoke focus on a custom element', () => {
        @customElement('x-test')
        class TestElement extends Component {}
        const element = new TestElement();
        expectTypeOf(element.focus).toEqualTypeOf<(options?: FocusOptions) => void>();
    });

    test('can invoke focus on a custom element with extends', () => {
        @customElement('x-test-builtin', { extends: 'details' })
        class TestBuiltinElement extends HTML.Details {}
        const element = new TestBuiltinElement();
        expectTypeOf(element.focus).toEqualTypeOf<(options?: FocusOptions) => void>();
    });

    test('should add custom properties', () => {
        @customElement('x-test')
        class TestElement extends Component {
            @property() sample?: string;
        }

        const element = new TestElement();
        expectTypeOf(element.sample).toEqualTypeOf<string | undefined>();
    });

    test('should override native properties', () => {
        @customElement('x-test')
        class TestElement extends Component {
            @property() title!: string;
        }

        const element = new TestElement();
        expectTypeOf(element.title).toEqualTypeOf<string>();
    });

    test('should override native properties with extend', () => {
        @customElement('x-test')
        class TestElement extends HTML.Details {
            @property() open!: boolean;
        }

        const element = new TestElement();
        expectTypeOf(element.open).toEqualTypeOf<boolean>();
    });

    test('should inherit properties from parent class', () => {
        @customElement('x-test1')
        class TestElement1 extends Component {
            @property() inherit?: boolean;
        }

        @customElement('x-test2')
        class TestElement2 extends TestElement1 {}

        const element = new TestElement2();
        expectTypeOf(element.inherit).toEqualTypeOf<boolean | undefined>();
    });

    test('should observe property changes', () => {
        class TestElement extends Component {
            @property({
                type: String,
                observe(this: TestElement, oldValue, newValue) {
                    this.check(oldValue, newValue);
                },
            })
            sample?: string;

            @observe('sample')
            check(oldValue: string | undefined, newValue: string | undefined) {
                return `${oldValue}/${newValue}`;
            }

            connectedCallback(): void {
                super.connectedCallback();
                this.observe('sample', () => {});
            }
        }

        const element = new TestElement();
        expectTypeOf(element.sample).toEqualTypeOf<string | undefined>();
    });

    test('should override native event handlers', () => {
        class TestElement extends Component {
            @fires()
            oncustomevent: EventHandler<CustomEvent<boolean>>;

            @fires()
            onclose: EventHandler<CustomEvent<boolean>, true>;

            @fires()
            onerror: EventHandler<CustomEvent<boolean>, true, true>;

            customEventType: EventType<TestElement, 'oncustomevent'>;
            closeEventType: EventType<TestElement, 'onclose'>;
            errorEventType: EventType<TestElement, 'onerror'>;

            customEventTypeStrict: EventType<TestElement, 'oncustomevent', true>;
            closeEventTypeStrict: EventType<TestElement, 'onclose', true>;
            errorEventTypeStrict: EventType<TestElement, 'onerror', true>;
        }

        const element = new TestElement();
        expectTypeOf(element.oncustomevent).parameter(0).toEqualTypeOf<CustomEvent<boolean>>();
        expectTypeOf(element.onclose).parameter(0).toEqualTypeOf<Event | CustomEvent<boolean>>();
        expectTypeOf(element.onerror).parameter(0).toEqualTypeOf<Event | CustomEvent<boolean> | string>();
        expectTypeOf(element.customEventType).toEqualTypeOf<CustomEvent<boolean>>();
        expectTypeOf(element.closeEventType).toEqualTypeOf<Event | CustomEvent<boolean>>();
        expectTypeOf(element.errorEventType).toEqualTypeOf<Event | CustomEvent<boolean> | string>();
        expectTypeOf(element.customEventTypeStrict).toEqualTypeOf<CustomEvent<boolean>>();
        expectTypeOf(element.closeEventTypeStrict).toEqualTypeOf<CustomEvent<boolean>>();
        expectTypeOf(element.errorEventTypeStrict).toEqualTypeOf<CustomEvent<boolean>>();
    });

    describe('JSX', () => {
        test('should accept DNA render properties', () => {
            render(<details ref={document.createElement('details')} />);
            render(<div key={{}} />);
            render(<div on:event={(event) => {}} />);
            render(h('details', { ref: document.createElement('details') }));
            render(h('div', { key: {} }));
            render(h(Fragment));
        });

        test('should have correct type JSX nodes', () => {
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
        });

        test('should have correct type for native elements', () => {
            render(<details open />);
            // @ts-expect-error Active is not a known property of the core details element
            render(<details active={true} />);
            render(h('details', { open: true }));
            // @ts-expect-error Active is not a known property of the core details element
            render(h('details', { active: true }));
            render(h(document.createElement('details'), { open: true }));
        });

        test('should have correct type for unknown elements', () => {
            render(
                <unknown
                    key={{}}
                    slot="2"
                />
            );
        });

        test('should have correct type for custom elements', () => {
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
            // @ts-expect-error Missing is not a known property of x-test
            render(h('x-test', { key: {}, missing: true }));
            // @ts-expect-error Width accepts only numbers
            render(h('x-test', { key: {}, width: true }));
        });

        test('should have correct type for custom elements with extends', () => {
            render(
                <details
                    is="x-test-builtin"
                    active={true}
                    open
                />
            );
        });
    });
});
