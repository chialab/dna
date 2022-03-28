import { getDecorator, resolveModuleOrPackageSpecifier, getDecoratorArguments } from './utils.js';

export function customElementDecorator() {
    /**
     * @type {import('@custom-elements-manifest/analyzer').Plugin}
     */
    const plugin = {
        name: 'DNA-CUSTOM-ELEMENT-DECORATOR',
        analyzePhase({ ts, node, moduleDoc, context }) {
            if (!ts.isClassDeclaration(node)) {
                return;
            }
            if (!node.name) {
                return;
            }

            const customElementDecorator = getDecorator(node, 'customElement');
            if (!customElementDecorator) {
                return;
            }

            const argument = getDecoratorArguments(customElementDecorator)[0];
            if (!ts.isStringLiteral(argument)) {
                return;
            }

            moduleDoc.exports = [...(moduleDoc.exports || []), {
                kind: 'custom-element-definition',
                name: argument.text,
                declaration: {
                    name: node.name.getText(),
                    ...resolveModuleOrPackageSpecifier(moduleDoc, context, node.getText()),
                },
            }];
        },
    };

    return plugin;
}
