import { VirtualHook } from './hook.js';

export class VirtualNode {
    constructor(tagName, properties, children, key, namespace) {
        this.tagName = tagName;
        this.properties = properties || {};
        this.children = children || [];
        this.key = key !== null ? String(key) : undefined;
        this.namespace = (typeof namespace === 'string') ? namespace : null;

        let count = (children && children.length) || 0;
        let descendants = 0;
        let descendantHooks = false;
        let hooks;
        for (let propName in properties) {
            if (properties.hasOwnProperty(propName)) {
                let property = properties[propName];
                if (property instanceof VirtualHook) {
                    if (!hooks) {
                        hooks = {};
                    }
                    hooks[propName] = property;
                }
            }
        }

        for (let i = 0; i < count; i++) {
            let child = children[i];
            if (child instanceof VirtualNode) {
                descendants += child.count || 0;
                if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                    descendantHooks = true;
                }
            }
        }

        this.count = count + descendants;
        this.hooks = hooks;
        this.descendantHooks = descendantHooks;
    }
}
