const METHOD_DENY_LIST = [
    'initialize',
    'forceUpdate',
    'stateChangedCallback',
    'propertyChangedCallback',
    'render',
];

/**
 * A plugin that filters out private and protected class methods.
 * @returns {import('@custom-elements-manifest/analyzer').Plugin} An analyzer plugin.
 */
export function methodDenyList() {
    return {
        name: 'DNA-METHOD-DENYLIST',
        moduleLinkPhase({ moduleDoc }) {
            if (!moduleDoc.declarations) {
                return;
            }

            const classes = /** @type {import('custom-elements-manifest/schema').ClassDeclaration[]} */ (moduleDoc.declarations.filter((declaration) => declaration.kind === 'class'));
            classes.forEach((klass) => {
                if (!klass?.members) {
                    return;
                }
                klass.members = klass.members
                    .filter((member) => !METHOD_DENY_LIST.includes(member.name))
                    .filter((member) => member.privacy !== 'private' && member.privacy !== 'protected');
            });
        },
    };
}
