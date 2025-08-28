import { isComponent } from './Component';
import { defineProperty, getOwnPropertyDescriptor } from './helpers';

/**
 * A callback to call when a realm changes.
 */
type RealmChangeCallback = (childNodes: Node[]) => void;

/**
 * A symbol that identifies a parent realm instance on a node.
 * This is used to track the parent realm of a node when it is moved between realms.
 */
const REALM_PARENT_SYMBOL: unique symbol = Symbol();

/**
 * A symbol that identifies the owner of a realm.
 * This is used to track the owner of a realm when it is moved between realms.
 */
const REALM_OWNER_SYMBOL: unique symbol = Symbol();

/**
 * Get the owner realm instance for a node.
 * @param node The child node.
 * @returns The owner realm instance or null.
 */
export function getParentRealm(node: Node): Realm | null {
    return (node as Node & { [REALM_PARENT_SYMBOL]?: Realm | null })[REALM_PARENT_SYMBOL] ?? null;
}

/**
 * Set the parent realm instance for a node.
 * @param node The child node.
 * @param realm The parent realm instance.
 */
function setParentRealm(node: Node, realm: Realm | null): void {
    const parentRealm = getParentRealm(node);
    if (parentRealm && realm && parentRealm !== realm) {
        throw new Error('Cannot set parent realm for a node that already has a different parent realm.');
    }
    (node as Node & { [REALM_PARENT_SYMBOL]?: Realm | null })[REALM_PARENT_SYMBOL] = realm;
}

/**
 * Get the owner realm instance for a node.
 * @param node The child node.
 * @returns The owner realm instance or null.
 */
function getOwnerRealm(node: Node): Realm | null {
    return (node as Node & { [REALM_OWNER_SYMBOL]?: Realm | null })[REALM_OWNER_SYMBOL] ?? null;
}

/**
 * Set the owner realm instance for a node.
 * @param node The child node.
 * @param realm The owner realm instance.
 */
