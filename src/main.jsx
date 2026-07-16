import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { store } from "./app/store";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster 
        position="top-right" 
        reverseOrder={false} 
        gutter={10}
        toastOptions={{
        duration: 3000,
        style: {
          fontSize: "14px",
          borderRadius: "8px",
          background: "#fff",
          color: "#333",
        },
      }}
      />
    </BrowserRouter>
  </Provider>
);