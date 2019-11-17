export const bebokJSX =
    (
        type: any,
        attributes: any,
        ...args: any
    ): JSX.VNode => ({
        value: type,
        attributes,
        children: [...args] || null,
    });
