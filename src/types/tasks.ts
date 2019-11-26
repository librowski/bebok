import {RenderFunction} from "./shared";

export enum Operations {
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    CREATE = 'CREATE',
}

type DOMValue = keyof HTMLElementTagNameMap | string;

export type Unit<T = DOMValue | RenderFunction> = {
    value: T;
    props: any;
    dom: Node;
    children?: JSX.VNode[];
    parent?: Unit;
    sibling?: Unit;
    child?: Unit;
    old?: Unit;
    operation?: Operations;
};

export type FunctionUnit = Unit<RenderFunction>;
export type DOMUnit = Unit<DOMValue>;

export type WorkingState = {
    nextUnit?: Unit;
    temporaryTree?: Unit;
    currentTree?: Unit;
    deprecatedUnits: Unit[];
}
