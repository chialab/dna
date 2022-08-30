/**
 * Check if node has a specific keyword.
 * @param {import('@custom-elements-manifest/analyzer/node_modules/typescript').Node} node The AST node.
 * @param {import('typescript').SyntaxKind} keyword The keyword code to check for.
 * @returns {boolean} True if the node has the keyword.
 */
export function hasKeyword(node, keyword) {
    return node.modifiers?.some((mod) => mod.kind === keyword) ?? false;
}

/**
 * Get the proper decorator expression.
 * @param {import('@custom-elements-manifest/analyzer/node_modules/typescript').Decorator} decorator The decorator AST node.
 * @returns {import('@custom-elements-manifest/analyzer/node_modules/typescript').CallExpression} The decorator expression.
 */
export function getDecoratorExpression(decorator) {
    return /** @type {import('@custom-elements-manifest/analyzer/node_modules/typescript').CallExpression} */ (decorator.expression);
}

/**
 * Get decorator call expression arguments.
 * @param {import('@custom-elements-manifest/analyzer/node_modules/typescript').Decorator} decorator The decorator AST node.
 * @returns {import('@custom-elements-manifest/analyzer/node_modules/typescript').Node[]} The decorator call expression arguments.
 */
export function getDecoratorArguments(decorator) {
    const expression = getDecoratorExpression(decorator);

    return /** @type {import('@custom-elements-manifest/analyzer/node_modules/typescript').Node[]} */ ([...(expression?.arguments ?? [])]);
}

/**
 * Get class/method/property decorator by name.
 * @param {typeof import('@custom-elements-manifest/analyzer/node_modules/typescript')} ts The typescript instance.
 * @param {import('@custom-elements-manifest/analyzer/node_modules/typescript').Node} node The AST node.
 * @param {string} name The decorator name.
 * @returns {import('@custom-elements-manifest/analyzer/node_modules/typescript').Decorator|undefined} The decorator AST node.
 */
export function getDecorator(ts, node, name) {
    const decorators = ('getDecorators' in ts) ? (/** @type {{ getDecorators(inputNode: typeof node): typeof node['decorators']  }} */ (/** @type {unknown} */ (ts))).getDecorators(node) : node.decorators;
    if (!decorators) {
        return undefined;
    }
    return decorators.find((decorator) =>
        getDecoratorExpression(decorator)?.expression?.getText() === name ||
        getDecoratorExpression(decorator)?.getText() === name
    );
}

/**
 * Convert field to attribute.
 * @param {import('custom-elements-manifest/schema').ClassField} field The field name.
 * @param {string} attrName The attribute name.
 * @returns {import('custom-elements-manifest/schema').Attribute} The manifest attribute.
 */
export function createAttributeFromField(field, attrName) {
    return {
        name: attrName,
        fieldName: field.name,
        summary: field.summary,
        description: field.description,
        type: field.type,
        default: field.default,
    };
}

/**
 * Check if property has an attribute.
 * @param {typeof import('@custom-elements-manifest/analyzer/node_modules/typescript')} ts The typescript instance.
 * @param {import('@custom-elements-manifest/analyzer/node_modules/typescript').ObjectLiteralExpression} node The property descriptor object AST node.
 * @returns {boolean} True if the property has an attribute field.
 */
export function hasAttribute(ts, node) {
    const properties = node.properties;
    if (!properties) {
        return false;
    }

    for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        if (!ts.isPropertyAssignment(property)) {
            continue;
        }

        if (property.name.getText() === 'attribute') {
            if (property.initializer.kind === ts.SyntaxKind.StringLiteral) {
                return true;
            } else if (property.initializer.kind === ts.SyntaxKind.TrueKeyword) {
                return true;
            }

            return false;
        }
    }
    return false;
}

/**
 * Get attribute name from property decorator options.
 * @param {typeof import('@custom-elements-manifest/analyzer/node_modules/typescript')} ts The typescript instance.
 * @param {import('@custom-elements-manifest/analyzer/node_modules/typescript').ObjectLiteralExpression} node The property descriptor object AST node.
 * @returns {string|null} The attribute name.
 */
export function getAttributeName(ts, node) {
    const properties = node.properties;
    if (!properties) {
        return null;
    }

    for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        if (!ts.isPropertyAssignment(property)) {
            continue;
        }
        if (property.name.getText() === 'attribute') {
            if (ts.isStringLiteral(property.initializer)) {
                return property.initializer.text;
            }

            return null;
        }
    }
    return null;
}

/**
 * Get property declarations from static properties getter.
 * @param {typeof import('@custom-elements-manifest/analyzer/node_modules/typescript')} ts The typescript instance.
 * @param {import('@custom-elements-manifest/analyzer/node_modules/typescript').GetAccessorDeclaration|import('@custom-elements-manifest/analyzer/node_modules/typescript').PropertyDeclaration} node The property getter AST node.
 * @returns {import('@custom-elements-manifest/analyzer/node_modules/typescript').ObjectLiteralExpression|null} The property descriptor object AST node.
 */
export function getPropertiesObject(ts, node) {
    const exp = ts.isGetAccessor(node) ?
        node.body?.statements?.find(ts.isReturnStatement)?.expression :
        node.initializer;

    if (exp && ts.isObjectLiteralExpression(exp)) {
        return exp;
    }

    return null;
}

/**
 * Get module by name.
 * @param {Partial<import('custom-elements-manifest/schema').JavaScriptModule>} moduleDoc The module documentation.
 * @param {import('@custom-elements-manifest/analyzer').Context} context The analyzer context.
 * @param {string} name The module name.
 * @returns {{ package: string }|{ module: string|undefined }} Module info.
 */
export function resolveModuleOrPackageSpecifier(moduleDoc, context, name) {
    const imports = /** @type {{ name: string; isBareModuleSpecifier: boolean; importPath: string }[]} */ (context?.imports ?? []);
    const foundImport = imports.find(_import => _import.name === name);
    if (foundImport) {
        if (foundImport.isBareModuleSpecifier) {
            return { package: foundImport.importPath };
        }
        return { module: new URL(foundImport.importPath, `file:///${moduleDoc.path}`).pathname };
    }
    return { module: moduleDoc.path };
}

/**
 * Get class declaration by name.
 * @param {Partial<import('custom-elements-manifest/schema').JavaScriptModule>} moduleDoc The module documentation.
 * @param {string} className The class name.
 * @returns {import('custom-elements-manifest/schema').CustomElement|undefined} The custom element definition.
 */
export function getClassDeclaration(moduleDoc, className) {
    return /** @type {import('custom-elements-manifest/schema').CustomElement|undefined} */ (moduleDoc.declarations?.find((declaration) => declaration.name === className));
}
