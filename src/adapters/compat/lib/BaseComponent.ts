import { window, extend, render, css, DOM, Component, Template, DelegatedEventCallback, ClassFieldObserver } from '@chialab/dna';
import { DNA_SYMBOL, COMPONENT_SYMBOL, NODE_SYMBOL, CONNECTED_SYMBOL, STYLE_SYMBOL } from './symbols';
import { convert } from './template';
import { warnCode } from './deprecations';

/**
 * Map of style elements.
 * @private
 */
const STYLES: { [key: string]: HTMLStyleElement } = {};

/**
 * Alias to the `extend` method.
 */
export const mixin = extend;

/**
 * The DNA 2 base component class.
 * @deprecated since version 3.0
 */
export class BaseComponent extends Component {
    /**
     * Listeners alias.
     */
    readonly events?: {
        [key: string]: DelegatedEventCallback|string;
    };

    /**
     * CSS text to use for scoped style.
     */
    readonly css?: string;

    /**
     * Compatibility symbol for DNA components.
     */
    get [DNA_SYMBOL]() {
        return true;
    }

    /**
     * Alias to the component node (same as component ind DNA 3).
     */
    get node() {
        warnCode('PREFER_INSTANCE');
        return this;
    }

    /**
     * Alias to the component node (same as component ind DNA 3).
     */
    get [NODE_SYMBOL]() {
        warnCode('PREFER_INSTANCE');
        return this;
    }

    /**
     * Alias to the component instance (same as node in DNA 3).
     */
    get [COMPONENT_SYMBOL]() {
        warnCode('PREFER_INSTANCE');
        return this;
    }

    /**
     * Alias to the connection status.
     */
    get [CONNECTED_SYMBOL]() {
        return this.isConnected;
    }

    /**
     * Alias to the main style element for the component.
     */
    [STYLE_SYMBOL]: HTMLStyleElement;

    /**
     * Compatibility DNA component default template.
     */
    get template(): any {
        return undefined;
    }

    /**
     * Compatibility alias from `events` getter to `listener`.
     */
    get listeners() {
        const listeners: { [key: string]: DelegatedEventCallback } = {};

        let proto = Object.getPrototypeOf(this);
        let shouldWarn = false;
        // collect al prototyped event listeners
        while (proto.constructor !== Component) {
            let eventsDescriptor = Object.getOwnPropertyDescriptor(proto, 'events');
            let eventsGetter = eventsDescriptor && eventsDescriptor.get;
            if (eventsGetter) {
                let descriptorListeners = eventsGetter.call(this) || {};
                // register listeners
                for (let eventPath in descriptorListeners) {
                    shouldWarn = true;
                    let listener = descriptorListeners[eventPath] as DelegatedEventCallback;
                    if (typeof listener === 'string') {
                        // string reference to prototype method has been removed in DNA 3, update the reference
                        warnCode('LISTENER_STRING_REFERENCE');
                        listener = (this as any)[listener];
                    }
                    listeners[eventPath] = listener;
                }
            }
            proto = Object.getPrototypeOf(proto);
        }

        if (shouldWarn) {
            warnCode('PREFER_LISTENERS');
        }

        return listeners;
    }

    constructor(node?: HTMLElement | { [key: string]: any; }, properties?: { [key: string]: any; }) {
        super(node as HTMLElement, properties);
        this.classList.add(this.is as string);

        if (this.css) {
            // handle css text for the component
            if (!STYLES[this.is]) {
                warnCode('PREFER_STYLE');
                let content = css(this.is, this.css);
                let style = STYLES[this.is] = DOM.createElement('style') as HTMLStyleElement;
                style.textContent = content;
                window.document.head.appendChild(style);
            }
            this[STYLE_SYMBOL] = STYLES[this.is];
        }

        // compatibility alias to `getProperties` method
        Object.defineProperty(this, 'properties', {
            get() {
                return this.getProperties();
            },
        });

        // check if deprecated template getter is defined and warn
        if (this.template) {
            warnCode('PREFER_RENDER');
        }
    }

    /**
     * Compatibility alias to `render` method.
     */
    forceUpdate() {
        this.render();
    }

    /**
     * Force an element to re-render.
     */
    render(template: Template = this.template) {
        if (typeof template === 'undefined') {
            return;
        }
        template = convert.call(this, template);
        if (typeof template === 'undefined') {
            return;
        }
        render(this, template);
        return template;
    }

    /**
     * Compatibility alias to dispatchEvent.
     */
    trigger(event: Event): boolean; /* eslint-disable-line no-dupe-class-members */
    trigger(event: string, detail?: CustomEventInit, bubbles?: boolean, cancelable?: boolean, composed?: boolean): boolean; /* eslint-disable-line no-dupe-class-members */
    trigger(event: Event | string, detail?: CustomEventInit, bubbles?: boolean, cancelable?: boolean, composed?: boolean) { /* eslint-disable-line no-dupe-class-members */
        warnCode('PREFER_DISPATCH_EVENT');
        return this.dispatchEvent(event as string, detail, bubbles, cancelable, composed);
    }

    /**
     * Compatibility alias to delegate.
     */
    delegate(event: string, selector: string | null, callback: DelegatedEventCallback) {
        warnCode('PREFER_DELEGATE_EVENT_LISTENER');
        return this.delegateEventListener(event, selector, callback);
    }

    /**
     * Compatibility alias to undelegate.
     */
    undelegate(event: string, selector: string | null, callback: DelegatedEventCallback) {
        warnCode('PREFER_UNDELEGATE_EVENT_LISTENER');
        return this.undelegateEventListener(event, selector, callback);
    }

    /**
     * Compatibility alias to observe.
     */
    observeProperty(propertyName: string, callback: ClassFieldObserver) {
        warnCode('PREFER_OBSERVE');
        return this.observe(propertyName, callback);
    }

    /**
     * Compatibility alias to unobserve.
     */
    unobserveProperty(propertyName: string, callback: ClassFieldObserver) {
        warnCode('PREFER_UNOBSERVE');
        return this.unobserve(propertyName, callback);
    }
}
