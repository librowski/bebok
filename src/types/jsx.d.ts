import {RenderFunction} from "./shared";

declare global {
    namespace JSX {
        export type VNode = {
            value: keyof HTMLElementTagNameMap | RenderFunction | string;
            props: object;
            children: JSX.VNode[];
        }

        type IntrinsicElements = { [elemName: string]: any }
    }
}
