import { TemplateItems, Template } from './Template';

/**
 * A Symbol which contains slotted children of a Component.
 */
const SLOTTED_SYMBOL = Symbol();

/**
 * Get slotted children of a template item.
 * @param template The template target with slotted children.
 * @return A list of child template items.
 */
export function getSlotted(template: Template): TemplateItems {
    return (template as any)[SLOTTED_SYMBOL];
}

/**
 * Set slotted children to a template item.
 * @param template The template target.
 * @param slotted A list of child template items.
 */
export function setSlotted(template: Template, slotted: TemplateItems): void {
    (template as any)[SLOTTED_SYMBOL] = slotted;
}
