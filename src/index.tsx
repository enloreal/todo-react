import React from "react";
import ReactDOM from "react-dom/client";
import App, { StoreContext } from "./App"; // Импортируем StoreContext из App.tsx
import todoStore from "./store/todoStore";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <StoreContext.Provider value={{ todoStore }}>
      <App />
    </StoreContext.Provider>
  </React.StrictMode>
);