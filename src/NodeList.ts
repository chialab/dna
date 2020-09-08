export type IterableNodeList = Node[] & {
    item(index: number): Node | null;
};

/**
 * Clone an array like instance.
 * @param arr The array to convert.
 * @return A shallow clone of the array.
 */
export const cloneChildNodes = (arr: NodeList|IterableNodeList) => {
    let result = [] as unknown as IterableNodeList;
    result.item = (index) => result[index];
    for (let i = arr.length; i--; result.unshift(arr.item(i) as Node));
    return result;
};
