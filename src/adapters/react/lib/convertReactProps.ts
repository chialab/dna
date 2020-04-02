/**
 * Conert React component properties to a set of attributes.
 * Removes the children key and objects and functions values.
 * @param props The component properties.
 * @return A subset of simple properties to set as attribute.
 */
export function convertReactProps<T extends any>(props: T): Omit<T, 'children'> {
    return Object.keys(props)
        .reduce((newProps: any, propertyKey: string) => {
            if (propertyKey === 'children') {
                return newProps;
            }
            let value = props[propertyKey];
            let type = typeof value;
            if (type === 'function' || type === 'object') {
                return newProps;
            }
            newProps[propertyKey] = value;
            return newProps;
        }, {});
}
