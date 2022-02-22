type options = {
  parent?: Fiber;
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
    { parent, effectTag, dom, alternate }: options = {}
  ) {
    this.type = element.type;
    this.props = element.props;
    this.parent = parent;
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
  updateAttr = (dom: HTMLElement | Text = this.dom) => {
    const { __source: b, children: c, ...newrest } = this.props;
    const { __source: a, children: d, ...oldrest } =
      this.alternate?.props || {};
    if (this.type === "TEXT_ELEMENT") {
      if (newrest.nodeValue !== oldrest.nodeValue) {
        (dom as Text).data = newrest.nodeValue;
      }
      return dom;
    }
    Object.keys(oldrest).forEach((element) => {
      if (element.startsWith("on")) {
        if (oldrest[element] !== newrest?.[element]) {
          dom.removeEventListener(
            element.slice(2).toLowerCase(),
            oldrest[element]
          );
        }
      } else if (!(element in newrest)) {
        (dom as HTMLElement).removeAttribute(element);
      }
    });
    Object.keys(newrest).forEach((element) => {
      if (element.startsWith("on")) {
        if (oldrest?.[element] !== newrest[element]) {
          dom.addEventListener(
            element.slice(2).toLowerCase(),
            newrest[element]
          );
        }
      } else {
        (dom as HTMLElement).setAttribute(element, newrest[element]);
      }
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
