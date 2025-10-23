import React from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App";
import {store} from "./app/store";
import {Provider} from "react-redux";
import {registerSW} from "virtual:pwa-register";
import toast, {Toaster} from "react-hot-toast";

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
    toast.success("✅ App ready to work offline!", {autoClose: 3000});
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
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file."
  );
}
