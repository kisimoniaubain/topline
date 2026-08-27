import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
if (localStorage.getItem("topline_dark") === "1") document.body.classList.add("dark");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);