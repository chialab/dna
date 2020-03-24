import { window, extend, render, css, DOM, Component, Template, DelegatedEventCallback, ClassFieldObserver } from '@chialab/dna';
import { DNA_SYMBOL, COMPONENT_SYMBOL, NODE_SYMBOL, CONNECTED_SYMBOL, STYLE_SYMBOL } from './symbols';
import { convert } from './template';
import { warnCode } from './deprecations';

const STYLES: { [key: string]: HTMLStyleElement } = {};

export const mixin = extend;
export class BaseComponent extends Component {
    /**
     * Listeners alias.
     */
    readonly events?: {
        [key: string]: DelegatedEventCallback|string;
    };

    readonly css?: string;

    get node() {
        warnCode('PREFER_INSTANCE');
        return this;
    }

    get [DNA_SYMBOL]() {
        return true;
    }

    get [COMPONENT_SYMBOL]() {
        warnCode('PREFER_INSTANCE');
        return this;
    }

    get [NODE_SYMBOL]() {
        warnCode('PREFER_INSTANCE');
        return this;
    }

    get [CONNECTED_SYMBOL]() {
        return this.isConnected;
    }

    get [STYLE_SYMBOL]() {
        return this.querySelector(`style[name="${this.is}"]`);
    }

    get template(): any  {
        return undefined;
    }

    get listeners() {
        const listeners: { [key: string]: DelegatedEventCallback } = {};

        let proto = Object.getPrototypeOf(this);
        let shouldWarn = false;
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

        if (this.is && this.css && !STYLES[this.is]) {
            warnCode('PREFER_STYLE');
            let content = css(this.is, this.css);
            let style = STYLES[this.is] = DOM.createElement('style') as HTMLStyleElement;
            style.textContent = content;
            window.document.head.appendChild(style);
        }

        if (this.template) {
            warnCode('PREFER_RENDER');
        }
    }

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
