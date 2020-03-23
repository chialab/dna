import { mix as _mix } from '@chialab/proteins';
import { warnCode } from './deprecations';

export function mix(SuperClass: Function) {
    warnCode('MIX_HELPER');
    return _mix(SuperClass);
}
