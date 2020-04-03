/**
 * Conert React component properties to a set of attributes.
 * Removes children key from properties.
 * @param props The component properties.
 * @param keepReferences Removes objects and functions values if false.
 * @return A subset of simple properties to set as attribute.
 */
export function convertReactProps<T extends any>(props: T, keepReferences = true): Omit<T, 'children'> {
    return Object.keys(props)
        .reduce((newProps: any, propertyKey: string) => {
            if (propertyKey === 'children') {
                return newProps;
            }
            let value = props[propertyKey];
            let type = typeof value;
            if (!keepReferences && (type === 'function' || type === 'object')) {
                return newProps;
            }
            newProps[propertyKey] = value;
            return newProps;
        }, {});
}
