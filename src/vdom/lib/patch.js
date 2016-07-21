import { applyPatch as patchOp } from './patch-op.js';

function ascending(a, b) {
    return a > b ? 1 : -1;
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false;
    }

    let minIndex = 0;
    let maxIndex = indices.length - 1;
    let currentIndex;
    let currentItem;

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0;
        currentItem = indices[currentIndex];

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right;
        } else if (currentItem < left) {
            minIndex = currentIndex + 1;
        } else if (currentItem > right) {
            maxIndex = currentIndex - 1;
        } else {
            return true;
        }
    }
    return false;
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {};
    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode;
        }

        let vChildren = tree.children;

        if (vChildren) {
            let childNodes = rootNode.childNodes;
            for (let i = 0; i < tree.children.length; i++) {
                rootIndex += 1;
                let vChild = vChildren[i] || [];
                let nextIndex = rootIndex + (vChild.count || 0);
                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex);
                }

                rootIndex = nextIndex;
            }
        }
    }

    return nodes;
}

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {};
    }
    indices.sort(ascending);
    return recurse(rootNode, tree, indices, nodes, 0);
}

function applyPatch(rootNode, domNode, patchList) {
    if (!domNode) {
        return rootNode;
    }
    let newNode;
    if (Array.isArray(patchList)) {
        for (let i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode);
            if (domNode === rootNode) {
                rootNode = newNode;
            }
        }
    } else {
        newNode = patchOp(patchList, domNode);
        if (domNode === rootNode) {
            rootNode = newNode;
        }
    }
    return rootNode;
}

function patchRecursive(rootNode, patches) {
    let indices = Object.keys(patches)
        .filter((key) => key !== 'a')
        .map((key) => Number(key));
    if (indices.length === 0) {
        return rootNode;
    }
    let index = domIndex(rootNode, patches.a, indices);
    for (let i = 0; i < indices.length; i++) {
        let nodeIndex = indices[i];
        rootNode = applyPatch(
            rootNode,
            index[nodeIndex],
            patches[nodeIndex]
        );
    }

    return rootNode;
}

export function patch(rootNode, patches) {
    return patchRecursive(rootNode, patches);
}
