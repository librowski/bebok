import * as _ from 'lodash/fp';
import { ComponentNode, HTMLNode, TextNode } from "./types/shared";

const isTextNode = (node: JSX.VNode): node is TextNode =>
    typeof node === 'string';

const isComponentNode = (node: JSX.VNode): node is ComponentNode =>
    !isTextNode(node) && node?.value instanceof Function;

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
    const createElement = (value: string) => document.createElement(value);
    const addToContainer = _.curry(render)(container);

    if (isTextNode(node)) {
        container.append(document.createTextNode(node));
    } else if (isHTMLNode(node)) {
        const { attributes, children, value } = node;

        const element = _.flowRight(
            addAttributes(attributes),
            createElement,
        )(value);

        const addToElement = _.curry(render)(element);

        _.flatten([children ?? []])
            .forEach(
                addToElement
            );

        container.append(element);
    } else {
        [...node.value(node.attributes)]
            .forEach(
                addToContainer
            );
    }
};
