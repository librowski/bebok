import * as _ from 'lodash/fp';
import { ComponentNode, HTMLNode, TextNode } from "./types/shared";

const isTextNode = (node: JSX.VNode): node is TextNode =>
    typeof node === 'string';

const isComponentNode = (node: JSX.VNode): node is ComponentNode =>
    !isTextNode(node) && node.type instanceof Function;

const isHTMLNode = (node: JSX.VNode): node is HTMLNode =>
    _.overEvery([
        _.negate(
            isTextNode
        ),
        _.negate(
            isComponentNode
        )
    ])(node);

const addAttributes = (attributes: object) => (element: Element) => {
    for (const [key, value] of Object.entries({ ...attributes } as object)) {
        element.setAttribute(key, value);
    }

    return element;
};

export const render = (container: Element, node: JSX.VNode) => {
    if (isTextNode(node)) {
        container.append(document.createTextNode(node));
    } else if (isHTMLNode(node)) {
        const { attributes, children, type } = node;

        const element = _.flowRight(
            addAttributes(attributes),
            type => document.createElement(type),
        )(type);

        [].concat(children)
            .forEach(child =>
                render(element, child)
            );

        container.append(element);
    } else {
        // TODO: COMPONENTS
    }
};
