import { isArray, isFunction } from './typeof.js';

/**
 * Notifications handler for DNA components.
 * @namespace DNA.notifications
 * @memberof DNA
 */
export const notifications = {
    /**
     * A list of callbacks for component creation.
     * @type {Array}
     * @memberof DNA.notifications
     */
    created: [],
    /**
     * A list of callbacks for component connection.
     * @type {Array}
     * @memberof DNA.notifications
     */
    connected: [],
    /**
     * A list of callbacks for component disconnection.
     * @type {Array}
     * @memberof DNA.notifications
     */
    disconnected: [],
    /**
     * A list of callbacks for component update.
     * @type {Array}
     * @memberof DNA.notifications
     */
    updated: [],
    /**
     * Attach a callback for a notifications.
     * @method on
     * @memberof DNA.notifications
     *
     * @param {String} notification The notification name.
     * @param {Function} callback The callback to trigger.
     */
    on(notification, callback) {
        if (isArray(this[notification]) && isFunction(callback)) {
            this[notification].push(callback);
        }
    },
    /**
     * Remove a callback for a notifications.
     * @method off
     * @memberof DNA.notifications
     *
     * @param {String} notification The notification name.
     * @param {Function} callback The callback to remove.
     */
    off(notification, callback) {
        if (isArray(this[notification]) && isFunction(callback)) {
            let io = this[notification].indexOf(callback);
            if (io !== -1) {
                this[notification].splice(io);
            }
        }
    },
    /**
     * Trigger a list of callbacks.
     * @method trigger
     * @memberof DNA.notifications
     *
     * @param {String} notification The notification name to trigger.
     * @param {Object} elem The component scope.
     * @param {*} ...args All the arguments to pass to the callback.
     */
    trigger(notification, elem, ...args) {
        if (isArray(this[notification])) {
            this[notification].forEach((clb) => clb.call(null, elem, ...args));
        }
    },
};
