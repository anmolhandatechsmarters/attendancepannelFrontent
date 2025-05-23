import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "core-js";
import "./index.css";
import App from "./App";
import store from "./store";
import { NotificationProvider } from "./utils/NotificationContext";
const theme = localStorage.getItem('paneltheme') || 'light';
document.documentElement.classList.add(theme);
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </Provider>
);
