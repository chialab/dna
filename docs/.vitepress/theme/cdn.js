const VUE_VERSION = '3.5.42';
const SANDPACK_VUE3_VERSION = '3.1.12';
const SANDPACK_THEMES_VERSION = '2.0.21';

export const VUE_CDN_URL = `https://esm.sh/vue@${VUE_VERSION}`;

// `external=vue` keeps the bare `vue` import unresolved so that the browser's
// import map can point it at the very same module instance as `VUE_CDN_URL`,
// avoiding a duplicate Vue runtime (and the resulting vnode mismatches).
export const SANDPACK_VUE3_CDN_URL = `https://esm.sh/sandpack-vue3@${SANDPACK_VUE3_VERSION}?external=vue`;

export const SANDPACK_THEMES_CDN_URL = `https://esm.sh/@codesandbox/sandpack-themes@${SANDPACK_THEMES_VERSION}`;
