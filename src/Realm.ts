import { defineProperty, getOwnPropertyDescriptor } from './helpers';

/**
 * A callback to call when a realm changes.
 */
type RealmChangeCallback = (childNodes: Node[]) => void;

/**
 * A symbol that identifies a realm instance on a node.
 */
const REALM_SYMBOL: unique symbol = Symbol();

/**
 * A symbol that identifies a parent realm instance on a node.
 * This is used to track the parent realm of a node when it is moved between realms.
 */
const REALM_PARENT_SYMBOL: unique symbol = Symbol();

/**
 * Create and attach a realm for a node.
 * @param  node The root node.
 * @returns The realm instance.
 */
export function attachRealm(node: HTMLElement): Realm {
    if (REALM_SYMBOL in node) {
        throw new Error('Node already has a realm');
    }

    const realm = new Realm(node);
    defineProperty(node, REALM_SYMBOL, {
        value: realm,
        writable: false,
        enumerable: false,
        configurable: false,
    });

    return realm;
}

/**
 * Get the realm instance for a node.
 * @param node The root node.
 * @returns The realm instance or null.
 */
export function getRealm(node: HTMLElement): Realm | null {
    return REALM_SYMBOL in node ? (node[REALM_SYMBOL] as Realm) : null;
}

/**
 * Get the owner realm instance for a node.
 * @param node The child node.
 * @returns The owner realm instance or null.
 */
function getOwnerRealm(node: Node): Realm | null {
    return REALM_PARENT_SYMBOL in node ? (node[REALM_PARENT_SYMBOL] as Realm) : null;
}

/**
 * Set the parent realm instance for a node.
 * @param node The child node.
 * @param realm The parent realm instance.
 */
function setOwnerRealm(node: Node, realm: Realm | null): void {
    const currentRealm = getOwnerRealm(node);
    if (currentRealm && realm && currentRealm !== realm) {
        throw new Error('Cannot set parent realm for a node that already has a different parent realm.');
    }

    defineProperty(node, REALM_PARENT_SYMBOL, {
        value: realm,
        writable: false,
        enumerable: false,
        configurable: true,
    });
}

/**
 * The realm class.
 */
export class Realm {
    /**
     * The root node of the realm.
     */
    readonly node: HTMLElement;

    /**
     * The child nodes of the realm.
     */
    readonly childNodes: Node[] = [];

    /**
     * The fragment used to temporary store nodes.
     */
    protected fragment: DocumentFragment;

    /**
     * The callbacks to call when the realm changes.
     */
    protected callbacks: Set<RealmChangeCallback> = new Set();

    /**
     * Whether the realm is open.
     */
    open = false;

    /**
     * Setup the realm.
     * @param node The root node of the realm.
     */
    constructor(node: HTMLElement) {
        this.node = node;
        this.fragment = node.ownerDocument.createDocumentFragment();
    }

    /**
     * Get the closest realm ancestor of a node.
     * @returns A realm or null.
     */
    get ownerRealm(): Realm | null {
        let parentNode = this.node.parentElement;
        while (parentNode) {
            const realm = getRealm(parentNode);
            if (realm) {
                return realm;
            }
            parentNode = parentNode.parentElement;
        }

        return null;
    }

    /**
     * Initialize the realm.
     */
    initialize(): void {
        this.childNodes.splice(0, this.childNodes.length, ...[].slice.call(this.node.childNodes));
        this.childNodes.forEach((node) => {
            const wasOpen = this.dangerouslyOpen();
            this.fragment.appendChild(node);
            if (!wasOpen) {
                this.dangerouslyClose();
            }
            this.adoptNode(node);
        });

        if (typeof customElements !== 'undefined') {
            customElements.upgrade(this.fragment);
        }

        this.notify();
    }

    /**
     * Restore the slot child nodes.
     */
    restore(): void {
        this.childNodes.forEach((node) => {
            this.releaseNode(node);
            const wasOpen = this.dangerouslyOpen();
            this.node.appendChild(node);
            if (!wasOpen) {
                this.dangerouslyClose();
            }
        });
        this.childNodes.splice(0, this.childNodes.length);
    }

    /**
     * Add a callback to call when the realm changes.
     * @param callback The callback to invoke.
     */
    observe(callback: RealmChangeCallback): void {
        this.callbacks.add(callback);
    }

    /**
     * Remove a registered callback.
     * @param callback The callback to remove.
     */
    unobserve(callback: RealmChangeCallback): void {
        this.callbacks.delete(callback);
    }

