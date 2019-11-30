"use strict";
exports.__esModule = true;
var rendering_1 = require("./src/rendering");
var workLoop_1 = require("./src/workLoop");
var jsx_1 = require("./src/jsx");
exports.render = rendering_1.render;
exports.createLocalState = workLoop_1.createLocalState;
exports.createElement = jsx_1.createElement;
var SimpleSpa = {
    render: exports.render,
    createLocalState: exports.createLocalState,
    createElement: exports.createElement
};
module.exports = SimpleSpa;
