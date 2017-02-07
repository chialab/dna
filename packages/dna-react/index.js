/**
 * DNA
 * (c) 2015-2016 Chialab (http://www.chialab.com) <dev@chialab.io>
 * http://dna.chialab.io
 *
 * Just another components pattern.
 * Use with React.
 */
import React from 'react';
import { mix, MIXINS } from '@dnajs/core/src/core.js';
import { registry } from '@dnajs/core/src/lib/registry.js';
import { proxy } from '@dnajs/core/src/lib/proxy.js';
import { ReactMixin } from './src/mixins/react.js';

MIXINS.ReactMixin = ReactMixin;

export { registry };
export * from '@dnajs/core/src/core.js';
export { bootstrap } from '@dnajs/core/src/lib/bootstrap.js';
export { define } from '@dnajs/core/src/lib/define.js';
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
