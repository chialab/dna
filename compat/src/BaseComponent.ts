import { window, render, css, DOM, Component, Template, DelegatedEventCallback, ClassFieldObserver, ClassFieldDescriptor } from '@chialab/dna';
import { DNA_SYMBOL, COMPONENT_SYMBOL, NODE_SYMBOL, CONNECTED_SYMBOL, STYLE_SYMBOL } from './symbols';
import { convert } from './template';
import { CompatibilityPropertyProxy } from './prop';
import { warnCode } from './deprecations';
import { DelegatedEventDescriptor } from 'src/events';

/**
 * Map of style elements.
 * @private
 */
const STYLES: { [key: string]: HTMLStyleElement } = {};

/**
 * Alias to the `extend` method.
 */
export const mixin = (constructor: typeof Component) =>
    class CompatComponent extends constructor {
        /**
         * Compatibility alias for `properties` getter.
         */
        static get properties() {
            const properties: { [key: string]: ClassFieldDescriptor | Function | Function[]; } = {};

            let initialProto = this.prototype;
            let proto = initialProto;
            let shouldWarn = false;
            // collect al prototyped event listeners
            while (proto.constructor !== CompatComponent) {
                let propertiesDescriptor = Object.getOwnPropertyDescriptor(proto, 'properties');
                let propertiesGetter = propertiesDescriptor && propertiesDescriptor.get;
                if (propertiesGetter) {
                    let descriptorProperties = (propertiesGetter.call(initialProto) || {}) as {
                        [key: string]: ClassFieldDescriptor | Function | Function[];
                    };
                    // register listeners
                    for (let propertyName in descriptorProperties) {
                        shouldWarn = true;
                        if (!(propertyName in properties)) {
                            properties[propertyName] = descriptorProperties[propertyName];
                        }
                    }
                }
                proto = Object.getPrototypeOf(proto);
            }

            if (shouldWarn) {
                warnCode('PREFER_PROPERTIES');
            }

            return properties;
        }

        /**
         * Compatibility alias for `events` getter.
         */
        static get listeners() {
            const listeners: { [key: string]: DelegatedEventCallback | DelegatedEventDescriptor } = {};

            let initialProto = this.prototype;
            let proto = initialProto;
            let shouldWarn = false;
            // collect al prototyped event listeners
            while (proto.constructor !== CompatComponent) {
                let eventsDescriptor = Object.getOwnPropertyDescriptor(proto, 'events');
                let eventsGetter = eventsDescriptor && eventsDescriptor.get;
                if (eventsGetter) {
                    let descriptorListeners = (eventsGetter.call(proto) || {}) as {
                        [key: string]: DelegatedEventCallback;
                    };
                    // register listeners
                    for (let eventPath in descriptorListeners) {
                        shouldWarn = true;
                        let listener: DelegatedEventCallback | DelegatedEventDescriptor = descriptorListeners[eventPath];
                        if (typeof listener === 'string') {
                            // string reference to prototype method has been removed in DNA 3, update the reference
                            warnCode('LISTENER_STRING_REFERENCE');
                            listener = {
                                callback: (initialProto as any)[listener],
                            };
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

        /**
         * Listeners alias.
         */
        readonly events?: {
            [key: string]: DelegatedEventCallback|string;
        };

        /**
         * Listeners alias.
         */
        readonly properties?: {
            [key: string]: CompatibilityPropertyProxy;
        };

        /**
         * CSS text to use for scoped style.
         */
        readonly css?: string;

        /**
         * Compatibility DNA component default template.
         */
        readonly template: any;

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

        constructor(node?: HTMLElement, properties?: { [key: string]: any; }) {
            super(node, properties);

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
         * @inheritdoc
         */
        initialize(props: { [key: string]: any; }) {
            this.emulateLifeCycle();
            return super.initialize(props);
        }

        /**
         * @inheritdoc
         */
        connectedCallback() {
            super.connectedCallback();
            this.classList.add(this.is as string);
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
        render(template?: Template) {
            let slotted = this.slotChildNodes;
            if (typeof template === 'undefined') {
                if (!('template' in this)) {
                    template = slotted;
                } else {
                    template = this.template;
                }
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
    };

/**
 * The DNA 2 base component class.
 * @deprecated since version 3.0
 */
export const BaseComponent = mixin(Component);
