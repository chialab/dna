import { decorator, hasDecorator, isAlsoAttribute, createAttributeFromField, getAttributeName } from './utils.js';

export function propertyDecorator() {
    return {
        name: 'DNA-PROPERTY-DECORATOR',
        analyzePhase({ ts, node, moduleDoc }) {
            switch (node.kind) {
                case ts.SyntaxKind.ClassDeclaration: {
                    if (!node.members) {
                        return;
                    }
                    const hasDefaultModifier = node.modifiers?.some(mod => ts.SyntaxKind.DefaultKeyword === mod.kind) ?? false;
                    const className = hasDefaultModifier ? 'default' : node.name?.getText();
                    const currClass = moduleDoc.declarations?.find((declaration) => declaration.name === className);
                    if (!currClass) {
                        return;
                    }

                    node.members.forEach((member) => {
                        const memberName = member.name.getText();
                        if (!hasDecorator(ts, member, 'property')) {
                            if (currClass.properties) {
                                currClass.properties = currClass.properties.filter((attr) => attr.name !== memberName);
                            }
                            return;
                        }

                        const propertyDecorator = member.decorators.find(decorator('property'));
                        if (!propertyDecorator) {
                            return;
                        }

                        const propertyOptions = propertyDecorator.expression?.arguments?.find((arg) => ts.isObjectLiteralExpression(arg));
                        if (!propertyOptions) {
                            return;
                        }

                        if (isAlsoAttribute(ts, propertyOptions)) {
                            const field = currClass.members.find(classMember => classMember.name === memberName);
                            const attribute = createAttributeFromField(field, getAttributeName(ts, propertyOptions) || memberName);

                            const existingAttribute = currClass.attributes.find((attr) => attr.name === attribute.name);
                            if (!existingAttribute) {
                                currClass.attributes.push(attribute);
                            } else {
                                currClass.attributes = currClass.attributes.map((attr) => (attr.name === attribute.name ? ({ ...attr, ...attribute }) : attr));
                            }
                        }
                    });
                    break;
                }
            }
        },
    };
}
