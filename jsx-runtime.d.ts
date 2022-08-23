import { h, Fragment } from './types/JSX';

export { h, Fragment };
export const jsx: (tagOrComponent: Parameters<typeof h>[0], properties: Parameters<typeof h>[1], key?: unknown) => ReturnType<typeof h>;
export const jsxs: typeof jsx;
