type options = {
  parentFiber?: Fiber;
  effectTag?: "UPDATE" | "PLACEMENT" | "DELETION";
  dom?: HTMLElement | Text;
  alternate?: Fiber;
};

export class Fiber {
  type: string;
  dom: HTMLElement | Text;
  props: {
    [key: string]: any;
    children?: JSX.Element[];
  };
  parent?: Fiber;
  sibling?: Fiber;
  child?: Fiber;
  alternate?: Fiber;
  effectTag?: "UPDATE" | "PLACEMENT" | "DELETION";

  constructor(
    element: JSX.Element,
    { parentFiber, effectTag, dom, alternate }: options = {}
  ) {
    this.type = element.type;
    this.props = element.props;
    this.parent = parentFiber;
    this.effectTag = effectTag;
    this.alternate = alternate;
    this.dom = dom || this.createDom();
  }

  createDom = () => {
    if (this.type === "TEXT_ELEMENT") {
      return document.createTextNode(this.props.nodeValue);
    }
    return this.updateAttr(document.createElement(this.type));
  };

  // delete old attr & add new attr
  updateAttr = (dom: HTMLElement = this.dom as HTMLElement) => {
    const { __source, children, ...newrest } = this.props;
    if (this.alternate) {
      const { __source, children, ...oldrest } = this.alternate.props;
      Object.keys(oldrest).forEach((element) => {
        if (!(element in newrest)) {
          dom.removeAttribute(element);
        }
      });
    }
    Object.keys(newrest).forEach((element) => {
      dom.setAttribute(element, newrest[element]);
    });
    return dom;
  };
  connectSibling(preFiber: Fiber) {
    this.sibling = preFiber;
  }

  connectChild(child: Fiber) {
    this.child = child;
  }
}
