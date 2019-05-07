import { InterpolateFunction } from './interpolate';
import { HyperFunction } from './h';

const FILTER_SYMBOL = Symbol();

export type TemplateItem = HTMLElement | Text | Function | HyperFunction | InterpolateFunction | string | boolean;

export type TemplateItems = TemplateItem[];

export type TemplateFilter = (item: HTMLElement | Text) => boolean;

export type Template = TemplateItem | TemplateItems;

export function createFilterableTemplateItems(items: TemplateItems, filter: TemplateFilter): TemplateItems {
    const filterableItems = (items || []).slice(0) as TemplateItems;
    (filterableItems as any)[FILTER_SYMBOL] = filter;
    return filterableItems;
}

export function getTemplateItemsFilter(template: Template): TemplateFilter | undefined {
    return (template as any)[FILTER_SYMBOL];
}
