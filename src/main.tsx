import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { applyTheme, getStoredThemePreference } from "./lib/theme";
import "@fontsource-variable/inter";
import "./index.css";

applyTheme(getStoredThemePreference());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
