/**
 * A list of registered DNA components.
 * @type {Object}.
 */
const REGISTRY = {};

/**
 * Add/retrieve an entry to/from the DNA registry.
 * @param {String} tagName The tag name of the Component.
 * @param {Function} constructor The Component constructor.
 * @return {Function} The Component constructor.
 */
export function registry(tagName, constructor) {
    if (tagName) {
        let lower = tagName.toLowerCase();
        if (constructor) {
            REGISTRY[lower] = constructor;
        }
        return REGISTRY[lower];
    }
    return null;
}
