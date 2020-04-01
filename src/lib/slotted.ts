import { createSymbolKey } from './symbols';
import { Template, TemplateItems } from './Template';

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
 * @param slotted A list of child nodes.
 */
export const setSlotted = (template: Template, slotted: TemplateItems): TemplateItems => (template as any)[SLOTTED_SYMBOL] = slotted;
