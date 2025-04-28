import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { createContext } from "react";

// For IP address detection in admin panel
export const ClientContext = createContext<{ ip: string | null }>({ ip: null });

// Render app with a static demo IP address (for demo purposes)
const root = createRoot(document.getElementById("root")!);
root.render(
  <ClientContext.Provider value={{ ip: "127.0.0.1" }}>
    <App />
  </ClientContext.Provider>
);
