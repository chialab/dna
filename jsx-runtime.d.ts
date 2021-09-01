import { h, Fragment } from './types/JSX';

export { h, Fragment };
export const jsx: (tagOrComponent, props) => ReturnType<typeof h>;
export const jsxs: typeof jsx;
