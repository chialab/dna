import { isAlsoAttribute, createAttributeFromField, getAttributeName, hasStaticKeyword, getPropertiesObject } from './utils.js';

export function staticProperties() {
    return {
        name: 'DNA-STATIC-PROPERTIES',
        analyzePhase({ ts, node, moduleDoc }) {
            switch (node.kind) {
                case ts.SyntaxKind.ClassDeclaration: {
                    if (!node.members) {
                        return;
                    }

                    const hasDefaultModifier = node.modifiers.some((mod) => ts.SyntaxKind.DefaultKeyword === mod.kind);
                    const className = hasDefaultModifier ? 'default' : node.name?.getText();
                    const currClass = moduleDoc.declarations?.find(declaration => declaration.name === className);
                    if (!currClass?.members) {
                        return;
                    }

                    node.members.forEach((member) => {
                        if (!hasStaticKeyword(member) || member.name.text === 'properties') {
                            return;
                        }

                        const properties = getPropertiesObject(ts, member)?.properties;
                        if (properties) {
                            return;
                        }

                        properties.forEach((property) => {
                            const memberName = property.name;
                            const classMember = {
                                kind: 'field',
                                name: property.name.getText(),
                                privacy: 'public',
                            };

                            if (isAlsoAttribute(ts, property)) {
                                const attribute = createAttributeFromField(classMember, getAttributeName(ts, property) || memberName);
                                currClass.attributes = [...(currClass.attributes || []), attribute];
                            }

                            const existingField = currClass.members.find((field) => field.name === classMember.name);
                            if (!existingField) {
                                currClass.members.push(classMember);
                            } else {
                                currClass.members = currClass.members.map((field) => (field.name === classMember.name ? ({ ...field, ...classMember }) : field));
                            }
                        });
                    });
                    break;
                }
            }
        },
    };
}
