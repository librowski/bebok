"use strict";
exports.__esModule = true;
var index_1 = require("../index");
var rendering_1 = require("./rendering");
var _ = require("lodash/fp");
exports.workingState = {
    nextUnit: null,
    temporaryTree: null,
    currentTree: null,
    deprecatedUnits: [],
    mutatorIdx: 0,
    temporaryFunctionUnit: null
};
var createUpdateUnit = function (oldUnit, parent, vNode) { return ({
    value: oldUnit.value,
    props: vNode.props,
    dom: oldUnit.dom,
    parent: parent,
    old: oldUnit,
    operation: index_1.Operations.UPDATE
}); };
var createCreateUnit = function (parent, vNode) { return ({
    value: vNode.value,
    props: vNode.props,
    dom: null,
    parent: parent,
    old: null,
    operation: index_1.Operations.CREATE
}); };
var markAsDeprecated = function (unit) {
    unit.operation = index_1.Operations.DELETE;
    exports.workingState.deprecatedUnits.push(unit);
};
var reconcileChildren = function (unit, children) {
    var _a, _b;
    var oldUnit = (_b = (_a = unit) === null || _a === void 0 ? void 0 : _a.old) === null || _b === void 0 ? void 0 : _b.child;
    var prevSibling = null;
    var labelDeprecatedUnits = function (oldUnit) {
        if (oldUnit) {
            markAsDeprecated(oldUnit);
            labelDeprecatedUnits(oldUnit.sibling);
        }
    };
    children.forEach(function (child, idx) {
        var _a;
        var newUnit = null;
        var haveSameType = oldUnit && ((_a = child) === null || _a === void 0 ? void 0 : _a.value) === oldUnit.value;
        if (haveSameType) {
            newUnit = createUpdateUnit(oldUnit, unit, child);
        }
        if (child && !haveSameType) {
            newUnit = createCreateUnit(unit, child);
        }
        if (oldUnit && !haveSameType) {
            markAsDeprecated(oldUnit);
        }
        if (oldUnit) {
            oldUnit = oldUnit.sibling;
        }
        if (idx !== 0 && child) {
            prevSibling.sibling = newUnit;
        }
        else {
            unit.child = newUnit;
        }
        prevSibling = newUnit;
    });
    labelDeprecatedUnits(oldUnit);
};
var isFunctionComponent = function (unit) { return unit.value instanceof Function; };
var updateFunctionComponent = function (unit) {
    var _a;
    exports.workingState.temporaryFunctionUnit = unit;
    exports.workingState.mutatorIdx = 0;
    exports.workingState.temporaryFunctionUnit.mutators = [];
    var children = _.flatten((_a = [unit.value(unit.props)], (_a !== null && _a !== void 0 ? _a : [])));
    reconcileChildren(unit, children);
};
exports.createLocalState = function (initial) {
    var _a, _b, _c, _d, _e, _f, _g;
    var oldMutator = (_c = (_b = (_a = exports.workingState.temporaryFunctionUnit) === null || _a === void 0 ? void 0 : _a.old) === null || _b === void 0 ? void 0 : _b.mutators) === null || _c === void 0 ? void 0 : _c[exports.workingState.mutatorIdx];
    var mutator = {
        state: (_e = (_d = oldMutator) === null || _d === void 0 ? void 0 : _d.state, (_e !== null && _e !== void 0 ? _e : initial)),
        queue: []
    };
    var actions = (_g = (_f = oldMutator) === null || _f === void 0 ? void 0 : _f.queue, (_g !== null && _g !== void 0 ? _g : []));
    actions.forEach(function (action) {
        mutator.state = action(mutator.state);
    });
    var mutate = function (action) {
        mutator.queue.push(action);
        exports.workingState.temporaryTree = {
            value: 'ROOT',
            dom: exports.workingState.currentTree.dom,
            props: exports.workingState.currentTree.props,
            old: exports.workingState.currentTree
        };
        exports.workingState.nextUnit = exports.workingState.temporaryTree;
        exports.workingState.deprecatedUnits = [];
    };
    exports.workingState.temporaryFunctionUnit.mutators.push(mutator);
    exports.workingState.mutatorIdx++;
    return [mutator.state, mutate];
};
var updateDOMComponent = function (domUnit) {
    if (!domUnit.dom) {
        domUnit.dom = rendering_1.createDOM(domUnit);
    }
    reconcileChildren(domUnit, domUnit.props.children);
};
var getNext = function (unit) {
    if (unit.child) {
        return unit.child;
    }
    var nextUnit = unit;
    while (nextUnit) {
        if (nextUnit.sibling) {
            return nextUnit.sibling;
        }
        nextUnit = nextUnit.parent;
    }
};
var processUnit = function (currUnit) {
    if (isFunctionComponent(currUnit)) {
        updateFunctionComponent(currUnit);
    }
    else {
        updateDOMComponent(currUnit);
    }
    return getNext(currUnit);
};
var commitOperation = function (unit) {
    if (unit) {
        var parent_1 = unit.parent, child = unit.child, sibling = unit.sibling;
        var getParentDom_1 = function (unit) { var _a, _b; return _b = (_a = unit.parent) === null || _a === void 0 ? void 0 : _a.dom, (_b !== null && _b !== void 0 ? _b : getParentDom_1(unit.parent)); };
        var domParent = getParentDom_1(unit);
        switch (unit.operation) {
            case index_1.Operations.CREATE:
                if (unit.dom !== null) {
                    domParent.appendChild(unit.dom);
                }
                break;
            case index_1.Operations.DELETE:
                parent_1.dom.removeChild(unit.dom);
                break;
            case index_1.Operations.UPDATE:
                if (unit.dom !== null) {
                    rendering_1.updateDOM(unit.dom, unit.old.props, unit.props);
                }
                break;
        }
        commitOperation(child);
        commitOperation(sibling);
    }
};
var mountTree = function () {
    exports.workingState.deprecatedUnits.forEach(commitOperation);
    commitOperation(exports.workingState.temporaryTree.child);
    exports.workingState.currentTree = exports.workingState.temporaryTree;
    exports.workingState.temporaryTree = null;
};
var commitDelete = function (unit, domParent) {
    if (unit.dom) {
        domParent.removeChild(unit.dom);
    }
    else {
        commitDelete(unit.child, domParent);
    }
};
var workLoop = function (deadline) {
    var canWork = function () { return deadline.timeRemaining() >= 1 && exports.workingState.nextUnit; };
    while (canWork()) {
        exports.workingState.nextUnit = processUnit(exports.workingState.nextUnit);
    }
    var isReconcilingFinished = !exports.workingState.nextUnit && exports.workingState.temporaryTree;
    if (isReconcilingFinished) {
        mountTree();
    }
    requestIdleCallback(workLoop);
};
requestIdleCallback(workLoop);
exports["default"] = workLoop;
