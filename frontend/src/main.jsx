import React from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App";
import {store} from "./app/store";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";

import {ToastContainer, toast} from "react-toastify";

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);

  root.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <ToastContainer />
      </BrowserRouter>
    </Provider>
  );
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file."
  );
}
