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

  constructor(element: JSX.Element, parentFiber?: Fiber) {
    this.type = element.type;
    this.props = element.props;
    this.parent = parentFiber;
    this.dom = this.createDom();
  }

  createDom = () => {
    if (this.type === "TEXT_ELEMENT") {
      return document.createTextNode("");
    }
    const dom = document.createElement(this.type);

    const { __source, children, ...rest } = this.props;
    Object.keys(rest).forEach((element) => {
      dom.setAttribute(element, rest[element]);
    });
    return dom;
  };

  connectPrev(preFiber: Fiber) {
    this.sibling = preFiber;
  }
  connectChild(child: Fiber) {
    this.child = child;
  }
}
