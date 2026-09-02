import { useEffect } from "react";
import { initializeGoogleAnalytics } from "../analytics";

export default function Analytics() {
  useEffect(() => {
    initializeGoogleAnalytics();
  }, []);

  return null;
}
