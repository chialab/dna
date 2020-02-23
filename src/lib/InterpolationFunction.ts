import { createSymbolKey } from './symbols';

/**
 * Symbol for interpolation functions.
 */
const INTERPOLATION_SYMBOL: unique symbol = createSymbolKey() as any;

/**
 * A function that interpolates content in a string using a render Scope.
 */
export type InterpolationFunction = (this: object) => string;

/**
 * Flag a function as InterpolationFunction.
 * @ignore
 * @param fn The function to flag.
 * @return The updated function.
 */
const createInterpolationFunction = (fn: Function): InterpolationFunction => {
    (fn as any)[INTERPOLATION_SYMBOL] = true;
    return fn as InterpolationFunction;
};

/**
 * Check if the reference is an InterpolationFunction.
 * @param target The reference to check.
 * @return The reference is a InterpolateFunction.
 */
export const isInterpolationFunction = (target: any): target is InterpolationFunction => !!target[INTERPOLATION_SYMBOL];

/**
 * Split a string into chunks, where even indexes are real strings and odd indexes are expressions.
 */
const PARSE_REGEX = /\{\{(.*?)\}\}/g;

/**
 * Escape single quote from expressions.
 *
 * @param text The text to escape
 */
const escape = (text: string): string => text.replace(/'/g, '\\\'').replace(/\n/g, '\\n');

/**
 * Create an InterpolationFunction.
 *
 * @param expression The expression to compile.
 * @return A simple string if the expression does not need interpolation, or an InterpolationFunction for content generation.
 */
export const compile = (expression: string): InterpolationFunction => {
    // split the expression into chunks
    const chunks = expression.trim().split(PARSE_REGEX);
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
};
