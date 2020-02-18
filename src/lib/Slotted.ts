import { createSymbolKey } from './symbols';
import { TemplateItems, Template } from './Template';

/**
 * A Symbol which contains slotted children of a Component.
 */
const SLOTTED_SYMBOL = createSymbolKey();

/**
 * Get slotted children of a template item.
 * @param template The template target with slotted children.
 * @return A list of child template items.
 */
export const getSlotted = (template: Template): TemplateItems => (template as any)[SLOTTED_SYMBOL];

/**
 * Set slotted children to a template item.
 * @param template The template target.
 * @param slotted A list of child template items.
 */
export const setSlotted = (template: Template, slotted: TemplateItems): void => {
    (template as any)[SLOTTED_SYMBOL] = slotted;
};
