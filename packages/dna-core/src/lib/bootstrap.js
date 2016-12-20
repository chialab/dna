import { registry } from './registry.js';
import { connect } from './dom.js';

export function bootstrap(parent) {
    for (let k in registry.components) {
        let Component = registry.get(k);
        let elements = parent.querySelectorAll(k);
        for (let i = 0, len = elements.length; i < len; i++) {
            let component = new Component();
            component.node = elements[i];
            connect(component);
        }
    }
}