    /**
     * Open the realm.
     * When using this method, you must call `dangerouslyClose` when you are done,
     * or things will get unstable.
     * @return Whether the realm was successfully opened.
     */
    dangerouslyOpen(): boolean {
        if (this.open) {
            return false;
        }
        this.open = true;
        return true;
    }

    /**
     * Close the realm.
     */
    dangerouslyClose(): void {
        this.open = false;
    }

    /**
     * Notifiy a realm update
     * @param mutations The list of mutations that triggered the update.
     */
    protected notify(): void {
        const childNodes = Array.from(this.childNodes);
        this.callbacks.forEach((callback) => callback(childNodes));
    }

    /**
     * Get the previous sibling of a node in the realm.
     * @param node The node to get the previous sibling of.
     * @returns The previous sibling of the node.
     */
    getPreviousSibling(node: ChildNode | null): Node | null {
        if (node == null) {
            return null;
        }
        const io = this.childNodes.indexOf(node);
        if (io === -1) {
            return null;
        }
        return this.childNodes[io - 1] ?? null;
    }

    /**
     * Get the next sibling of a node in the realm.
     * @param node The node to get the next sibling of.
     * @returns The next sibling of the node.
     */
    getNextSibling(node: Node | null): Node | null {
        if (node == null) {
            return null;
        }
        const io = this.childNodes.indexOf(node);
        if (io === -1) {
            return null;
        }
        return this.childNodes[io + 1] ?? null;
    }

    /**
     * Adopt a node to a realm.
     * @param realm The realm to adopt the node to.
     * @param node The node to adopt.
     */
    protected adoptNode(node: Node): void {
        const ownerRealm = getOwnerRealm(node);
        if (ownerRealm === this) {
            return;
        }
        if (ownerRealm) {
            throw new Error('Node already has a parent realm.');
        }
        setOwnerRealm(node, this);
    }

    /**
     * Release a node from the realm.
     * @param node The node to release.
     */
    protected releaseNode(node: Node): void {
        if (getOwnerRealm(node) === this) {
            setOwnerRealm(node, null);
        }
    }

    /**
     * Normalize nodes list.
     * @param nodes The nodes to normalize.
     * @param acc The accumulator.
     * @returns The normalized nodes.
     */
    protected importNodes(nodes: (Node | string)[], acc: Node[] = []): Node[] {
        return nodes.reduce((acc, node) => {
            if (typeof node === 'string') {
                const childNode = this.node.ownerDocument.createTextNode(node);
                setOwnerRealm(childNode, this);
                this.fragment.appendChild(childNode);
                acc.push(childNode);
            } else if (node.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */) {
                this.importNodes(Array.from(node.childNodes), acc);
            } else {
                const ownerRealm = getOwnerRealm(node);
                if (ownerRealm) {
                    if (!ownerRealm.contains(this)) {
                        ownerRealm.removeChild(node);
                        setOwnerRealm(node, this);
                        this.fragment.appendChild(node);
                    }
                } else {
                    setOwnerRealm(node, this);
                    this.fragment.appendChild(node);
                }
                acc.push(node);
            }
            return acc;
        }, acc);
    }

    /**
     * Internal method to append nodes to the realm.
     * @param nodes The nodes to append.
     * @returns The nodes that were appended.
     */
    protected appendNodes(nodes: Node[]): void {
        this.removeNodes(nodes, false);
        this.childNodes.push(...nodes);
    }

    /**
     * Internal method to prepend nodes to the realm.
     * @param nodes The nodes to prepend.
     * @returns The nodes that were prepended.
     */
    protected prependNodes(nodes: Node[]): void {
        this.removeNodes(nodes, false);
        this.childNodes.unshift(...nodes);
    }

    /**
     * Internal method to remove nodes to the realm.
     * @param nodes The nodes to remove.
     * @param strict Whether to throw an error if a node is not found in the child nodes.
     * @returns The nodes that were removed.
     */
    protected removeNodes(nodes: Node[], strict = true): void {
        nodes.forEach((child) => {
            const io = this.childNodes.indexOf(child);
            if (io !== -1) {
                this.releaseNode(child);
                this.childNodes.splice(io, 1);
                if (this.fragment.contains(child)) {
                    this.fragment.removeChild(child);
                }
            } else if (strict) {
                throw new Error(
                    "Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node."
                );
            }
        });
    }

    /**
     * Insert nodes before a reference node in the slot child nodes array.
     * @param nodes The nodes to insert.
     * @param referenceNode The reference node to insert before.
     */
    protected insertNodesBefore(nodes: Node[], referenceNode: Node | null): void {
        const io = referenceNode ? this.childNodes.indexOf(referenceNode) : -1;
        if (io === -1) {
            this.appendNodes(nodes);
            return;
        }
        this.removeNodes(nodes, false);
        this.childNodes.splice(io, 0, ...nodes);
    }

