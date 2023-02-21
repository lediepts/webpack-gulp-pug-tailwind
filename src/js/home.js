import { createElement } from "react";
import { createRoot } from "react-dom/client"
import Home from "./components/index.jsx";

(() => {
  const elm = document.getElementById("slider")
  if (!elm) return
  const root = createRoot(elm)

  root.render(createElement(Home))
}
)()