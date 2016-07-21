import { VirtualHook } from './hook.js';

export function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        let previousValue = previous[propName];
        if (!(previousValue instanceof VirtualHook)) {
            if (propName === 'attributes') {
                for (let attrName in previousValue) {
                    if (previousValue.hasOwnProperty(attrName)) {
                        node.removeAttribute(attrName);
                    }
                }
            } else if (propName === 'style') {
                for (let i in previousValue) {
                    if (previousValue.hasOwnProperty(i)) {
                        node.style[i] = '';
                    }
                }
            } else if (typeof previousValue === 'string') {
                node[propName] = '';
            } else {
                node[propName] = null;
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue);
        }
    }
}

export function patchObject(node, props, previous, propName, propValue) {
    let previousValue = previous ? previous[propName] : undefined;
    // Set attributes
    if (propName === 'attributes') {
        for (let attrName in propValue) {
            if (propValue.hasOwnProperty(attrName)) {
                let attrValue = propValue[attrName];
                if (attrName === 'class') {
                    let newClasses = attrValue.split(' ');
                    let oldClasses = (previousValue &&
                        previousValue[attrName] &&
                        previousValue[attrName].split(' ')
                    ) || [];
                    newClasses.forEach((cl) => {
                        if (oldClasses.indexOf(cl) === -1) {
                            node.classList.add(cl);
                        }
                    });
                    oldClasses.forEach((cl) => {
                        if (newClasses.indexOf(cl) === -1) {
                            node.classList.remove(cl);
                        }
                    });
                } else if (attrValue === undefined) {
                    node.removeAttribute(attrName);
                } else {
                    node.setAttribute(attrName, attrValue);
                }
            }
        }
        return;
    }

    if (previousValue && typeof(previousValue) === 'object' &&
        Object.getPrototypeOf(previousValue) !== Object.getPrototypeOf(propValue)) {
        node[propName] = propValue;
        return;
    }

    if (typeof node[propName] !== 'object') {
        node[propName] = {};
    }

    let replacer = propName === 'style' ? '' : undefined;

    for (let k in propValue) {
        if (propValue.hasOwnProperty(k)) {
            let value = propValue[k];
            node[propName][k] = (value === undefined) ? replacer : value;
        }
    }
}

export function applyProperties(node, props, previous) {
    for (let propName in props) {
        if (props.hasOwnProperty(propName)) {
            let propValue = props[propName];
            if (propValue === undefined || propValue === null) {
                removeProperty(node, propName, propValue, previous);
            } else if (propValue instanceof VirtualHook) {
                removeProperty(node, propName, propValue, previous);
                if (propValue.hook) {
                    propValue.hook(node,
                        propName,
                        previous ? previous[propName] : undefined);
                }
            } else if (typeof propValue === 'object') {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue;
            }
        }
    }
}
