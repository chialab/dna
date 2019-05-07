import { TemplateItems } from './Template';

/**
 * A Symbol which contains slotted children of a Component.
 */
const SLOTTED_SYMBOL = Symbol();

export function getSlotted(target: any): TemplateItems {
    return target[SLOTTED_SYMBOL];
}

export function setSlotted(target: any, slotted: TemplateItems): void {
    target[SLOTTED_SYMBOL] = slotted;
}
