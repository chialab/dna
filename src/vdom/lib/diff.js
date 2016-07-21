import { VirtualPatch } from './patch-op.js';
import { VirtualHook } from './hook.js';
import { VirtualNode } from './node.js';
import { VirtualText } from './text.js';

function remove(arr, index, key) {
    arr.splice(index, 1);

    return {
        from: index,
        key,
    };
}

function keyIndex(children) {
    let keys = {};
    let free = [];
    let length = children.length;

    for (let i = 0; i < length; i++) {
        let child = children[i];

        if (child.key) {
            keys[child.key] = i;
        } else {
            free.push(i);
        }
    }

    return {
        keys,     // A hash of key name to index
        free,     // An array of unkeyed item indices
    };
}

function appendPatch(apply, patch) {
    if (apply) {
        if (Array.isArray(apply)) {
            apply.push(patch);
        } else {
            apply = [apply, patch];
        }
        return apply;
    }
    return patch;
}

function undefinedKeys(obj) {
    let result = {};

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            result[key] = undefined;
        }
    }

    return result;
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (vNode instanceof VirtualNode) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VirtualPatch(
                    VirtualPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            );
        }

        if (vNode.descendantHooks) {
            let children = vNode.children;
            let len = children.length;
            for (let i = 0; i < len; i++) {
                let child = children[i];
                index += 1;

                unhook(child, patch, index);

                if (child instanceof VirtualNode && child.count) {
                    index += child.count;
                }
            }
        }
    }
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index);
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    let bChildIndex = keyIndex(bChildren);
    let bKeys = bChildIndex.keys;
    let bFree = bChildIndex.free;

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null,
        };
    }

    // O(N) time, O(N) memory
    let aChildIndex = keyIndex(aChildren);
    let aKeys = aChildIndex.keys;
    let aFree = aChildIndex.free;

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null,
        };
    }

    // O(MAX(N, M)) memory
    let newChildren = [];

    let freeIndex = 0;
    let freeCount = bFree.length;
    let deletedItems = 0;

    // Iterate through a and match a node in b
    // O(N) time,
    for (let i = 0; i < aChildren.length; i++) {
        let aItem = aChildren[i];
        let itemIndex;

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key];
                newChildren.push(bChildren[itemIndex]);
            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++;
                newChildren.push(null);
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++];
                newChildren.push(bChildren[itemIndex]);
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++;
                newChildren.push(null);
            }
        }
    }

    let lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex];

    // Iterate through b and append any new keys
    // O(M) time
    for (let j = 0; j < bChildren.length; j++) {
        let newItem = bChildren[j];

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem);
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem);
        }
    }

    let simulate = newChildren.slice();
    let simulateIndex = 0;
    let removes = [];
    let inserts = [];
    let simulateItem;

    for (let k = 0; k < bChildren.length;) {
        let wantedItem = bChildren[k];
        simulateItem = simulate[simulateIndex];

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null));
            simulateItem = simulate[simulateIndex];
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key));
                        simulateItem = simulate[simulateIndex];
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({
                                key: wantedItem.key,
                                to: k,
                            });
                        } else {
                            // items are matching, so skip ahead
                            simulateIndex++;
                        }
                    } else {
                        inserts.push({
                            key: wantedItem.key,
                            to: k,
                        });
                    }
                } else {
                    inserts.push({
                        key: wantedItem.key,
                        to: k,
                    });
                }
                k++;
            } else if (simulateItem && simulateItem.key) {
                // a key in simulate has no matching wanted key, remove it
                removes.push(remove(simulate, simulateIndex, simulateItem.key));
            }
        } else {
            simulateIndex++;
            k++;
        }
    }

    // remove all the remaining nodes from simulate
    while (simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex];
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key));
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null,
        };
    }

    return {
        children: newChildren,
        moves: {
            removes,
            inserts,
        },
    };
}

function diffChildren(a, b, patch, apply, index) {
    let aChildren = a.children;
    let orderedSet = reorder(aChildren, b.children);
    let bChildren = orderedSet.children;

    let aLen = aChildren.length;
    let bLen = bChildren.length;
    let len = aLen > bLen ? aLen : bLen;

    for (let i = 0; i < len; i++) {
        let leftNode = aChildren[i];
        let rightNode = bChildren[i];
        index += 1;

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VirtualPatch(VirtualPatch.INSERT, null, rightNode));
            }
        } else {
            // eslint-disable-next-line
            walk(leftNode, rightNode, patch, index);
        }

        if (leftNode instanceof VirtualNode && leftNode.count) {
            index += leftNode.count;
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VirtualPatch(
            VirtualPatch.ORDER,
            a,
            orderedSet.moves
        ));
    }

    return apply;
}

function diffProps(a, b) {
    let res;

    for (let aKey in a) {
        if (!(aKey in b)) {
            res = res || {};
            res[aKey] = undefined;
        }

        let aValue = a[aKey];
        let bValue = b[aKey];

        if (aValue === bValue) {
            continue;
        } else if (aValue && typeof aValue === 'object' && bValue && typeof bValue === 'object') {
            if (Object.getPrototypeOf(bValue) !== Object.getPrototypeOf(aValue)) {
                res = res || {};
                res[aKey] = bValue;
            } else if (bValue instanceof VirtualHook) {
                res = res || {};
                res[aKey] = bValue;
            } else {
                let objectDiff = diffProps(aValue, bValue);
                if (objectDiff) {
                    res = res || {};
                    res[aKey] = objectDiff;
                }
            }
        } else {
            res = res || {};
            res[aKey] = bValue;
        }
    }

    for (let bKey in b) {
        if (!(bKey in a)) {
            res = res || {};
            res[bKey] = b[bKey];
        }
    }

    return res;
}

function walk(a, b, patch, index) {
    if (a === b) {
        return;
    }

    let apply = patch[index];
    let applyClear = false;

    if (b === null) {
        clearState(a, patch, index);
        apply = patch[index];
        apply = appendPatch(apply, new VirtualPatch(VirtualPatch.REMOVE, a, b));
    } else if (b instanceof VirtualNode) {
        if (a instanceof VirtualNode) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                let propsPatch = diffProps(a.properties, b.properties);
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VirtualPatch(VirtualPatch.PROPS, a, propsPatch));
                }
                apply = diffChildren(a, b, patch, apply, index);
            } else {
                apply = appendPatch(apply, new VirtualPatch(VirtualPatch.VNODE, a, b));
                applyClear = true;
            }
        } else {
            apply = appendPatch(apply, new VirtualPatch(VirtualPatch.VNODE, a, b));
            applyClear = true;
        }
    } else if (b instanceof VirtualText) {
        if (!(a instanceof VirtualText)) {
            apply = appendPatch(apply, new VirtualPatch(VirtualPatch.VTEXT, a, b));
            applyClear = true;
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VirtualPatch(VirtualPatch.VTEXT, a, b));
        }
    }

    if (apply) {
        patch[index] = apply;
    }

    if (applyClear) {
        clearState(a, patch, index);
    }
}

export function diff(a, b) {
    let patch = {
        a,
    };
    walk(a, b, patch, 0);
    return patch;
}
