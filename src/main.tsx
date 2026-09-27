import { RouterProvider } from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { installUnauthorizedHandler } from "@/api/http";
import { Toaster } from "@/components/ui";
import { router } from "@/router";
import { store } from "@/store/store";
import { sessionCheckRequest, sessionExpired } from "@/store/auth/authActions";
import "@/styles.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Missing app root element.");

installUnauthorizedHandler(() => store.dispatch(sessionExpired()));

function AuthBootstrap({ children }: { children: ReactNode }) {
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    store.dispatch(sessionCheckRequest());
  }, []);
  return children;
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <AuthBootstrap>
        <RouterProvider router={router} />
        <Toaster />
      </AuthBootstrap>
    </Provider>
  </StrictMode>,
);
