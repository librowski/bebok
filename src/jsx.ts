export const bebokJSX =
    (
        type: any,
        attributes: any,
        ...args: any
    ): JSX.VNode => ({
        type,
        attributes,
        children: [...args] || null,
    });
