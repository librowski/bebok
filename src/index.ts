import {render as _render} from "./rendering";
import {useState as _useState} from "./workLoop";
import {createElement as _createElement} from "./jsx";

export const render = _render;
export const useState = _useState;
export const createElement = _createElement;

const Bebok = {
    render,
    useState,
    createElement
};

export default Bebok;
