/* eslint-env mocha */

import { define, DOM, notifications, BaseComponent } from '../index.js';

class TestComponent extends BaseComponent {
    static get observedAttributes() {
        return ['name'];
    }
    get properties() {
        return {
            name: String,
        };
    }
}

const WRAPPER = document.body;
define('test-notification-component', TestComponent);

describe('Unit: BaseComponent', () => {
    let created = false;
    notifications.on('created', (elem) => {
        if (elem.is === 'test-notification-component') {
            created = true;
        }
    });

    const elem = DOM.createElement('test-notification-component');

    describe('> created', () => {
        it('check if element creation fires a notification', () => {
            assert(created);
        });
    });

    describe('> attached', () => {
        let attached = false;
        notifications.on('connected', (elem) => {
            if (elem.is === 'test-notification-component') {
                attached = true;
            }
        });
        it('check if element connection fires a notification', () => {
            DOM.appendChild(WRAPPER, elem);
            assert(attached);
        });
    });

    describe('> update', () => {
        let updated = false;
        notifications.on('updated', (elem, prop) => {
            if (elem.is === 'test-notification-component' && prop === 'name') {
                updated = true;
            }
        });
        DOM.setAttribute(elem, 'name', 'Alan');
        it('check if element update fires a notification', () => {
            assert(updated);
        });
    });

    describe('> off', () => {
        let changed = 0;
        let callback = (elem, prop) => {
            if (elem.is === 'test-notification-component' && prop === 'name') {
                changed++;
            }
        };
        notifications.on('updated', callback);
        DOM.setAttribute(elem, 'name', 'Bill');
        notifications.off('updated', callback);
        DOM.setAttribute(elem, 'name', 'Steve');
        it('check if element update fires a notification', () => {
            assert.equal(elem.name, 'Steve');
            assert.equal(changed, 1);
        });
    });

    describe('> detached', () => {
        let detached = false;
        notifications.on('disconnected', (elem) => {
            if (elem.is === 'test-notification-component') {
                detached = true;
            }
        });
        it('check if element disconnection fires a notification', () => {
            DOM.removeChild(WRAPPER, elem);
            assert(detached);
        });
    });
});
