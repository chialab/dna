const METHOD_DENY_LIST = [
    'initialize',
    'forceUpdate',
    'stateChangedCallback',
    'propertyChangedCallback',
    'render',
];

export function methodDenyList() {
    return {
        name: 'DNA-METHOD-DENYLIST',
        moduleLinkPhase({ moduleDoc }) {
            const classes = moduleDoc?.declarations?.filter((declaration) => declaration.kind === 'class');
            classes?.forEach((klass) => {
                if (!klass?.members) {
                    return;
                }
                klass.members = klass?.members?.filter((member) => !METHOD_DENY_LIST.includes(member.name));
            });
        },
    };
}
