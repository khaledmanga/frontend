import { RouterProvider } from "@tanstack/react-router";
import { type ReactNode, StrictMode, useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { installUnauthorizedHandler } from "@/apis/http";
import { Toaster } from "@/components/ui/Toast";
import { sessionCheckRequest, sessionExpired } from "@/reducer/authActions";
import { router } from "@/routes/router";
import { store } from "@/store/store";

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

export function App() {
  return (
    <StrictMode>
      <Provider store={store}>
        <AuthBootstrap>
          <RouterProvider router={router} />
          <Toaster />
        </AuthBootstrap>
      </Provider>
    </StrictMode>
  );
}
