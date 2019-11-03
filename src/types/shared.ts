export type RenderFunction = (props: any) => JSX.VNode[];

export type ComponentNode = {
    type: RenderFunction;
    attributes: object;
    children: JSX.VNode[] | string;
};

export type HTMLNode = {
    type: keyof HTMLElementTagNameMap;
    attributes: object;
    children: JSX.VNode[] | string;
}

export type TextNode = string;
