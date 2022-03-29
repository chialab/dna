/**
 * Check if node has a specific keyword.
 * @param {import('@custom-elements-manifest/analyzer/node_modules/typescript').Node} node
 * @param {import('typescript').SyntaxKind} keyword
 * @return {boolean}
 */
export function hasKeyword(node, keyword) {
    return node.modifiers?.some((mod) => mod.kind === keyword) ?? false;
}

/**
 * Get the proper decorator expression.
 * @param {import('@custom-elements-manifest/analyzer/node_modules/typescript').Decorator} decorator
 */
export function getDecoratorExpression(decorator) {
    return /** @type {import('@custom-elements-manifest/analyzer/node_modules/typescript').CallExpression} */ (decorator.expression);
}

/**
 * Get decorator call expression arguments.
 * @param {import('@custom-elements-manifest/analyzer/node_modules/typescript').Decorator} decorator
 */
export function getDecoratorArguments(decorator) {
    const expression = /** @type {import('@custom-elements-manifest/analyzer/node_modules/typescript').CallExpression} */ (decorator.expression);

    return /** @type {import('@custom-elements-manifest/analyzer/node_modules/typescript').Node[]} */ ([...(expression?.arguments ?? [])]);
}

/**
 * Get class/method/property decorator by name.
 * @param {import('@custom-elements-manifest/analyzer/node_modules/typescript').Node} node
 * @param {string} name
 */
export function getDecorator(node, name) {
    return node.decorators?.find((decorator) =>
        getDecoratorExpression(decorator)?.expression?.getText() === name ||
        getDecoratorExpression(decorator)?.getText() === name
    );
}

/**
 * Convert field to attribute.
 * @param {import('custom-elements-manifest/schema').ClassField} field
 * @param {string} attrName
 * @return {import('custom-elements-manifest/schema').Attribute}
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
 * @param {typeof import('@custom-elements-manifest/analyzer/node_modules/typescript')} ts
 * @param {import('@custom-elements-manifest/analyzer/node_modules/typescript').ObjectLiteralExpression} node
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
 * @param {typeof import('@custom-elements-manifest/analyzer/node_modules/typescript')} ts
 * @param {import('@custom-elements-manifest/analyzer/node_modules/typescript').ObjectLiteralExpression} node
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
 * @param {typeof import('@custom-elements-manifest/analyzer/node_modules/typescript')} ts
 * @param {import('@custom-elements-manifest/analyzer/node_modules/typescript').GetAccessorDeclaration|import('@custom-elements-manifest/analyzer/node_modules/typescript').PropertyDeclaration} node
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
 * @param {Partial<import('custom-elements-manifest/schema').JavaScriptModule>} moduleDoc
 * @param {import('@custom-elements-manifest/analyzer').Context} context
 * @param {string} name
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
 * @param {Partial<import('custom-elements-manifest/schema').JavaScriptModule>} moduleDoc
 * @param {string} className
 */
export function getClassDeclaration(moduleDoc, className) {
    return /** @type {import('custom-elements-manifest/schema').CustomElement|undefined} */ (moduleDoc.declarations?.find((declaration) => declaration.name === className));
}
