let count = 0;

/**
 * Create unique custom element name.
 * @returns Unique custom element name.
 */
export function getComponentName() {
    return `test-element-${count++}`;
}
