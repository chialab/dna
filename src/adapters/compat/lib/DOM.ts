import { window, DOM, connect, disconnect, dispatchEvent as coreDispatchEvent, isComponent } from '@chialab/dna';
import { warnCode } from './deprecations';

(DOM as any).Node = window.Node;

(DOM as any).update = (element: Element, qualifiedName: string, oldValue: any, value: string) => {
    DOM.setAttribute(element, qualifiedName, value);
    return true;
};

(DOM as any).lifeCycle = function lifeCycle(value: boolean) {
    // DOM.emulate = value;
};

(DOM as any).getNodeComponent = function getNodeComponent(node: Element) {
    warnCode('PREFER_INSTANCE');
    if (!isComponent(node)) {
        return null;
    }
    return node;
};

(DOM as any).getComponentNode = function getNodeComponent(node: Element) {
    warnCode('PREFER_INSTANCE');
    return node;
};

(DOM as any).dispatchEvent = function dispatchEvent(element: Element, event: Event | string, detail ?: CustomEventInit, bubbles: boolean = true, cancelable: boolean = true, composed: boolean = false): boolean {
    return coreDispatchEvent(element, event, detail, bubbles, cancelable, composed);
};

(DOM as any).connect = connect;

(DOM as any).disconnect = disconnect;

(DOM as any).CONNECTED = 'connectedCallback';

(DOM as any).DISCONNECTED = 'disconnectedCallback';

(DOM as any).UPDATED = 'attributeChangedCallback';
