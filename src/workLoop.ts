import {
    DOMUnit,
    FunctionUnit,
    Operations, StateMutator,
    Unit,
    WorkingState
} from "./types/units";
import {createDOM, updateDOM} from "./rendering";
import * as _ from 'lodash/fp';
import {RenderFunction} from "./types/shared";

export const workingState: WorkingState = {
    nextUnit: null,
    temporaryTree: null,
    currentTree: null,
    deprecatedUnits: [],
    mutatorIdx: 0,
    temporaryFunctionUnit: null,
};

const createUpdateUnit = (oldUnit: Unit, parent: Unit, vNode: JSX.VNode): Unit => ({
    value: oldUnit.value,
    props: vNode.props,
    dom: oldUnit.dom,
    parent,
    old: oldUnit,
    operation: Operations.UPDATE,
});

const createCreateUnit = (parent: Unit, vNode: JSX.VNode): Unit => ({
    value: vNode.value,
    props: vNode.props,
    dom: null,
    parent,
    old: null,
    operation: Operations.CREATE,
});

const markAsDeprecated = (unit: Unit) => {
    unit.operation = Operations.DELETE;
    workingState.deprecatedUnits.push(unit);
};

const reconcileChildren = (unit: Unit, children: JSX.VNode[]) => {
    let oldUnit = unit?.old?.child;
    let prevSibling: Unit = null;

    const labelDeprecatedUnits = (oldUnit: Unit) => {
        if (oldUnit) {
            markAsDeprecated(oldUnit);
            labelDeprecatedUnits(oldUnit.sibling);
        }
    };

    children.forEach((child, idx) => {
        let newUnit: Unit = null;
        const haveSameType = oldUnit && child?.value === oldUnit.value;

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
        } else {
            unit.child = newUnit;
        }
        prevSibling = newUnit;
    });

    labelDeprecatedUnits(oldUnit);
};

const isFunctionComponent = (unit: Unit): unit is Unit<RenderFunction> => unit.value instanceof Function;

const updateFunctionComponent = (unit: FunctionUnit) => {
    workingState.temporaryFunctionUnit = unit;
    workingState.mutatorIdx = 0;
    workingState.temporaryFunctionUnit.mutators = [];

    const children = _.flatten([unit.value(unit.props)] ?? []);
    reconcileChildren(unit, children);
};

type MutatorAction<T> = (prev: T) => T;
type MutateFunction<T> = (action: MutatorAction<T>) => void;

export const createLocalState = <T>(initial: T): [T, MutateFunction<T>] => {
    const oldMutator = workingState.temporaryFunctionUnit
        ?.old
        ?.mutators?.[workingState.mutatorIdx];

    const mutator: StateMutator<T> = {
        state: oldMutator?.state ?? initial,
        queue: [],
    };

    const actions = oldMutator?.queue ?? [];
    actions.forEach(action => {
        mutator.state = action(mutator.state);
    });

    const mutate: MutateFunction<T> = action => {
        mutator.queue.push(action);

        workingState.temporaryTree = {
            value: 'ROOT',
            dom: workingState.currentTree.dom,
            props: workingState.currentTree.props,
            old: workingState.currentTree,
        };

        workingState.nextUnit = workingState.temporaryTree;
        workingState.deprecatedUnits = [];
    };

    workingState.temporaryFunctionUnit.mutators.push(mutator);
    workingState.mutatorIdx++;
    return [mutator.state, mutate];
};

const updateDOMComponent = (domUnit: DOMUnit) => {
    if (!domUnit.dom) {
        domUnit.dom = createDOM(domUnit);
    }
    reconcileChildren(domUnit, domUnit.props.children);
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

        const getParentDom = (unit: Unit): Node => unit.parent?.dom ?? getParentDom(unit.parent);
        const domParent = getParentDom(unit);

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
