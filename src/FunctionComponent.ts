import type { Template } from './JSX';
import type { Context } from './Context';

/**
 * A re-render function.
 */
export type UpdateRequest = () => boolean;

/**
 * A function that returns a template.
 *
 * @param props A set of properties with children.
 * @param context The current render context.
 * @returns A template.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FunctionComponent<P = any, N extends Node = Node> = (
    props: P & { key?: unknown; children?: Template[] },
    context: Context<N, P>,
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
    sameContext: Context<N, P>
) => Template;
