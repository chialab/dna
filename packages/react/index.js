/**
 * DNA
 * (c) 2015-2019 Chialab (https://www.chialab.it) <dev@chialab.io>
 * http://chialab.io/p/dna
 *
 * Evolution-based components.
 * Use with React.
 */
import React from 'react';
import { mix, MIXINS, proxy } from '@dnajs/core';
import { ReactMixin } from './src/mixins/react.js';

MIXINS.ReactMixin = ReactMixin;

export {
    mix,
    MIXINS,
    proxy,
    registry,
    DOM,
    DNA_SYMBOL,
    COMPONENT_SYMBOL,
    NODE_SYMBOL,
    STYLE_SYMBOL,
    CONNECTED_SYMBOL,
    namespace,
    prop,
    bootstrap,
    define,
    scopeStyle,
} from '@dnajs/core';
export { render } from './src/lib/render.js';

const Component = proxy(React.Component);

export class BaseComponent extends mix(Component).with(
    MIXINS.ComponentMixin,
    MIXINS.PropertiesMixin,
    MIXINS.StyleMixin,
    MIXINS.EventsMixin,
    MIXINS.TemplateMixin,
    ReactMixin
) {}
