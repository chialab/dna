// @ts-check

import { getDecorator, resolveModuleOrPackageSpecifier, getDecoratorArguments } from './utils.js';

/**
 * A plugin that detects `customElement` decorator usage.
 * @returns {import('@custom-elements-manifest/analyzer').Plugin} An analyzer plugin.
 */
export function customElementDecorator() {
    return {
        name: 'DNA-CUSTOM-ELEMENT-DECORATOR',
        analyzePhase({ ts, node, moduleDoc, context }) {
            if (!ts.isClassDeclaration(node)) {
                return;
            }
            if (!node.name) {
                return;
            }

            const customElementDecorator = getDecorator(ts, node, 'customElement');
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
}
