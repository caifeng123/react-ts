const createTextElement = (text: string) => ({
  type: "TEXT_ELEMENT",
  props: {
    nodeValue: text,
    children: []
  }
});

export const createElement = (
  type: string,
  props: Record<string, any>,
  ...children: JSX.Element[]
) => ({
  type,
  props: {
    ...props,
    children: children.map((child) =>
      typeof child === "object" ? child : createTextElement(child)
    )
  }
});
