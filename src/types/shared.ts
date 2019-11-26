export type RenderFunction = (props: any) => JSX.VNode[] | JSX.VNode;

export type PropChecker = (key: string) => boolean;

export type PropsComparingFunction<T> = (prev: object, next: object) => T;
