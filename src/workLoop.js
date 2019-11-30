"use strict";
exports.__esModule = true;
var units_1 = require("./types/units");
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
    operation: units_1.Operations.UPDATE
}); };
var createCreateUnit = function (parent, vNode) { return ({
    value: vNode.value,
    props: vNode.props,
    dom: null,
    parent: parent,
    old: null,
    operation: units_1.Operations.CREATE
}); };
var markAsDeprecated = function (unit) {
    unit.operation = units_1.Operations.DELETE;
    exports.workingState.deprecatedUnits.push(unit);
};
var reconcileChildren = function (unit, children) {
    var oldUnit = unit ? .old ? .child :  : ;
    var prevSibling = null;
    var labelDeprecatedUnits = function (oldUnit) {
        if (oldUnit) {
            markAsDeprecated(oldUnit);
            labelDeprecatedUnits(oldUnit.sibling);
        }
    };
    children.forEach(function (child, idx) {
        var newUnit = null;
        var haveSameType = oldUnit && child ? .value === oldUnit.value : ;
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
    exports.workingState.temporaryFunctionUnit = unit;
    exports.workingState.mutatorIdx = 0;
    exports.workingState.temporaryFunctionUnit.mutators = [];
    var children = _.flatten([unit.value(unit.props)] ?  ? [] :  : );
    reconcileChildren(unit, children);
};
exports.createLocalState = function (initial) {
    var oldMutator = exports.workingState.temporaryFunctionUnit
        ? .old
            ? .mutators ? .[exports.workingState.mutatorIdx] :  :  : ;
    var mutator = {
        state: oldMutator ? .state ?  ? initial :  :  : ,
        queue: []
    };
    var actions = oldMutator ? .queue ?  ? [] :  :  : ;
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
        var getParentDom_1 = function (unit) { return unit.parent ? .dom ?  ? getParentDom_1(unit.parent) :  :  : ; };
        var domParent = getParentDom_1(unit);
        switch (unit.operation) {
            case units_1.Operations.CREATE:
                if (unit.dom !== null) {
                    domParent.appendChild(unit.dom);
                }
                break;
            case units_1.Operations.DELETE:
                parent_1.dom.removeChild(unit.dom);
                break;
            case units_1.Operations.UPDATE:
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
