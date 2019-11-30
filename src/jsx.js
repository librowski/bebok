"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var _ = require("lodash/fp");
var createTextElement = function (text) { return ({
    value: 'TEXT_ELEMENT',
    props: {
        nodeValue: text,
        children: []
    }
}); };
var mapChildren = _.map(function (child) { return typeof child === 'object' ? child : createTextElement(child); });
exports.createElement = function (value, props) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    return ({
        value: value,
        props: __assign({}, props, { children: _.flowRight(mapChildren, _.flatten)(children) })
    });
};
