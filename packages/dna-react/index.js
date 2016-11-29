/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with React.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { mix, MIXINS } from '@dnajs/core/src/core.js';
import { registry } from '@dnajs/core/src/lib/registry.js';
import { ReactMixin } from './src/mixins/react.js';

MIXINS.ReactMixin = ReactMixin;

export { registry };
export * from '@dnajs/core/src/core.js';

export function define(tagName, Component, config) {
    return registry.define(tagName, Component, config);
}

export function render(parent, Component, props) {
    return ReactDOM.render(
        React.createElement(Component, props),
        parent
    );
}

export class BaseComponent extends mix(
    React.Component
).with(
    MIXINS.ComponentMixin,
    MIXINS.PropertiesMixin,
    MIXINS.StyleMixin,
    MIXINS.EventsMixin,
    MIXINS.TemplateMixin,
    ReactMixin
) {}
