import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { SessionProvider } from "./hooks/sessionContext.jsx";


createRoot(document.getElementById("root")).render( //  Dodamo SessionProvider, odnosno context kako bi svaka komponenta znala za njega
  <StrictMode>
    <SessionProvider>
      <App />
    </SessionProvider>
  </StrictMode>
);
