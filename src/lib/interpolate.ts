import { Scope } from './Scope';

/**
 * Symbol for interpolated functions.
 */
const INTERPOLATED_SYMBOL = Symbol();

/**
 * A function that interpolate content in a string using a render Scope.
 */
export type InterpolateFunction = (this: Scope) => string;

/**
 * Flag a function as InterpolateFunction.
 * @param fn The function to flag.
 * @return The updated function.
 */
export function createInterpolationFunction(fn: Function): InterpolateFunction {
    (fn as any)[INTERPOLATED_SYMBOL] = true;
    return fn as InterpolateFunction;
}

/**
 * Check if the reference is an InterpolateFunction.
 * @param target The reference to check.
 * @return The reference is a InterpolateFunction.
 */
export function isInterpolateFunction(target: any): target is InterpolateFunction {
    return !!target[INTERPOLATED_SYMBOL];
}

/**
 * Split a string into chunks, where even indexes are real strings and odd indexes are expressions.
 */
const PARSE_REGEX = /\{\{(.*?)\}\}/g;

/**
 * Escape single quote from expressions.
 *
 * @param text The text to escape
 */
function escape(text: string): string {
    return text.replace(/'/g, '\\\'').replace(/\n/g, '\\n');
}

/**
 * Create an interpolated function.
 *
 * @param expression The expression to interpolate.
 * @return A simple string if the expression does not need interpolation, or an InterpolateFunction to generate interpolated content.
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
        .filter((statement) => !!statement)
        .join('+');

    body += ';';

    return createInterpolationFunction(new Function(body));
}
