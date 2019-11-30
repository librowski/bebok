import {RenderFunction} from "./shared";

export enum Operations {
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    CREATE = 'CREATE',
}

type DOMValue = keyof HTMLElementTagNameMap | string;

export type StateMutator<T = any> = {
    state: T;
    queue: ((prev: T) => T)[];
}

export type Unit<T = DOMValue | RenderFunction> = {
    value: T;
    props: {
        children: JSX.VNode[];
        [key: string]: any;
    };
    dom: Node;
    parent?: Unit;
    sibling?: Unit;
    child?: Unit;
    old?: Unit<T>;
    operation?: Operations;
    mutators?: T extends RenderFunction ? StateMutator[] : never;
};

export type FunctionUnit = Unit<RenderFunction>;
export type DOMUnit = Unit<DOMValue>;

export type WorkingState = {
    nextUnit?: Unit;
    temporaryTree?: Unit;
    currentTree?: Unit;
    deprecatedUnits: Unit[];
    temporaryFunctionUnit?: FunctionUnit;
    mutatorIdx: number;
}