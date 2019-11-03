export const bebokJSX =
    (
        type: JSX.Element['type'],
        attributes: JSX.Element['attributes'],
        ...args: any
    ): JSX.Element => ({
        type,
        attributes,
        children: [...args] || null,
    });
