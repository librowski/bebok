"use strict";
exports.__esModule = true;
var _ = require("lodash/fp");
var workLoop_1 = require("./workLoop");
var createEl = function (_a) {
    var value = _a.value;
    return document.createElement(value);
};
var createTextNode = function (value) { return document.createTextNode(value); };
var isPropNewIn = function (prev, next) { return function (key) { return prev[key] !== next[key]; }; };
var isPropGoneIn = function (prev, next) { return function (key) { return !(key in next); }; };
var isEvent = function (key) { return key.startsWith('on'); };
var isProp = function (key) { return !isEvent(key) && key !== 'children'; };
var removeOldProps = function (prev, next) { return function (dom) { return _.flowRight(_.each(function (key) { return dom[key] = ''; }), _.filter(_.allPass([
    isPropGoneIn(prev, next),
    isProp
])), _.keys)(prev); }; };
var setNewProps = function (prev, next) { return function (dom) { return _.flowRight(_.each(function (key) { return dom[key] = next[key]; }), _.filter(_.allPass([
    isPropNewIn(prev, next),
    isProp
])), _.keys)(next); }; };
var getEventType = _.flowRight(_.toLower, _.join(''), _.drop(2));
var removeDeprecatedEvents = function (prev, next) { return function (dom) { return _.flowRight(_.forEach(function (name) { return dom.removeEventListener(getEventType(name), prev[name]); }), _.filter(_.allPass([
    _.anyPass([
        isPropGoneIn(prev, next),
        isPropNewIn(prev, next)
    ]),
    isEvent
])), _.keys)(prev); }; };
var setNewEvents = function (prev, next) { return function (dom) { return _.flowRight(_.forEach(function (name) {
    dom.addEventListener(getEventType(name), next[name]);
}), _.filter(_.allPass([
    isPropNewIn(prev, next),
    isEvent,
])), _.keys)(next); }; };
exports.updateDOM = function (dom, previousProps, nextProps) {
    removeOldProps(previousProps, nextProps)(dom);
    removeDeprecatedEvents(previousProps, nextProps)(dom);
    setNewProps(previousProps, nextProps)(dom);
    setNewEvents(previousProps, nextProps)(dom);
};
exports.createDOM = function (unit) {
    var dom = unit.value === 'TEXT_ELEMENT'
        ? createTextNode('')
        : createEl(unit);
    exports.updateDOM(dom, {}, unit.props);
    return dom;
};
exports.render = function (container, el) {
    workLoop_1.workingState.temporaryTree = {
        value: 'ROOT',
        dom: container,
        props: {
            children: [el]
        },
        old: workLoop_1.workingState.currentTree
    };
    workLoop_1.workingState.deprecatedUnits = [];
    workLoop_1.workingState.nextUnit = workLoop_1.workingState.temporaryTree;
};
