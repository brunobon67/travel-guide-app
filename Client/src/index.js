import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// Import global styles (optional)
import "./styles.css";

// Render the App component inside the root div
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
