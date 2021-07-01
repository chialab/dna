import { getDecorator, isAlsoAttribute, createAttributeFromField, getAttributeName, hasKeyword } from './utils.js';

export function propertyDecorator() {
    return {
        name: 'DNA-PROPERTY-DECORATOR',
        analyzePhase({ ts, node, moduleDoc }) {
            switch (node.kind) {
                case ts.SyntaxKind.ClassDeclaration: {
                    if (!node.members) {
                        return;
                    }

                    const hasDefaultModifier = hasKeyword(node, ts.SyntaxKind.DefaultKeyword);
                    const className = hasDefaultModifier ? 'default' : node.name?.getText();
                    const currClass = moduleDoc.declarations?.find((declaration) => declaration.name === className);
                    if (!currClass) {
                        return;
                    }

                    node.members.forEach((member) => {
                        if (!member.name) {
                            return;
                        }

                        const memberName = member.name.getText();
                        const accessorMembers = member.parent.members.filter((m) => m.name && m.name.getText() === memberName);
                        const propertyDecorator = accessorMembers.map((m) => getDecorator(m, 'property')).filter(Boolean)[0];
                        if (!propertyDecorator) {
                            if (currClass.members) {
                                currClass.members = currClass.members.filter((attr) => attr.name !== memberName);
                            }
                            return;
                        }

                        const propertyOptions = propertyDecorator.expression?.arguments?.find((arg) => ts.isObjectLiteralExpression(arg));
                        if (!propertyOptions || !isAlsoAttribute(ts, propertyOptions)) {
                            return;
                        }

                        const field = currClass.members.find((classMember) => classMember.name === memberName);
                        const attribute = createAttributeFromField(field, getAttributeName(ts, propertyOptions) || memberName);
                        const existingAttribute = currClass.attributes?.find((attr) => attr.name === attribute.name);
                        if (!existingAttribute) {
                            currClass.attributes = [...(currClass.attributes || []), attribute];
                        } else {
                            currClass.attributes = currClass.attributes.map((attr) => (attr.name === attribute.name ? ({ ...attr, ...attribute }) : attr));
                        }
                    });
                    break;
                }
            }
        },
    };
}
