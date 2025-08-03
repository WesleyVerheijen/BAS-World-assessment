import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/styles/global.less"; // Ensure this exists

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
