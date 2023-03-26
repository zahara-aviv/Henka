/**
 * ************************************
 *
 * @module  index.tsx
 * @author Zahara Aviv
 * @date
 * @description entry point for application.
 *
 * ************************************
 */

import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.jsx";
import store from "./store";
// opt-in to webpack hot module
// if (module.hot) module.hot.accept();
// package scss style sheets
import "./scss/application.scss";

// Render an <App> component to the #app div in the body
const root = createRoot(document.getElementById("contents") as Element);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
