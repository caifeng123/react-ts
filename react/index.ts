import { Fiber } from "./fiber";

export * from "./createObj";

let nextUnitOfWork: Fiber | null = null;
let wipRoot: any = null;
let currentRoot: any = null;
let deletions: Fiber[] = [];

export const render = (element: JSX.Element, container: HTMLElement) => {
  wipRoot = new Fiber(element, { dom: container, alternate: currentRoot });
  deletions = [];
  nextUnitOfWork = wipRoot;
};

/**
 * 递归渲染 fiber
 */
const commitWork = (fiber: Fiber) => {
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent!.dom;
  // append dom node created
  if (fiber.effectTag === "PLACEMENT" && fiber.dom) {
    domParent.appendChild(fiber.dom);
    // update dom element
  } else if (fiber.effectTag === "UPDATE") {
    fiber.updateAttr();
    // delete dom
  } else if (fiber.effectTag === "DELETION") {
    domParent.removeChild(fiber.dom);
  }
  commitWork(fiber.child!);
  commitWork(fiber.sibling!);
};

/**
 * 渲染单棵 fiber 树
 */
const commitRoot = () => {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
};

const reconcileChildren = (fiber: Fiber) => {
  let head: Fiber | null = null;
  let oldFiber = fiber.alternate && fiber.alternate.child;
  const children = fiber.props.children!;
  let index = 0;
  let now: Fiber | null = null;
  while (index < children.length || oldFiber) {
    const element = children[index];

    const sameType = oldFiber && element && element.type === oldFiber.type;
    if (sameType) {
      // update node props
      now = new Fiber(element, {
        parent: fiber,
        effectTag: "UPDATE",
        dom: oldFiber!.dom,
        alternate: oldFiber
      });
    }
    if (element && !sameType) {
      // add new node
      now = new Fiber(element, {
        parent: fiber,
        effectTag: "PLACEMENT"
      });
    }
    if (oldFiber && !sameType) {
      // delete the oldFiber's node
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }
    if (head) {
      head.connectSibling(now!);
    } else if (now) {
      fiber.connectChild(now);
    }
    head = now;
    index++;
  }
};

const performUnitOfWork = (fiber: Fiber) => {
  // TODO create new fibers
  reconcileChildren(fiber);

  // TODO return next unit of work
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent!;
  }
  return nextFiber;
};

const workLoop = (deadline: IdleDeadline) => {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
};

export const change = (node: JSX.Element) => {};

requestIdleCallback(workLoop);
