import * as _ from 'lodash/fp';

const createTextElement = (text: string): JSX.VNode => ({
    value: 'TEXT_ELEMENT',
    props: {
        nodeValue: text,
        children: []
    },
});

const mapChildren = _.map(child => typeof child === 'object' ? child as JSX.VNode : createTextElement(child as string));

export const createElement =
    (
        value: any,
        props: any,
        ...children: any
    ): JSX.VNode => ({
        value,
        props: {
            ...props,
            children: _.flowRight(
                mapChildren,
                _.flatten,
            )(children),
        },
    });
