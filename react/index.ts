import { Fiber } from "./fiber";

export * from "./createObj";

let nextUnitOfWork: Fiber | null = null;
let wipRoot: any = null;

export const render = (element: JSX.Element, container: HTMLElement) => {
  // const dom =
  //   element.type === "TEXT_ELEMENT"
  //     ? document.createTextNode("")
  //     : document.createElement(element.type);
  // element.props.children?.forEach((temp: JSX.Element) => {
  //   render(temp, dom);
  // });
  // const { __source, children, ...rest } = element.props;
  // Object.keys(rest).forEach((element) => {
  //   dom[element] = rest[element];
  // });

  // container.appendChild(dom);
  // {
  //   dom: container,
  //   props: {
  //     children: [element]
  //   }
  // }
  wipRoot = {
    type: "",
    dom: container,
    props: {
      children: [element]
    }
  };
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
  domParent!.appendChild(fiber.dom!);
  commitWork(fiber.child!);
  commitWork(fiber.sibling!);
};

/**
 * 渲染单棵 fiber 树
 */
const commitRoot = () => {
  commitWork(wipRoot.child);
  wipRoot = null;
};

const reconcileChildren = (fiber: Fiber) => {
  let head: Fiber | null = null;
  fiber.props.children?.forEach((child) => {
    const now = new Fiber(child, fiber);
    if (head) {
      now.connectPrev(head);
    } else {
      head = now;
      fiber.connectChild(now);
    }
  });
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
