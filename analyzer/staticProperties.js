import { hasAttribute, getClassDeclaration, getAttributeName, getPropertiesObject, createAttributeFromField, hasKeyword } from './utils.js';

/**
 * A plugin that collects static properties.
 * @returns {import('@custom-elements-manifest/analyzer').Plugin} An analyzer plugin.
 */
export function staticProperties() {
    return {
        name: 'DNA-STATIC-PROPERTIES',
        analyzePhase({ ts, node, moduleDoc }) {
            if (!ts.isClassDeclaration(node)) {
                return;
            }

            if (!node.members || !node.name) {
                return;
            }

            const hasDefaultModifier = hasKeyword(node, ts.SyntaxKind.DefaultKeyword);
            const className = hasDefaultModifier ? 'default' : node.name.getText();
            const currClass = getClassDeclaration(moduleDoc, className);
            if (!currClass) {
                return;
            }

            node.members.forEach((member) => {
                if (!member.name ||
                    !hasKeyword(member, ts.SyntaxKind.StaticKeyword) ||
                    (!ts.isPropertyDeclaration(member) && !ts.isGetAccessor(member)) ||
                    member.name.getText() !== 'properties') {
                    return;
                }

                const properties = getPropertiesObject(ts, member)?.properties;
                if (!properties) {
                    return;
                }

                properties.forEach((property) => {
                    if (!ts.isPropertyAssignment(property) || !property.name) {
                        return;
                    }

                    const initializer = property.initializer;
                    if (!initializer || !ts.isObjectLiteralExpression(initializer)) {
                        return;
                    }

                    /**
                     * @type {import('custom-elements-manifest/schema').ClassField}
                     */
                    const classMember = {
                        kind: 'field',
                        name: property.name.getText(),
                        privacy: 'public',
                    };

                    if (hasAttribute(ts, initializer)) {
                        const attribute = createAttributeFromField(classMember, getAttributeName(ts, initializer) || property.name.getText());
                        currClass.attributes = [...(currClass.attributes || []), attribute];
                    }

                    const existingField = currClass.members?.find((field) => field.name === classMember.name);
                    if (!existingField) {
                        currClass.members = [...(currClass.members || []), classMember];
                    } else {
                        currClass.members = currClass.members?.map((field) => (field.name === classMember.name ? ({ ...field, ...classMember }) : field)) ?? [];
                    }
                });
            });
        },
    };
}
