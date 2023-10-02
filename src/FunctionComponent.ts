import { type Context } from './Context';
import { type Template } from './JSX';

/**
 * A re-render function.
 */
export type UpdateRequest = () => boolean;

/**
 * Function component store.
 */
export type Store = Map<string, unknown>;

/**
 * A function that returns a template.
 *
 * @param props A set of properties with children.
 * @param context The current render context.
 * @returns A template.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FunctionComponent<P = any> = (
    props: P & { key?: unknown; children?: Template[] },
    context: Context & {
        store: Store;
        requestUpdate: UpdateRequest;
    },
    /**
     * @deprecated Use context.requestUpdate method.
     */
    requestUpdate: UpdateRequest,
    /**
     * @deprecated Use the returned value of the context.requestUpdate method.
     */
    isAttached: () => boolean,
    /**
     * @deprecated Use context.
     */
    sameContext: Context
) => Template;
