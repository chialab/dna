import { getDecorator, resolveModuleOrPackageSpecifier } from './utils.js';

export function customElementDecorator() {
    return {
        name: 'DNA-CUSTOM-ELEMENT-DECORATOR',
        analyzePhase({ ts, node, moduleDoc, context }) {
            const customElementDecorator = getDecorator(node, 'customElement');
            if (!customElementDecorator) {
                return;
            }

            const className = node.name.text;
            const argument = customElementDecorator.expression?.arguments[0];
            if (argument?.kind !== ts.SyntaxKind.StringLiteral) {
                return;
            }
            const tagName = argument.text;

            const definitionDoc = {
                kind: 'custom-element-definition',
                name: tagName,
                declaration: {
                    name: className,
                    ...resolveModuleOrPackageSpecifier(moduleDoc, context, className),
                },
            };

            moduleDoc.exports = [...(moduleDoc.exports || []), definitionDoc];
        },
    };
}
