import { HyperNode } from './HyperNode';

/**
 * The atomic template item.
 * It can be a node, a Hyper or Interpolate function or a primitive value.
 */
export type TemplateItem = Element | Text | Node | HyperNode | string | number | boolean | undefined | null;

/**
 * A list of template items.
 */
export type TemplateItems = TemplateItem[];

/**
 * A filter function signature for template items.
 *
 * @param item The template item to check.
 * @return A truthy value for valid items, a falsy for value for invalid ones.
 */
export type TemplateFilter = (item: TemplateItem) => boolean;

/**
 * A generic template. Can be a single atomic item or a list of items.
 */
export type Template = TemplateItem | TemplateItems;
