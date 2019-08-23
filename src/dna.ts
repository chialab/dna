import { mixin } from './lib/mixin';
import { DOM } from './lib/dom';

export { DOM };
export { extend } from './lib/extend';
export { render } from './lib/render';
export { get, define, upgrade, whenDefined } from './lib/registry';
export { Fragment, h } from './lib/h';
export { html } from './lib/html';
export { css } from './lib/css';
export { compile } from './lib/interpolate';
export { property } from './lib/property';
export { delegate, undelegate, dispatchEvent } from './lib/events';

/**
 * The DNA base Component constructor, a Custom Element constructor with
 * declarative properties and event delegations, custom template and
 * a complete life cycle implementation.
 * All DNA components **must** extends this class.
 *
 * @example
 * ```ts
 * import { Component, property, define, render } from '＠chialab/dna';
 *
 * class HelloWorld extends Component {
 *   ＠property() // define an observable Component property
 *   name: string;
 *
 *   get events() { // define a list of delegated events
 *     return {
 *       'input [name="name"]': (ev, target) => {
 *         this.name = target.value;
 *       },
 *     };
 *   }
 * }
 *
 * // link the Component class to a tag
 * define('hello-world', HelloWorld);
 * ```
 */
export class Component extends mixin(DOM.HTMLElement) { }
