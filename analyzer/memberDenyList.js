const MEMBER_DENY_LIST = ['properties', 'listeners'];

export function memberDenyList() {
    return {
        name: 'DNA-MEMBER-DENYLIST',
        moduleLinkPhase({ moduleDoc }) {
            const classes = moduleDoc?.declarations?.filter((declaration) => declaration.kind === 'class');
            if (!classes) {
                return;
            }

            classes.forEach((klass) => {
                if (!klass?.members) {
                    return;
                }
                klass.members = klass.members.filter((member) => !MEMBER_DENY_LIST.includes(member.name));
            });
        },
    };
}