    /**
     * Replace nodes in the slot child nodes array.
     * @param nodes The nodes to replace.
     * @param referenceNode The reference node to replace.
     */
    protected replaceNodes(nodes: Node[], referenceNode: Node): void {
        const io = this.childNodes.indexOf(referenceNode);
        if (io === -1) {
            this.appendNodes(nodes);
            return;
        }
        this.removeNodes(nodes, false);
        this.childNodes.splice(io, 1, ...nodes);
    }

    /**
     * Append nodes to the realm.
     * @param nodes The nodes to append.
     */
    append(...nodes: (Node | string)[]): void {
        this.appendNodes(this.importNodes(nodes));
        this.notify();
    }

    /**
     * Prepend nodes to the realm.
     * @param nodes The nodes to prepend.
     */
    prepend(...nodes: (Node | string)[]): void {
        this.prependNodes(this.importNodes(nodes));
        this.notify();
    }

    /**
     * Remove nodes from the realm.
     * @param node The node to remove.
     */
    removeChild(node: Node): void {
        this.removeNodes([node]);
        this.notify();
    }

    /**
     * Replaces a realm node with nodes, while replacing strings in nodes with equivalent Text nodes.
     * @param nodes The nodes or strings to replace node with. Strings are replaced with equivalent Text nodes.
     * @param referenceNode The node to replace.
     */
    replaceChild(nodes: (string | Node)[], referenceNode: Node): void {
        this.replaceNodes(this.importNodes(nodes), referenceNode);
        this.notify();
    }

    /**
     * Inserts nodes or contents in the realm before node.
     * @param nodes The nodes to be inserted.
     * @param referenceNode The node before which new nodes are to be inserted.
     */
    insertBefore(nodes: (string | Node)[], referenceNode: Node | null): void {
        this.insertNodesBefore(this.importNodes(nodes), referenceNode);
        this.notify();
    }

    /**
     * Filter child nodes by `slot` attribute name.
     * @param name The name of the slot. `null` for unnamed slot.
     * @return The child nodes that match the slot name.
     */
    childNodesBySlot(name: string | null = null): Node[] {
        return this.childNodes.filter((node) => {
            if (node.nodeType === Node.COMMENT_NODE) {
                return false;
            }
            if (getOwnerRealm(node) !== this) {
                // collect nodes from other realms
                return !name;
            }
            if (node.nodeType !== Node.ELEMENT_NODE) {
                return !name;
            }

            const slotName = (node as HTMLElement).getAttribute('slot') || null;
            return slotName === name;
        });
    }

    /**
     * Check if a realm is contained in this realm.
     * @param realm The child realm.
     * @returns Whether the realm is contained in this realm.
     */
    contains(realm: Realm): boolean {
        return this.node.contains(realm.node);
    }
}

