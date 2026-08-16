import * as DNA from '@chialab/dna';
import { effect, Signal, signal, untracked } from '@preact/signals-core';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

/**
 * An adapter that only does the four operations rendering needs, and cannot create signals.
 * Everything a template is handed still works; only the hooks that build one do not.
 */
const minimalSignals: DNA.SignalAdapter = {
    isSignal: (value) => value instanceof Signal,
    get<T>(target: DNA.SignalLike<T>) {
        return (target as DNA.SignalValue<T>).value;
    },
    effect,
    untrack: untracked,
};

describe(
    'signals with a minimal adapter',
    () => {
        let wrapper: HTMLElement;

        beforeAll(() => {
            DNA.configureSignals(minimalSignals);
        });

        beforeEach(() => {
            wrapper = document.createElement('div');
            document.body.appendChild(wrapper);
        });

        afterEach(() => {
            document.body.removeChild(wrapper);
        });

        it('should render and update signals', () => {
            const text = signal('hello');
            DNA.render(<span id={text}>{text}</span>, wrapper);

            const node = wrapper.querySelector('span') as HTMLElement;
            expect(node.textContent).toBe('hello');
            expect(node.getAttribute('id')).toBe('hello');

            text.value = 'world';
            expect(node.textContent).toBe('world');
            expect(node.getAttribute('id')).toBe('world');
        });

        it('should follow a signal from a function component', () => {
            const flag = signal(true);
            const Test: DNA.FunctionComponent = (props, { useSignalValue }) =>
                useSignalValue(flag) ? <em>yes</em> : <strong>no</strong>;

            DNA.render(<Test />, wrapper);
            expect(wrapper.querySelector('em')?.textContent).toBe('yes');

            flag.value = false;
            expect(wrapper.querySelector('strong')?.textContent).toBe('no');
        });

        it('should run a signal effect from a function component', () => {
            const count = signal(1);
            const seen: number[] = [];
            const Test: DNA.FunctionComponent = (props, { useSignalEffect }) => {
                useSignalEffect(() => {
                    seen.push(count.value);
                });

                return null;
            };

            DNA.render(<Test />, wrapper);
            count.value = 2;
            expect(seen).toEqual([1, 2]);
        });

        it('should refuse to create a signal', () => {
            const Test: DNA.FunctionComponent = (props, { useSignal }) => {
                useSignal(0);

                return null;
            };

            expect(() => DNA.render(<Test />, wrapper)).toThrow(
                'The registered Signal implementation cannot create signals: it has no `state`.'
            );
        });

        it('should refuse to create a computed', () => {
            const count = signal(1);
            const Test: DNA.FunctionComponent = (props, { useComputed }) => {
                useComputed((read) => read(count) * 2);

                return null;
            };

            expect(() => DNA.render(<Test />, wrapper)).toThrow(
                'The registered Signal implementation cannot create signals: it has no `computed`.'
            );
        });
    },
    10 * 1000
);
