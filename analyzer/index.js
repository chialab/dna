import { customElementDecorator } from './customElementDecorator.js';
import { methodDenyList } from './methodDenyList.js';
import { memberDenyList } from './memberDenyList.js';
import { propertyDecorator } from './propertyDecorator.js';
import { staticProperties } from './staticProperties.js';

export default () => [
    customElementDecorator(),
    methodDenyList(),
    memberDenyList(),
    propertyDecorator(),
    staticProperties(),
];
