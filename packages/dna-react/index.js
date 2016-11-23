/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with React.
 */
import ReactDOM from '@react/react-dom';
import { mix, MIXINS } from '@dnajs/core/src/core.js';
import { registry } from '@dnajs/core/src/lib/registry.js';
import { BaseComponent as OriginalComponent } from '@dnajs/core';
import { ReactMixin } from './src/mixins/react.js';

MIXINS.ReactMixin = ReactMixin;

export { registry };
export * from '@dnajs/core/src/core.js';

export function defineComponent(tagName, Component, config) {
    Object.defineProperty(Component.prototype, 'is', {
        get: () => tagName,
    });
    registry.define(tagName, Component, config);
    return function(...args) {
        return new Component(...args);
    };
}

export function render(parent, Component) {
    ReactDOM.render(
        new Component().render(),
        parent
    );
}

export class BaseComponent extends mix(
    OriginalComponent
).with(
    ReactMixin
) {}
