import {RenderFunction} from "./shared";

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
