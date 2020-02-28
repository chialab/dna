import { Template, TemplateItems } from '../../../lib/Template';
import { HyperNode } from '../../../lib/HyperNode';
import { extend, Component, Properties } from '../../../lib/Component';
import { render } from '../../../lib/render';
import { html } from '../../../lib/html';
import { DelegatedEventCallback } from '../../../lib/events';

function convertTemplate(this: any, template: Template): Template {
    if (typeof template === 'function') {
        /* eslint-disable-next-line */
        console.warn('function templates has been deprecated in DNA 3.0');
        return convertTemplate((template as Function).call(this));
    }
    if (!template) {
        if (template === '' || template === 0) {
            /* eslint-disable-next-line */
            console.warn('Zero and empty string values non-rendering has been deprecated in DNA 3.0');
        }
        return null;
    }
    if (typeof template === 'string') {
        return html(template);
    }
    if (typeof template === 'object' && Array.isArray((template as HyperNode).children)) {
        (template as HyperNode).children = (template as HyperNode).children.map(convertTemplate.bind(this)) as TemplateItems;
    }
    return template;
}

export const mixin = extend;
export class BaseComponent extends Component {
    /**
     * Listeners alias.
     */
    readonly events?: {
        [key: string]: DelegatedEventCallback|string;
    };

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
    }

    forceUpdate() {
        this.render();
    }

    /**
     * Force an element to re-render.
     */
    render() {
        let template: Template = this.template;
        if (typeof template === 'undefined') {
            return;
        }
        render(this, convertTemplate.call(this, template));
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
}
