import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/great-vibes/latin-400.css";
import { Cover } from "./components/Cover";
import { Noivos } from "./components/Noivos";
import { Invitation } from "./components/Invitation";
import "./styles.css";
function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.querySelector("h1")?.setAttribute("tabindex", "-1");
    document.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
  }, [pathname]);
  return (
    <Routes>
      <Route path="/" element={<Cover />} />
      <Route path="/convite" element={<Invitation />} />
      <Route path="/noivos" element={<Noivos />} />
      <Route path="*" element={<Cover />} />
    </Routes>
  );
}
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
