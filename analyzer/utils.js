export function hasKeyword(node, keyword) {
    return node.modifiers?.some((mod) => mod.kind === keyword) ?? false;
}

export function getDecorator(node, name) {
    return node.decorators?.find((decorator) =>
        (decorator.expression?.expression?.getText() === name) || (decorator.expression?.getText() === name)
    );
}

export function isAlsoAttribute(ts, node) {
    const properties = (node.initializer || node).properties;
    if (!properties) {
        return true;
    }

    for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        if (property.name.text === 'attribute' && property.initializer.kind === ts.SyntaxKind.FalseKeyword) {
            return false;
        }
    }
    return true;
}

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

export function getAttributeName(ts, node) {
    const properties = (node.initializer || node).properties;
    if (!properties) {
        return null;
    }

    for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        if (property.name.text === 'attribute' && property.initializer.kind === ts.SyntaxKind.StringLiteral) {
            return property.initializer.text;
        }
    }
    return null;
}

export function getPropertiesObject(ts, node) {
    if (ts.isGetAccessor(node)) {
        return node.body?.statements?.find(ts.isReturnStatement)?.expression;
    }
    return node.initializer;
}

export function resolveModuleOrPackageSpecifier(moduleDoc, context, name) {
    const foundImport = context?.imports?.find(_import => _import.name === name);
    if (foundImport) {
        if (foundImport.isBareModuleSpecifier) {
            return { package: foundImport.importPath };
        }
        return { module: new URL(foundImport.importPath, `file:///${moduleDoc.path}`).pathname };
    }
    return { module: moduleDoc.path };
}
