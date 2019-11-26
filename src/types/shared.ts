export type RenderFunction = (props: any) => JSX.VNode[] | JSX.VNode;

export type ComponentNode = {
    value: RenderFunction;
    attributes: object;
    children: JSX.VNode[] | JSX.VNode | string;
}

export type HTMLNode = {
    value: keyof HTMLElementTagNameMap;
    attributes: object;
    children: JSX.VNode[] | JSX.VNode | string;
}

export type TextNode = string;

export type PropChecker = (key: string) => boolean;

export type PropsComparingFunction<T> = (prev: object, next: object) => T;
