import {ComponentNode, HTMLNode, RenderFunction, TextNode} from "./shared";

declare global {
    namespace JSX {
        export type VNode = HTMLNode | ComponentNode | TextNode;

        type IntrinsicElements = { [elemName: string]: any }
    }
}
