import { InterpolateFunction } from './interpolate';
import { HyperFunction } from './h';

const FILTER_SYMBOL = Symbol();

/**
 * A Symbol which contains slotted children of a Component.
 */
const SLOTTED_SYMBOL = Symbol();

export type TemplateItem = HTMLElement | Text | Function | HyperFunction | InterpolateFunction | string | boolean;

export type TemplateItems = (TemplateItem[] & { [FILTER_SYMBOL]?: TemplateFilter });

export type TemplateFilter = (item: HTMLElement | Text) => boolean;

export type Template = (TemplateItem | TemplateItems) & Slotted;

export function createFilterableTemplateItems(items: TemplateItems, filter: TemplateFilter): TemplateItems {
    const filterableItems = (items || []).slice(0) as TemplateItems;
    filterableItems[FILTER_SYMBOL] = filter;
    return filterableItems;
}

export function getTemplateItemsFilter(template: Template): TemplateFilter | undefined {
    return (template as any)[FILTER_SYMBOL];
}

export type Slotted = {
    [SLOTTED_SYMBOL]?: TemplateItems;
};

export function getSlotted(target: any): TemplateItems {
    return target[SLOTTED_SYMBOL];
}

export function setSlotted(target: any, slotted: TemplateItems): void {
    target[SLOTTED_SYMBOL] = slotted;
}
