import { hasAttribute, getDecorator, getClassDeclaration, getAttributeName, createAttributeFromField, getDecoratorArguments, hasKeyword } from './utils.js';

/**
 * A plugin that that detects `property` decorator usage.
 * @returns {import('@custom-elements-manifest/analyzer').Plugin} An analyzer plugin.
 */
export function propertyDecorator() {
    return {
        name: 'DNA-PROPERTY-DECORATOR',
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
                    hasKeyword(member, ts.SyntaxKind.StaticKeyword) ||
                    (!ts.isPropertyDeclaration(member) && !ts.isGetAccessor(member))) {
                    return;
                }

                const parent = /** @type {import('@custom-elements-manifest/analyzer/node_modules/typescript').ClassDeclaration} */ (/** @type {unknown} */ (member.parent));
                const memberName = member.name.getText();
                const accessorMembers = parent.members?.filter((m) => m.name && m.name.getText() === memberName) ?? [];
                const propertyDecorator = accessorMembers.map((m) => getDecorator(ts, m, 'property')).filter(Boolean)[0];
                if (!propertyDecorator) {
                    if (currClass.members) {
                        const index = currClass.members.findIndex((attr) => attr.name === memberName);
                        currClass.members.splice(index, 1);
                    }
                    return;
                }

                const propertyDecoratorArguments = getDecoratorArguments(propertyDecorator);
                const propertyOptions = propertyDecoratorArguments.find((arg) => ts.isObjectLiteralExpression(arg));
                if (!propertyOptions || !ts.isObjectLiteralExpression(propertyOptions) || !hasAttribute(ts, propertyOptions)) {
                    return;
                }

                const field = currClass.members?.find((classMember) => classMember.name === memberName);
                if (!field || field.kind !== 'field') {
                    return;
                }

                const attribute = createAttributeFromField(field, getAttributeName(ts, propertyOptions) || memberName);
                const existingAttribute = currClass.attributes?.find((attr) => attr.name === attribute.name);
                if (!existingAttribute) {
                    currClass.attributes = [...(currClass.attributes || []), attribute];
                } else {
                    currClass.attributes = currClass.attributes?.map((attr) => (attr.name === attribute.name ? ({ ...attr, ...attribute }) : attr));
                }
            });
        },
    };
}
