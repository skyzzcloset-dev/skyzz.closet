import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { registerSW } from "virtual:pwa-register";

// Register Service Worker with update + offline handling
const updateSW = registerSW({
  onNeedRefresh() {
    toast.info("🔄 New version available! Updating...", {
      autoClose: 3000,
    });
    setTimeout(() => {
      updateSW(true); // refresh SW
    }, 3000);
  },
  onOfflineReady() {
    toast.success("✅ App ready to work offline!", { autoClose: 3000 });
  },
});

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);

  root.render(
    <>
      <Provider store={store}>
        <App />
      </Provider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file."
  );
}
