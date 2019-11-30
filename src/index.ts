import {render as _render} from "./rendering";
import {createLocalState as _createLocalState} from "./workLoop";
import {createElement as _createElement} from "./jsx";

export const render = _render;
export const createLocalState = _createLocalState;
export const createElement = _createElement;

const SimpleSpa = {
    render,
    createLocalState,
    createElement
};

export default SimpleSpa;
