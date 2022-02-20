import * as React from "react";
import { createElement, render } from "../react";

import App from "./App";

/** @jsxRuntime classic */
/** @jsx createElement */

const element = (
  <div id="foo">
    <a href="https://www.baidu.com">bar123</a>
    <b>111</b>
  </div>
);

console.log(element);

const rootElement = document.getElementById("root");
render(element, rootElement!);
