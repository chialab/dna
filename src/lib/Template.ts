import { createSymbolKey } from './symbols';
import { InterpolationFunction } from './InterpolationFunction';
import { HyperFunction } from './HyperFunction';

/**
 * A Symbol which contains a filter function for a list of template items.
 */
const FILTER_SYMBOL = createSymbolKey();

/**
 * The atomic template item.
 * It can be a node, a Hyper or Interpolate function or a primitive value.
 */
export type TemplateItem = Element | Text | HyperFunction | InterpolationFunction | string | number | boolean | undefined | null;

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

/**
 * Create a new list of items with a filter.
 *
 * @param template A template items list.
 * @param filter The filter function to bind.
 * @return A new list with the filter property populated.
 */
export function createFilterableTemplateItems(template: TemplateItems, filter: TemplateFilter): TemplateItems {
    const filterableItems = (template || []).slice(0) as TemplateItems;
    (filterableItems as any)[FILTER_SYMBOL] = filter;
    return filterableItems;
}

/**
 * Get the filter function for a template.
 *
 * @param template The template target.
 * @return A filter function (if defined).
 */
export function getTemplateItemsFilter(template: Template): TemplateFilter | undefined {
    return (template as any)[FILTER_SYMBOL];
}
