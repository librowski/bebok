import * as _ from 'lodash/fp';
import {PropChecker, PropsComparingFunction} from "./types/shared";
import {DOMUnit} from "./types/tasks";
import {workingState} from "./workLoop";

const createEl = ({ value }: DOMUnit) => document.createElement(value);
const createTextNode = (value: string) => document.createTextNode(value);

const isPropNewIn: PropsComparingFunction<PropChecker> = (prev, next) => (key: keyof object) => prev[key] !== next[key];
const isPropGoneIn: PropsComparingFunction<PropChecker> = (prev, next) => key => !(key in next);
const isEvent: PropChecker = key => key.startsWith('on');
const isProp: PropChecker = key => !isEvent(key) && key !== 'children';

const removeOldProps: PropsComparingFunction<(dom: Node) => void> = (prev, next) => (dom: any) => _.flowRight(
    _.each((key: keyof object) => dom[key] = ''),
    _.filter(
        _.allPass([
            isPropGoneIn(prev, next),
            isProp
        ])),
    _.keys,
)(prev);

const setNewProps: PropsComparingFunction<(dom: Node) => void> = (prev, next) => (dom: any) => _.flowRight(
    _.each((key: keyof object) => dom[key] = next[key]),
    _.filter(
        _.allPass([
            isPropNewIn(prev, next),
            isProp
        ])),
    _.keys,
)(next);

const getEventType = _.flowRight(
    _.toLower,
    _.join(''),
    _.drop(2),
);

const removeDeprecatedEvents: PropsComparingFunction<(dom: Node) => void> = (prev, next) => (dom: any) => _.flowRight(
    _.forEach((name: keyof object) => dom.removeEventListener(getEventType(name), prev[name])),
    _.filter(
        _.allPass([
            _.anyPass([
                isPropGoneIn(prev, next),
                isPropNewIn(prev, next)
            ]),
            isEvent
        ])),
    _.keys,
)(prev);

const setNewEvents: PropsComparingFunction<(dom: Node) => void> = (prev, next) => (dom: any) => _.flowRight(
    _.forEach((name: keyof object) => {
        dom.addEventListener(getEventType(name), next[name]);
    }),
    _.filter(
        _.allPass([
            isPropNewIn(prev, next),
            isEvent,
        ]),
    ),
    _.keys,
)(next);

export const updateDOM = (dom: Node, previousProps: object, nextProps: object) => {
    removeOldProps(previousProps, nextProps)(dom);
    removeDeprecatedEvents(previousProps, nextProps)(dom);
    setNewProps(previousProps, nextProps)(dom);
    setNewEvents(previousProps, nextProps)(dom);
};

export const createDOM = (unit: DOMUnit): Node => {
    const dom = unit.value === 'TEXT_ELEMENT'
        ? createTextNode('')
        : createEl(unit);

    updateDOM(dom, {}, unit.props);

    return dom;
};

export const render = (container: Node, el: any) => {
    workingState.temporaryTree = {
        value: 'ROOT',
        dom: container,
        props: {
            children: [el]
        },
        old: workingState.currentTree,
    };

    workingState.deprecatedUnits = [];
    workingState.nextUnit = workingState.temporaryTree;
};
