const tags = new Map<string, number>();
const ids = new WeakMap<Node, string>();

/**
 * Generates a unique identifier string using the given element as context.
 * @param context The HTMLElement or FunctionComponent to use as context for generating the unique ID.
 * @returns A unique identifier string.
 */
export function uniqueId(context: Node, ...suffixex: (string | null | undefined)[]): string {
    let id: string;
    if (!ids.has(context)) {
        const tag =
            context.nodeType === Node.ELEMENT_NODE
                ? (context as HTMLElement).tagName.toLowerCase()
                : `fn-${(context.nodeValue as string).toLowerCase()}`;
        const instanceId = (tags.get(tag) ?? 0) + 1;
        tags.set(tag, instanceId);
        id = `${tag}-${instanceId}`;
        ids.set(context, id);
    } else {
        id = ids.get(context) as string;
    }
    if (suffixex.length) {
        return `${id}-${suffixex.filter(Boolean).join('-')}`;
    }
    return id;
}
