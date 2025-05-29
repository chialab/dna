let count = 0;

export const IS_BROWSER = typeof window !== 'undefined' && typeof document !== 'undefined';
export const IS_NODE = typeof process !== 'undefined' && typeof process.versions?.node !== 'undefined';

/**
 * Create unique custom element name.
 * @returns Unique custom element name.
 */
export function getComponentName(): string {
    return `test-element-${count++}`;
}
