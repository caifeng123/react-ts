import React from "react";
import { createElement, render } from "../react";

// import App from "./App";

/** @jsxRuntime classic */
/** @jsx createElement */

// const element = (
//   <div id="foo">
//     <a href="https://www.baidu.com">bar123</a>
//     <b>111</b>
//   </div>
// );

// console.log(element);

// const rootElement = document.getElementById("root");
// render(element, rootElement!);

const container = document.getElementById("root");

const Rerender = ({ value }) => {
  return (
    <div>
      {/* <input onInput={updateValue} value={value} /> */}
      <h2>Hello {value}</h2>
      <h2>Hello {value}</h2>
      <h2>Hello {value}</h2>
    </div>
  );
};

// function updateValue(e) {
//   Rerender(e.target.value);
// }
render(<Rerender value="123" />, container!);

// const Name = () => {
//   return <div>1234</div>;
// }

// function App(props) {
//   return (
//     <h1>
//       Hi {props.name}
//       <input onInput={updateValue} value={value} />
//     </h1>
//   );
// }
// const element = <App name="foo" />;
// render(element, container!);
