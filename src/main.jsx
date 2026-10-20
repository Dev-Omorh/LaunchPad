import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PracticePage from "./pages/PracticePage";
import "./index.css";

const userId = new URLSearchParams(window.location.search).get("user_id") ?? "demo-user";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PracticePage userId={userId} />
  </StrictMode>,
);
