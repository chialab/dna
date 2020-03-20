import { mix as _mix } from '@chialab/proteins';

export function mix(SuperClass: Function) {
    /* eslint-disable-next-line */
    console.warn('mix helper has been deprecated in DNA 3.0');
    return _mix(SuperClass);
}
