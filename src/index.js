"use strict";
exports.__esModule = true;
var rendering_1 = require("./rendering");
var workLoop_1 = require("./workLoop");
var jsx_1 = require("./jsx");
var Operations;
(function (Operations) {
    Operations["UPDATE"] = "UPDATE";
    Operations["DELETE"] = "DELETE";
    Operations["CREATE"] = "CREATE";
})(Operations = exports.Operations || (exports.Operations = {}));
exports.render = rendering_1.render;
exports.createLocalState = workLoop_1.createLocalState;
exports.createElement = jsx_1.createElement;
var SimpleSpa = {
    render: exports.render,
    createLocalState: exports.createLocalState,
    createElement: exports.createElement
};
module.exports = SimpleSpa;
