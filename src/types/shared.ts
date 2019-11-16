export type ComponentNode = (props: any) => JSX.VNode[] | JSX.VNode;

export type HTMLNode = {
    type: keyof HTMLElementTagNameMap;
    attributes: object;
    children: JSX.VNode[] | string;
}

export type TextNode = string;