function setOwnerRealm(node: Node, realm: Realm | null): void {
    const ownerRealm = getOwnerRealm(node);
    if (ownerRealm && realm && ownerRealm !== realm) {
        throw new Error('Node already has an owner realm.');
    }
    (node as Node & { [REALM_OWNER_SYMBOL]?: Realm | null })[REALM_OWNER_SYMBOL] = realm;
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
    readonly fragment: DocumentFragment;

    /**
     * The callbacks to call when the realm changes.
     */
    protected callbacks: Set<RealmChangeCallback> = new Set();

    /**
     * The position of the virtual iterator.
     */
    protected virtualCurrentNode: Node | null = null;

    /**
     * Whether the realm is open.
     */
    protected _open = false;

    /**
     * Setup the realm.
     * @param node The root node of the realm.
     */
    constructor(node: HTMLElement) {
        this.node = node;
        this.fragment = node.ownerDocument.createDocumentFragment();
    }

    /**
     * Whether the realm is open.
     */
    get open(): boolean {
        return this._open;
    }

    /**
     * Initialize the realm.
     */
    initialize(): void {
        this.dangerouslyOpen();
        this.childNodes.splice(0, this.childNodes.length, ...[].slice.call(this.node.childNodes));
        this.childNodes.forEach((node) => {
            this.adoptNode(node);
        });
        this.dangerouslyClose();

        if (typeof customElements !== 'undefined') {
            customElements.upgrade(this.fragment);
        }

        this.notify();
    }

    /**
     * Restore the slot child nodes.
     */
    restore(): void {
        this.dangerouslyOpen();
        this.childNodes.forEach((node) => {
            this.releaseNode(node);
            this.node.appendChild(node);
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
        this._open = true;
        return true;
    }

    /**
     * Close the realm.
     */
    dangerouslyClose(): void {
        this._open = false;
    }

    /**
     * Request an update of the realm.
     * @param callback The callback to invoke.
     * @returns The result of the callback.
     */
    // biome-ignore lint/suspicious/noExplicitAny: The callback can return any type.
    requestUpdate<T extends () => any>(callback: T): ReturnType<T> {
        this.dangerouslyOpen();

        try {
            const result = callback();
            if (result instanceof Promise) {
                return result.finally(() => {
                    this.dangerouslyClose();
                    return result;
                }) as ReturnType<T>;
            }
            this.dangerouslyClose();

            return result;
        } finally {
            this.dangerouslyClose();
        }
    }

    /**
     * Notifiy a realm update
     * @param mutations The list of mutations that triggered the update.
     */
    protected notify(): void {
        const childNodes = Array.from(this.childNodes);
        this.callbacks.forEach((callback) => {
            callback(childNodes);
        });
    }

    /**
     * Check if a node should use the virtual iterator to get the next or previous sibling.
     * @param node The node to check.
     * @returns Whether the node should use the virtual iterator.
     */
    shouldUseVirtualIterator(node: Node): boolean {
        return this.virtualCurrentNode === node || this.fragment.contains(node);
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
        const sibling = this.childNodes[io - 1] ?? null;
        // Lit and uhtml uses mark comments positions to insert and remove nodes.
        // If the node is a comment, we are assuming that the rendering engine is iterating over the previous render result,
        // since no other framework knows about the comment.
        if (node.nodeType === Node.COMMENT_NODE || this.virtualCurrentNode === node) {
            this.virtualCurrentNode = sibling;
        } else {
            this.virtualCurrentNode = null;
        }
        return sibling;
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
        const sibling = this.childNodes[io + 1] ?? null;
        // Lit and uhtml uses mark comments positions to insert and remove nodes.
        // If the node is a comment, we are assuming that the rendering engine is iterating over the previous render result,
        // since no other framework knows about the comment.
        if (node.nodeType === Node.COMMENT_NODE || this.virtualCurrentNode === node) {
            this.virtualCurrentNode = sibling;
        } else {
            this.virtualCurrentNode = null;
        }
        return sibling;
    }

    /**
     * Set the owner realm for a node.
     * @param node The node to set the owner realm for.
     */
    own(node: Node): void {
        // Set the owner realm for the node.
        setOwnerRealm(node, this);
    }

    /**
     * Adopt a node to a realm.
     * @param realm The realm to adopt the node to.
     * @param node The node to adopt.
     */
    protected adoptNode(node: Node): void {
        const parentRealm = getParentRealm(node);
        if (parentRealm === this) {
            return;
        }
        if (parentRealm) {
            throw new Error('Node already has a parent realm.');
        }
        setParentRealm(node, this);
        this.fragment.appendChild(node);
    }

    /**
     * Release a node from the realm.
     * @param node The node to release.
     */
    protected releaseNode(node: Node): void {
        if (getParentRealm(node) === this) {
            setParentRealm(node, null);
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
                this.adoptNode(childNode);
                acc.push(childNode);
            } else if (node.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */) {
                this.importNodes(Array.from(node.childNodes), acc);
            } else {
                acc.push(node);
            }
            return acc;
        }, acc);
    }

    /**
     * Adopt nodes to the realm.
     * @param nodes Nodes to adopt.
     */
    protected adoptNodes(nodes: Node[]): void {
        for (const node of nodes) {
            const parentRealm = getParentRealm(node);
            if (parentRealm) {
                if (!parentRealm.contains(this)) {
                    parentRealm.removeChild(node);
                    this.adoptNode(node);
                } else if (parentRealm === this) {
                    const io = this.childNodes.indexOf(node);
                    this.childNodes.splice(io, 1);
                }
            } else {
                this.adoptNode(node);
            }
        }
    }

    /**
     * Insert nodes before a reference node in the slot child nodes array.
     * @param nodes The nodes to insert.
     * @param referenceNode The reference node to insert before.
     */
    protected insertNodesBefore(nodes: Node[], referenceNode: Node | null): void {
        const io = referenceNode ? this.childNodes.indexOf(referenceNode) : -1;
        if (io === -1) {
            this.childNodes.push(...nodes);
            return;
        }
        this.childNodes.splice(io, 0, ...nodes);
    }

    /**
     * Append nodes to the realm.
     * @param nodes The nodes to append.
     */
    append(...nodes: (Node | string)[]): void {
        const resolvedNodes = this.importNodes(nodes);
        this.adoptNodes(resolvedNodes);
        this.insertNodesBefore(resolvedNodes, null);
        this.notify();
    }

    /**
     * Prepend nodes to the realm.
     * @param nodes The nodes to prepend.
     */
    prepend(...nodes: (Node | string)[]): void {
        const resolvedNodes = this.importNodes(nodes);
        this.adoptNodes(resolvedNodes);
        this.insertNodesBefore(resolvedNodes, this.childNodes[0]);
        this.notify();
    }

    /**
     * Remove nodes from the realm.
     * @param node The node to remove.
     */
    removeChild(node: Node): void {
        const io = this.childNodes.indexOf(node);
        if (io === -1) {
            throw new Error(
                "Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node."
            );
        }
        this.releaseNode(node);
        this.childNodes.splice(io, 1);
        if (this.fragment.contains(node)) {
            this.fragment.removeChild(node);
        }
        this.notify();
    }

    /**
     * Replaces a realm node with nodes, while replacing strings in nodes with equivalent Text nodes.
     * @param nodes The nodes or strings to replace node with. Strings are replaced with equivalent Text nodes.
     * @param referenceNode The node to replace.
     */
    replaceChild(nodes: (string | Node)[], referenceNode: Node): void {
        const resolvedNodes = this.importNodes(nodes);
        const io = this.childNodes.indexOf(referenceNode);
        if (io === -1) {
            throw new Error(
                "Failed to execute 'replaceChild' on 'Node': The node to be replaced is not a child of this node."
            );
        }
        let finalReferenceNode: Node | null = this.childNodes[io + 1] || null;
        while (finalReferenceNode && resolvedNodes.includes(finalReferenceNode)) {
            const io = this.childNodes.indexOf(finalReferenceNode);
            finalReferenceNode = this.childNodes[io + 1] || null;
        }
        this.releaseNode(referenceNode);
        this.childNodes.splice(io, 1);
        if (this.fragment.contains(referenceNode)) {
            this.fragment.removeChild(referenceNode);
        }
        this.adoptNodes(resolvedNodes);
        this.insertNodesBefore(resolvedNodes, finalReferenceNode);
        this.notify();
    }

    /**
     * Inserts nodes or contents in the realm before node.
     * @param nodes The nodes to be inserted.
     * @param referenceNode The node before which new nodes are to be inserted.
     */
    insertBefore(nodes: (string | Node)[], referenceNode: Node | null): void {
        const resolvedNodes = this.importNodes(nodes);
        let finalReferenceNode: Node | null = null;
        if (referenceNode) {
            const io = this.childNodes.indexOf(referenceNode);
            if (io === -1) {
                throw new Error(
                    "Failed to execute 'insertBefore' on 'Node': The node before which the new nodes are to be inserted is not a child of this node."
                );
            }
            finalReferenceNode = this.childNodes[io] || null;
            while (finalReferenceNode && resolvedNodes.includes(finalReferenceNode)) {
                const io = this.childNodes.indexOf(finalReferenceNode);
                finalReferenceNode = this.childNodes[io + 1] || null;
            }
        }
        this.adoptNodes(resolvedNodes);
        this.insertNodesBefore(resolvedNodes, referenceNode);
        this.notify();
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
    const insertBeforeDesc = getOwnPropertyDescriptor(NodePrototype, 'insertBefore') as PropertyDescriptor;
    const removeChildDesc = getOwnPropertyDescriptor(NodePrototype, 'removeChild') as PropertyDescriptor;

    defineProperty(NodePrototype, 'parentNode', {
        ...getParentNodeDesc,
        get() {
            const parentRealm = getParentRealm(this);
            if (!parentRealm || parentRealm.open) {
                return getParentNodeDesc.get?.call(this);
            }
            if (!this.isConnected) {
                // The slotted node is not connected to the DOM,
                // because it is a comment or is using a not handled slot name.
                // We return the root component as the parent node.
                return parentRealm.node;
            }
            const parentNode = getParentNodeDesc.get?.call(this);
            if (!parentNode) {
                return null;
            }

            return parentNode;
        },
    });

    defineProperty(NodePrototype, 'previousSibling', {
        ...getPreviousSiblingDesc,
        get() {
            const parentRealm = getParentRealm(this);
            if (parentRealm && !parentRealm.open && parentRealm.shouldUseVirtualIterator(this)) {
                // The slotted node is not connected to the DOM or the rendering engine is iterating over the render result.
                return parentRealm.getPreviousSibling(this);
            }
            return getPreviousSiblingDesc.get?.call(this);
        },
    });

    defineProperty(NodePrototype, 'nextSibling', {
        ...getNextSiblingDesc,
        get() {
            const parentRealm = getParentRealm(this);
            if (parentRealm && !parentRealm.open && parentRealm.shouldUseVirtualIterator(this)) {
                // The slotted node is not connected to the DOM or the rendering engine is iterating over the render result.
                return parentRealm.getNextSibling(this);
            }
            return getNextSiblingDesc.get?.call(this);
        },
    });

    // Override editing methods to ensure that they are called on the root component.
    // Svelte uses these methods to insert and remove nodes.
    defineProperty(ElementPrototype, 'before', {
        ...beforeDesc,
        value(...nodes: (Node | string)[]): void {
            const parentRealm = getParentRealm(this);
            if (!parentRealm || parentRealm.open) {
                beforeDesc.value?.apply(this, nodes);
                return;
            }
            parentRealm.insertBefore(nodes, this);
        },
    });

    defineProperty(CharacterDataPrototype, 'before', {
        ...commentBeforeDesc,
        value(...nodes: (Node | string)[]): void {
            const parentRealm = getParentRealm(this);
            if (!parentRealm || parentRealm.open) {
                commentBeforeDesc.value?.apply(this, nodes);
                return;
            }
            parentRealm.insertBefore(nodes, this);
        },
    });

    defineProperty(ElementPrototype, 'after', {
        ...afterDesc,
        value(...nodes: (Node | string)[]): void {
            const parentRealm = getParentRealm(this);
            if (!parentRealm || parentRealm.open) {
                afterDesc.value?.apply(this, nodes);
                return;
            }
            parentRealm.insertBefore(nodes, parentRealm.getNextSibling(this));
        },
    });

    defineProperty(CharacterDataPrototype, 'after', {
        ...commentAfterDesc,
        value(...nodes: (Node | string)[]): void {
            const parentRealm = getParentRealm(this);
            if (!parentRealm || parentRealm.open) {
                commentAfterDesc.value?.apply(this, nodes);
                return;
            }
            parentRealm.insertBefore(nodes, parentRealm.getNextSibling(this));
        },
    });

    defineProperty(ElementPrototype, 'replaceWith', {
        ...replaceWithDesc,
        value(...nodes: (Node | string)[]): void {
            const parentRealm = getParentRealm(this);
            if (!parentRealm || parentRealm.open) {
                replaceWithDesc.value?.apply(this, nodes);
                return;
            }
            parentRealm.replaceChild(nodes, this);
        },
    });

    defineProperty(CharacterDataPrototype, 'replaceWith', {
        ...commentReplaceWithDesc,
        value(...nodes: (Node | string)[]): void {
            const parentRealm = getParentRealm(this);
            if (!parentRealm || parentRealm.open) {
                commentReplaceWithDesc.value?.apply(this, nodes);
                return;
            }
            parentRealm.replaceChild(nodes, this);
        },
    });

    defineProperty(ElementPrototype, 'remove', {
        ...removeDesc,
        value(): void {
            const parentRealm = getParentRealm(this);
            if (!parentRealm || parentRealm.open) {
                removeDesc.value?.call(this);
                return;
            }
            parentRealm.removeChild(this);
        },
    });

    defineProperty(CharacterDataPrototype, 'remove', {
        ...commentRemoveDesc,
        value(): void {
            const parentRealm = getParentRealm(this);
            if (!parentRealm || parentRealm.open) {
                commentRemoveDesc.value?.call(this);
                return;
            }
            parentRealm.removeChild(this);
        },
    });

    // Some rendering engines like vue and prect uses `parentNode.insertBefore(node, referenceNode)` to insert a node,
    // so we need to insert the node in the owner realm when the parent node is part
    // of the internal component template.

    defineProperty(NodePrototype, 'insertBefore', {
        ...insertBeforeDesc,
        value(node: Node, referenceNode: Node | null): Node {
            const realm = isComponent(this) ? this.realm : null;
            if (realm?.open) {
                return insertBeforeDesc.value?.call(this, node, referenceNode);
            }
            const ownerRealm = getOwnerRealm(this);
            if (ownerRealm && !ownerRealm.open) {
                ownerRealm.insertBefore([node], referenceNode);
                return node;
            }
            return insertBeforeDesc.value?.call(this, node, referenceNode);
        },
    });

    defineProperty(NodePrototype, 'removeChild', {
        ...removeChildDesc,
        value(child: Node): Node {
            const ownerRealm = getOwnerRealm(this);
            if (ownerRealm && !ownerRealm.open && getParentRealm(child) === ownerRealm) {
                ownerRealm.removeChild(child);
                return child;
            }
            return removeChildDesc.value?.call(this, child);
        },
    });
}
