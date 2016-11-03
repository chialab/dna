import { DOM } from '@dnajs/core';

function onCreation(nodes) {
    [].forEach.call(nodes, (node) => {
        if (!node.is) {
            if(DOM.create(node)) {
                DOM.connect(node);
            }
        } else {
            DOM.connect(node);
        }
        if (node.children) {
            onCreation(node.children);
        }
    });
}

const OBSERVER = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        switch (mutation.type) {
        case 'childList': {
            if (mutation.addedNodes) {
                onCreation(mutation.addedNodes);
            }
            if (mutation.removedNodes) {
                mutation.removedNodes.forEach((node) => {
                    DOM.disconnect(node);
                });
            }
            break;
        }
        case 'attributes': {
            let attributeName = mutation.attributeName;
            if (attributeName === 'is') {
                break;
            }
            let node = mutation.target;
            DOM.update(
                node,
                attributeName,
                mutation.oldValue,
                node.getAttribute(attributeName)
            );
            break;
        }
        }
    });
});

OBSERVER.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
});