if (typeof Node !== 'undefined') {
    // From here to the end of the method, we enter the realm of dark magic.
    // We're going to modify the prototype of slotted nodes to improve compatibility with other rendering frameworks.
    const NodePrototype = Node.prototype;
    const ElementPrototype = Element.prototype;
    const CharacterDataPrototype = CharacterData.prototype;
    const getParentNodeDesc = getOwnPropertyDescriptor(NodePrototype, 'parentNode') as PropertyDescriptor;
    const getPreviousSiblingDesc = getOwnPropertyDescriptor(NodePrototype, 'previousSibling') as PropertyDescriptor;
    const getNextSiblingDesc = getOwnPropertyDescriptor(NodePrototype, 'nextSibling') as PropertyDescriptor;
    const beforeDesc = getOwnPropertyDescriptor(ElementPrototype, 'before') as PropertyDescriptor;
    const afterDesc = getOwnPropertyDescriptor(ElementPrototype, 'after') as PropertyDescriptor;
    const replaceWithDesc = getOwnPropertyDescriptor(ElementPrototype, 'replaceWith') as PropertyDescriptor;
    const removeDesc = getOwnPropertyDescriptor(ElementPrototype, 'remove') as PropertyDescriptor;
    const commentBeforeDesc = getOwnPropertyDescriptor(CharacterDataPrototype, 'before') as PropertyDescriptor;
    const commentAfterDesc = getOwnPropertyDescriptor(CharacterDataPrototype, 'after') as PropertyDescriptor;
    const commentReplaceWithDesc = getOwnPropertyDescriptor(
        CharacterDataPrototype,
        'replaceWith'
    ) as PropertyDescriptor;
    const commentRemoveDesc = getOwnPropertyDescriptor(CharacterDataPrototype, 'remove') as PropertyDescriptor;
    const appendDesc = getOwnPropertyDescriptor(ElementPrototype, 'append') as PropertyDescriptor;
    const prependDesc = getOwnPropertyDescriptor(ElementPrototype, 'prepend') as PropertyDescriptor;
    const appendChildDesc = getOwnPropertyDescriptor(NodePrototype, 'appendChild') as PropertyDescriptor;
    const insertBeforeDesc = getOwnPropertyDescriptor(NodePrototype, 'insertBefore') as PropertyDescriptor;
    const replaceChildDesc = getOwnPropertyDescriptor(NodePrototype, 'replaceChild') as PropertyDescriptor;
    const removeChildDesc = getOwnPropertyDescriptor(NodePrototype, 'removeChild') as PropertyDescriptor;
    const insertAdjacentElementDesc = getOwnPropertyDescriptor(
        ElementPrototype,
        'insertAdjacentElement'
    ) as PropertyDescriptor;

    defineProperty(NodePrototype, 'parentNode', {
        ...getParentNodeDesc,
        get() {
            const root = getOwnerRealm(this);
            if (!root) {
                return getParentNodeDesc.get?.call(this);
            }
            if (!this.isConnected) {
                // The slotted node is not connected to the DOM,
                // because it is a comment or is using a not handled slot name.
                // We return the root component as the parent node.
                return root.node;
            }
            const parentNode = getParentNodeDesc.get?.call(this);
            if (!parentNode) {
                return null;
            }
            if (parentNode === root) {
                return root.node;
            }

            // We are proxying the real parentNode to ensure that editing methods are called on the root component.
            // Vue and Preact uses parentNode.removeChild(node) to remove a node.
            return new Proxy(parentNode, {
                get(target, prop) {
                    switch (prop) {
                        case 'append':
                        case 'prepend':
                        case 'appendChild':
                        case 'insertBefore':
                        case 'replaceChild':
                        case 'removeChild':
                        case 'insertAdjacentElement':
                            return root.node[prop].bind(root.node);
                        default: {
                            const value = Reflect.get(parentNode, prop);
                            if (typeof value === 'function') {
                                return value.bind(parentNode);
                            }
                            return value;
                        }
                    }
                },
                set(target, prop, value) {
                    return Reflect.set(parentNode, prop, value);
                },
                has(target, prop) {
                    return Reflect.has(parentNode, prop);
                },
            });
        },
    });

    defineProperty(NodePrototype, 'previousSibling', {
        ...getPreviousSiblingDesc,
        get() {
            const root = getOwnerRealm(this);
            if (!root || root.open || this.isConnected) {
                return getPreviousSiblingDesc.get?.call(this);
            }
            // The slotted node is not connected to the DOM,
            // because it is a comment or is using a not handled slot name.
            // Lit and uhtml uses mark comments positions to insert and remove nodes.
            const io = root.childNodes.indexOf(this);
            if (io === -1) {
                return null;
            }
            return root.childNodes[io - 1] || null;
        },
    });

    defineProperty(NodePrototype, 'nextSibling', {
        ...getNextSiblingDesc,
        get() {
            const root = getOwnerRealm(this);
            if (!root || root.open || this.isConnected) {
                return getNextSiblingDesc.get?.call(this);
            }
            // The slotted node is not connected to the DOM,
            // because it is a comment or is using a not handled slot name.
            // Lit and uhtml uses mark comments positions to insert and remove nodes.
            const io = root.childNodes.indexOf(this);
            if (io === -1) {
                return null;
            }
            return root.childNodes[io + 1] || null;
        },
    });

    // Override editing methods to ensure that they are called on the root component.
    // Svelte uses these methods to insert and remove nodes.
    defineProperty(ElementPrototype, 'before', {
        ...beforeDesc,
        value(...nodes: (Node | string)[]): void {
            const root = getOwnerRealm(this);
            if (!root || root.open) {
                beforeDesc.value?.apply(this, nodes);
                return;
            }
            root.insertBefore(nodes, this);
        },
    });
    defineProperty(CharacterDataPrototype, 'before', {
        ...commentBeforeDesc,
        value(...nodes: (Node | string)[]): void {
            const root = getOwnerRealm(this);
            if (!root || root.open) {
                commentBeforeDesc.value?.apply(this, nodes);
                return;
            }
            root.insertBefore(nodes, this);
        },
    });

    defineProperty(ElementPrototype, 'after', {
        ...afterDesc,
        value(...nodes: (Node | string)[]): void {
            const root = getOwnerRealm(this);
            if (!root || root.open) {
                afterDesc.value?.apply(this, nodes);
                return;
            }
            const io = root.childNodes.indexOf(this);
            const nextSibling = io === -1 ? null : root.childNodes[io + 1];
            root.insertBefore(nodes, nextSibling);
        },
    });
    defineProperty(CharacterDataPrototype, 'after', {
        ...commentAfterDesc,
        value(...nodes: (Node | string)[]): void {
            const root = getOwnerRealm(this);
            if (!root || root.open) {
                commentAfterDesc.value?.apply(this, nodes);
                return;
            }
            const io = root.childNodes.indexOf(this);
            const nextSibling = io === -1 ? null : root.childNodes[io + 1];
            root.insertBefore(nodes, nextSibling);
        },
    });

    defineProperty(ElementPrototype, 'replaceWith', {
        ...replaceWithDesc,
        value(...nodes: (Node | string)[]): void {
            const root = getOwnerRealm(this);
            if (!root || root.open) {
                replaceWithDesc.value?.apply(this, nodes);
                return;
            }
            root.replaceChild(nodes, this);
        },
    });
    defineProperty(CharacterDataPrototype, 'replaceWith', {
        ...commentReplaceWithDesc,
        value(...nodes: (Node | string)[]): void {
            const root = getOwnerRealm(this);
            if (!root || root.open) {
                commentReplaceWithDesc.value?.apply(this, nodes);
                return;
            }
            root.replaceChild(nodes, this);
        },
    });

    defineProperty(ElementPrototype, 'remove', {
        ...removeDesc,
        value(): void {
            const root = getOwnerRealm(this);
            if (!root || root.open) {
                removeDesc.value?.call(this);
                return;
            }
            root.removeChild(this);
        },
    });
    defineProperty(CharacterDataPrototype, 'remove', {
        ...commentRemoveDesc,
        value(): void {
            const root = getOwnerRealm(this);
            if (!root || root.open) {
                commentRemoveDesc.value?.call(this);
                return;
            }
            root.removeChild(this);
        },
    });

    // Override realm root editing methods to ensure that they are called on the root component.
    defineProperty(ElementPrototype, 'append', {
        ...appendDesc,
        value(...nodes: (Node | string)[]): void {
            const root = getRealm(this);
            if (!root || root.open) {
                appendDesc.value?.apply(this, nodes);
                return;
            }
            root.append(...nodes);
        },
    });

    defineProperty(ElementPrototype, 'prepend', {
        ...prependDesc,
        value(...nodes: (Node | string)[]): void {
            const root = getRealm(this);
            if (!root || root.open) {
                prependDesc.value?.apply(this, nodes);
                return;
            }
            root.prepend(...nodes);
        },
    });

    defineProperty(NodePrototype, 'appendChild', {
        ...appendChildDesc,
        value(node: Node): Node {
            const root = getRealm(this);
            if (!root || root.open) {
                return appendChildDesc.value?.call(this, node);
            }
            root.append(node);
            return node;
        },
    });

    defineProperty(NodePrototype, 'insertBefore', {
        ...insertBeforeDesc,
        value(node: Node, referenceNode: Node | null): Node {
            const root = getRealm(this);
            if (!root || root.open) {
                return insertBeforeDesc.value?.call(this, node, referenceNode);
            }
            root.insertBefore([node], referenceNode);
            return node;
        },
    });

    defineProperty(NodePrototype, 'replaceChild', {
        ...replaceChildDesc,
        value(newChild: Node, oldChild: Node): Node {
            const root = getRealm(this);
            if (!root || root.open) {
                return replaceChildDesc.value?.call(this, newChild, oldChild);
            }
            root.replaceChild([newChild], oldChild);
            return newChild;
        },
    });

    defineProperty(NodePrototype, 'removeChild', {
        ...removeChildDesc,
        value(child: Node): Node {
            const root = getRealm(this);
            if (!root || root.open) {
                return removeChildDesc.value?.call(this, child);
            }
            root.removeChild(child);
            return child;
        },
    });

    defineProperty(ElementPrototype, 'insertAdjacentElement', {
        ...insertAdjacentElementDesc,
        value(where: InsertPosition, node: Element): Element | null {
            const root = getRealm(this);
            if (!root || root.open) {
                return insertAdjacentElementDesc.value?.call(this, where, node);
            }
            switch (where) {
                case 'afterbegin':
                    root.prepend(node);
                    return node;
                case 'beforeend':
                    root.append(node);
                    return node;
                default:
                    return insertAdjacentElementDesc.value?.call(this, where, node);
            }
        },
    });
}
