import React from "react";
import { createRoot } from "react-dom/client"; // Correct import for React 18+
import App from "./App.js";

const container = document.getElementById("root");
const root = createRoot(container); // createRoot replaces ReactDOM.render
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
