import { digest, register } from './dna-helper.js';
import { DNABaseComponent } from './dna-base-component.js';
import { inherit } from 'es6-classes/src/inherit.js';
import { define } from 'es6-classes/src/define.js';

function createFunctionClass(prototype) {
    let fn = function() {};
    fn.prototype = prototype;
    return fn;
}

function bindFN(protoFn, superFn) {
    return function(...args) {
        protoFn.apply(this, args);
        superFn.apply(this, args);
    };
}
/**
 * Extend a component prototype.
 * @private
 *
 * @param {function|class|object} superScope The function or the prototype to extend.
 * @param {function|class|object} subScope The function or the prototype to merge.
 * @return {function} A new extended class.
 */
function extend(superScope, subScope) {
    if (typeof superScope !== 'function' && typeof superScope !== 'object') {
        throw new TypeError(
            `Super expression must be a function or an object, not ${typeof superScope}`
        );
    }
    let _superScope = (typeof superScope !== 'function') ?
        createFunctionClass(superScope) :
        superScope;
    let _subScope = (typeof subScope !== 'function') ?
        createFunctionClass(subScope) :
        subScope;
    let Ctr = createFunctionClass({});
    inherit(Ctr, _superScope);
    define(Ctr, _subScope.prototype);
    _subScope.prototype = Ctr.prototype;
}

/**
 * Create and register a component.
 * @deprecated
 *
 * @param {string} fn The tag to use for the custom element. (required)
 * @param {object} options A configuration object. (`prototype` key is required)
 * @param {object} pluginOptions Some  generic replacements (optional)
 * @return {function} The Component constructor.
 */
export function create(fn, options = {}, pluginOptions = {}) {
    // eslint-disable-next-line
    console.warn(
        `DNA.create has been deprecated since 1.3.0. Use Chialab/es6-classes.
See https://github.com/Chialab/dna/wiki/Deprecating-%60DNA.create%60.`
    );
    let pre = digest(fn, options);
    let tagName = pre.tagName;
    let config = pre.config;
    let scope = pre.scope;
    let registerFn = pluginOptions.register || register;
    let baseComponent = pluginOptions.base || DNABaseComponent;
    if (typeof tagName !== 'string') {
        throw new Error('Missing or bad typed `tagName` property');
    }
    if (typeof scope === 'undefined') {
        throw new Error('Missing prototype');
    }
    extend(baseComponent, scope);
    for (let k in scope.prototype) {
        if (scope.prototype.hasOwnProperty(k)) {
            let callbacks = [
                'createdCallback',
                'attachedCallback',
                'detachedCallback',
                'attributeChangedCallback',
            ];
            if (callbacks.indexOf(k) !== -1) {
                scope.prototype[k] = bindFN(
                    scope.prototype[k],
                    baseComponent.prototype[k]
                );
            }
        }
    }
    for (let k in scope) {
        if (scope.hasOwnProperty(k)) {
            let callbacks = [
                'onRegister',
            ];
            if (callbacks.indexOf(k) !== -1) {
                scope[k] = bindFN(
                    scope[k],
                    baseComponent[k]
                );
            }
        }
    }
    config.prototype = scope;
    return registerFn(tagName, config);
}
