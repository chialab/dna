import { DOM } from '../../../lib/DOM';
import { CustomElement } from '../../../lib/CustomElement';

(DOM as any).lifeCycle = function lifeCycle() {};

(DOM as any).getNodeComponent = function getNodeComponent(node: Element) {
    if (!(node as CustomElement).is) {
        return null;
    }
    return node;
};

(DOM as any).getComponentNode = function getNodeComponent(node: Element) {
    return node;
};
