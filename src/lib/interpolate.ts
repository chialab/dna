import { Scope } from './Scope';

/**
 * Split a string into chunks, where even indexes are real strings and odd indexes are expressions.
 */
const PARSE_REGEX = /\[\[(.*?)\]\]/g;

/**
 * Escape single quote from expressions.
 *
 * @param text The text to escape
 */
function escape(text: string): string {
    return text.replace(/'/g, '\\\'').replace(/\n/g, '\\n');
}

/**
 * Symbol for interpolated functions.
 */
const INTERPOLATED_SYMBOL = Symbol();

export type InterpolateFunction = ((this: Scope) => string) & { [INTERPOLATED_SYMBOL]?: true };

export function isInterpolateFunction(target: any): target is InterpolateFunction {
    return !!(target as InterpolateFunction)[INTERPOLATED_SYMBOL];
}

/**
 * Create an interpolated function.
 *
 * @param expression The expression to interpolate
 */
export function interpolate(expression: string): InterpolateFunction | string {
    // split the expression into chunks
    const chunks = expression.trim().split(PARSE_REGEX);
    if (chunks.length === 1) {
        return expression;
    }
    // the generated function body
    let body = 'with(this) return ';

    body += chunks
        .map((match, index) => {
            if (!match) {
                return;
            }
            if (index % 2 === 0) {
                // even indexes are just strings
                return `'${escape(match)}'`;
            }
            return `(${match})`;
        })
        .filter(Boolean)
        .join('+');

    body += ';';

    const fn = new Function(body) as InterpolateFunction;
    fn[INTERPOLATED_SYMBOL] = true;
    return fn;
}
