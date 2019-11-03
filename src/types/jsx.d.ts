import {RenderFunction} from "./shared";

declare global {
    namespace JSX {
        export type Element = {
            type: keyof HTMLElementTagNameMap | RenderFunction;
            attributes: any;
            children: Element[];
        }
        type IntrinsicElements = { div: any }
    }
}
