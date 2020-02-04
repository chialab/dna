import { DOM } from './DOM';
import { mixin } from './mixin';

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
 *   get events {
 *     return {
 *       'input [name="name"]': (event, target) => {
 *         this.name = target.value;
 *       },
 *     };
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
