import type { HyperNode, HyperProperties } from './HyperNode';
import type { Observable } from './Observable';
import type { Context } from './Context';

/**
 * A generic template. Can be a single atomic item or a list of items.
 */
export type Template =
    Element |
    Text |
    Node |
    HyperNode |
    Promise<unknown> |
    Observable<unknown> |
    string |
    number |
    boolean |
    undefined |
    null |
    Template[];

/**
 * A filter function signature for template items.
 *
 * @param item The template item to check.
 * @return A truthy value for valid items, a falsy for value for invalid ones.
 */
export type TemplateFilter = (item: Node) => boolean;

/**
 * A function that returns a template.
 *
 * @param props A set of properties with children.
 * @param state The render state.
 * @param update Update the rendering state.
 * @param live A function that checks if the current template path is still attached to the template.
 * @param context The current render context.
 * @return A template.
 */
export type TemplateFunction = (props: HyperProperties, state: Map<string, unknown>, update: () => boolean, live: () => boolean, context: Context) => Template;
