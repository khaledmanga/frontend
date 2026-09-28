import { createRoot } from "react-dom/client";
import { App } from "@/App/App";
import "@/assets/styles/styles.css";
import { MESSAGES } from "@/constants/messages";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error(MESSAGES.missingRootElement);

createRoot(rootElement).render(<App />);
