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

const rerender = (value) => {
  const element = (
    <div>
      <input onInput={updateValue} value={value} />
      <h2>Hello {value}</h2>
      <h2>Hello {value}</h2>
      <h2>Hello {value}</h2>
    </div>
  );
  render(element, container!);
};

function updateValue(e) {
  rerender(e.target.value);
}

rerender("123");
