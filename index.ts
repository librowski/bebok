import {render as _render} from "./src/rendering";
import {createLocalState as _createLocalState} from "./src/workLoop";
import {createElement as _createElement} from "./src/jsx";

export const render = _render;
export const createLocalState = _createLocalState;
export const createElement = _createElement;

const SimpleSpa = {
    render,
    createLocalState,
    createElement
};

module.exports = SimpleSpa;
