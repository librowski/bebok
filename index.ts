import {render as _render} from "./src/rendering";
import {createLocalState as _createLocalState} from "./src/workLoop";
import {createElement as _createElement} from "./src/jsx";

declare global {
    namespace JSX {
        export type VNode = {
            value: keyof HTMLElementTagNameMap | RenderFunction | string;
            props: {
                children: JSX.VNode[];
                [key: string]: any;
            };
        }

        type IntrinsicElements = { [elemName: string]: any }
    }
}

export type RenderFunction = (props: any) => JSX.VNode[] | JSX.VNode;

export type PropChecker = (key: string) => boolean;

export type PropsComparingFunction<T> = (prev: object, next: object) => T;

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

export const render = _render;
export const createLocalState = _createLocalState;
export const createElement = _createElement;

const SimpleSpa = {
    render,
    createLocalState,
    createElement
};

module.exports = SimpleSpa;
