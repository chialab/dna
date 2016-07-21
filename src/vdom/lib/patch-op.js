import { create } from './create.js';
import { applyProperties } from './properties.js';

export class VirtualPatch {
    static get NONE() {
        return 0;
    }
    static get VTEXT() {
        return 1;
    }
    static get VNODE() {
        return 2;
    }
    static get PROPS() {
        return 3;
    }
    static get ORDER() {
        return 4;
    }
    static get INSERT() {
        return 5;
    }
    static get REMOVE() {
        return 6;
    }
    constructor(type, vNode, patch) {
        this.type = Number(type);
        this.vNode = vNode;
        this.patch = patch;
    }
}

function removeNode(domNode) {
    let parentNode = domNode.parentNode;
    if (parentNode) {
        parentNode.removeChild(domNode);
    }
    return null;
}

function insertNode(parentNode, vNode) {
    let newNode = create(vNode);
    if (parentNode) {
        parentNode.appendChild(newNode);
    }
    return parentNode;
}

function stringPatch(domNode, leftVNode, vText) {
    let newNode;
    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text);
        newNode = domNode;
    } else {
        let parentNode = domNode.parentNode;
        newNode = create(vText);
        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode);
        }
    }
    return newNode;
}

function vNodePatch(domNode, leftVNode, vNode) {
    let parentNode = domNode.parentNode;
    let newNode = create(vNode);
    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode);
    }
    return newNode;
}

function reorderChildren(domNode, moves) {
    let childNodes = domNode.childNodes;
    let keyMap = {};
    let node;
    let remove;
    let insert;

    for (let i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i];
        node = childNodes[remove.from];
        if (remove.key) {
            keyMap[remove.key] = node;
        }
        domNode.removeChild(node);
    }

    let length = childNodes.length;
    for (let j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j];
        node = keyMap[insert.key];
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to]);
    }
}

export function applyPatch(vpatch, domNode) {
    let type = vpatch.type;
    let vNode = vpatch.vNode;
    let patch = vpatch.patch;

    switch (type) {
    case VirtualPatch.REMOVE:
        return removeNode(domNode, vNode);
    case VirtualPatch.INSERT:
        return insertNode(domNode, patch);
    case VirtualPatch.VTEXT:
        return stringPatch(domNode, vNode, patch);
    case VirtualPatch.VNODE:
        return vNodePatch(domNode, vNode, patch);
    case VirtualPatch.ORDER:
        reorderChildren(domNode, patch);
        return domNode;
    case VirtualPatch.PROPS:
        applyProperties(domNode, patch, vNode.properties);
        return domNode;
    default:
        return domNode;
    }
}
