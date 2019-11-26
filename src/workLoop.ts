import {
    DOMUnit,
    FunctionUnit,
    Operations,
    Unit,
    WorkingState
} from "./types/tasks";
import {createDOM, updateDOM} from "./rendering";
import * as _ from 'lodash/fp';
import {RenderFunction} from "./types/shared";

export const workingState: WorkingState = {
    nextUnit: null,
    temporaryTree: null,
    currentTree: null,
    deprecatedUnits: [],
};

const reconcileChildren = (unit: Unit, children: JSX.VNode[]) => {
    let index = 0;
    let oldUnit = unit.old && unit.old.child;
    let prevSibling: Unit = null;

    while (index < children.length || oldUnit !== null) {
        const child = children[index];
        let newUnit: Unit = null;

        const haveSameType = oldUnit && child && child.value === oldUnit.value;

        if (haveSameType) {
            newUnit = {
                value: oldUnit.value,
                props: child.props,
                children: child.children,
                dom: oldUnit.dom,
                parent: unit,
                old: oldUnit,
                operation: Operations.UPDATE,
            }
        }
        if (child && !haveSameType) {
            newUnit = {
                value: child.value,
                props: child.props,
                children: child.children,
                dom: null,
                parent: unit,
                old: null,
                operation: Operations.CREATE,
            }
        }
        if (oldUnit && !haveSameType) {
            oldUnit.operation = Operations.DELETE;
            workingState.deprecatedUnits.push(oldUnit);
        }

        if (oldUnit) {
            oldUnit = oldUnit.sibling;
        }

        if (index !== 0) {
            prevSibling.sibling = newUnit;
        } else {
            unit.child = newUnit;
        }
        prevSibling = newUnit;
        index ++;
    }
};

const isFunctionComponent = (unit: Unit): unit is Unit<RenderFunction> => unit.value instanceof Function;

const updateFunctionComponent = (unit: FunctionUnit) => {
    const children = _.flatten([unit.value(unit.props)] ?? []);
    reconcileChildren(unit, children);
};

const updateDOMComponent = (domUnit: DOMUnit) => {
    if (!domUnit.dom) {
        domUnit.dom = createDOM(domUnit);
    }
    reconcileChildren(domUnit, domUnit.children);
};

const getNext = (unit: Unit): Unit => {
    if (unit.child) {
        return unit.child;
    }
    let nextUnit = unit;
    while (nextUnit) {
        if (nextUnit.sibling) {
            return nextUnit.sibling;
        }
        nextUnit = nextUnit.parent;
    }
};

const processUnit = (currUnit: Unit): Unit => {
    if (isFunctionComponent(currUnit)) {
        updateFunctionComponent(currUnit);
    } else {
        updateDOMComponent(currUnit as DOMUnit);
    }

    return getNext(currUnit);
};

const commitOperation = (unit: Unit) => {
    if (unit) {
        const { parent, child, sibling } = unit;
        let domParentUnit = unit.parent;
        while (!domParentUnit.dom) {
            domParentUnit = domParentUnit.parent;
        }
        const domParent = domParentUnit.dom;

        switch (unit.operation) {
            case Operations.CREATE:
                if (unit.dom !== null) {
                    domParent.appendChild(unit.dom);
                }
                break;
            case Operations.DELETE:
                parent.dom.removeChild(unit.dom);
                break;
            case Operations.UPDATE:
                if (unit.dom !== null) {
                    updateDOM(unit.dom, unit.old.props, unit.props);
                }
                break;
        }

        commitOperation(child);
        commitOperation(sibling);
    }
};

const mountTree = () => {
    workingState.deprecatedUnits.forEach(commitOperation);
    commitOperation(workingState.temporaryTree.child);
    workingState.currentTree = workingState.temporaryTree;
    workingState.temporaryTree = null;
};

const commitDelete = (unit: Unit, domParent: Node) => {
    if (unit.dom) {
        domParent.removeChild(unit.dom);
    } else {
        commitDelete(unit.child, domParent);
    }
};

const workLoop: IdleRequestCallback = (deadline) => {
    const canWork = () => deadline.timeRemaining() >= 1 && workingState.nextUnit;

    while (canWork()) {
        console.log(deadline.timeRemaining());
        console.log(workingState.nextUnit);
        workingState.nextUnit = processUnit(workingState.nextUnit);
    }

    const isReconcilingFinished = !workingState.nextUnit && workingState.temporaryTree;

    if (isReconcilingFinished) {
        mountTree();
    }

    requestIdleCallback(workLoop);
};

requestIdleCallback(workLoop);

export default workLoop;