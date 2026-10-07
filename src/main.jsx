import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

document.documentElement.dataset.theme = localStorage.getItem("theme") || "light";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>
);

