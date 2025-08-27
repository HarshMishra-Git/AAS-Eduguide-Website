import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { reportWebVitals, initPerformanceMonitoring } from "./lib/performance";

// Initialize performance monitoring
if (process.env.NODE_ENV === 'development') {
  initPerformanceMonitoring();
  reportWebVitals(console.log);
}

createRoot(document.getElementById("root")!).render(<App />);
