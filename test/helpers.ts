export const IS_BROWSER = typeof window !== 'undefined' && typeof document !== 'undefined';
export const IS_NODE = typeof process !== 'undefined' && typeof process.versions?.node !== 'undefined';
