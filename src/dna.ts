import { mixin } from './lib/mixin';
import { DOM } from './lib/DOM';

export { mixin, DOM };
export { isCustomElement } from './lib/CustomElement';
export { get, define, upgrade, whenDefined } from './lib/registry';
export { render } from './lib/render';
export { Fragment, h } from './lib/h';
export { html } from './lib/html';
export { css } from './lib/css';
export { compile } from './lib/InterpolationFunction';
export { property } from './lib/property';

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
 *   // define an observable property
 *   ＠property()
 *   name: string;
 *
 *   // define a list of delegated events
 *   readonly events = {
 *     'input [name="name"]': (ev, target) => {
 *       this.name = target.value;
 *     },
 *   };
 *
 *   // define the template
 *   render() {
 *      return html`<div>${this.name}</div>`;
 *   }
 * }
 *
 * // link the Component class to a tag
 * define('hello-world', HelloWorld);
 * ```
 */
export const Component = mixin(DOM.get('HTMLElement'));
