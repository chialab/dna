import { Template } from '../../../lib/Template';
import { extend, Component, Properties } from '../../../lib/Component';
import { render } from '../../../lib/render';
import { DelegatedEventCallback } from '../../../lib/events';
import { convertTemplate } from './IDOM';
import { ClassFieldObserver } from '../../../lib/property';
import { css } from '../../../lib/css';
import { DOM } from '../../../lib/DOM';

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
        return this;
    }

    get template(): any  {
        return undefined;
    }

    get listeners() {
        const events = this.events || {};
        const listeners: { [key: string]: DelegatedEventCallback } = {};
        for (let eventName in events) {
            let listener = events[eventName] as DelegatedEventCallback;
            if (typeof listener === 'string') {
                /* eslint-disable-next-line */
                console.warn('string method reference in event listeners has been deprecated in DNA 3.0');
                listener = (this as any)[listener];
            }
            listeners[eventName] = listener;
        }
        return listeners;
    }

    constructor(node?: HTMLElement | Properties, properties?: Properties) {
        super(node as HTMLElement, properties);
        this.classList.add(this.is as string);

        if (this.is && this.css && !STYLES[this.is]) {
            let content = css(this.is, this.css);
            let style = STYLES[this.is] = DOM.createElement('style') as HTMLStyleElement;
            style.textContent = content;
            DOM.document.head.appendChild(style);
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
        template = convertTemplate.call(this, template);
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
        /* eslint-disable-next-line */
        console.warn('`trigger` method has been deprecated in DNA 3.0');
        return this.dispatchEvent(event as string, detail, bubbles, cancelable, composed);
    }

    /**
     * Compatibility alias to delegate.
     */
    delegate(event: string, selector: string | null, callback: DelegatedEventCallback) {
        /* eslint-disable-next-line */
        console.warn('`delegate` method has been deprecated in DNA 3.0');
        return this.delegateEventListener(event, selector, callback);
    }

    /**
     * Compatibility alias to undelegate.
     */
    undelegate(event: string, selector: string | null, callback: DelegatedEventCallback) {
        /* eslint-disable-next-line */
        console.warn('`undelegate` method has been deprecated in DNA 3.0');
        return this.undelegateEventListener(event, selector, callback);
    }

    /**
     * Compatibility alias to observe.
     */
    observeProperty(propertyName: string, callback: ClassFieldObserver) {
        /* eslint-disable-next-line */
        console.warn('`observeProperty` method has been deprecated in DNA 3.0');
        return this.observe(propertyName, callback);
    }

    /**
     * Compatibility alias to unobserve.
     */
    unobserveProperty(propertyName: string, callback: ClassFieldObserver) {
        /* eslint-disable-next-line */
        console.warn('`unobserveProperty` method has been deprecated in DNA 3.0');
        return this.unobserve(propertyName, callback);
    }
}
