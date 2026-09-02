const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() || "G-BS73WKMRC3";

export const isGoogleAnalyticsConfigured = /^G-[A-Z0-9]+$/i.test(measurementId);

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;

function prepareGoogleTagQueue() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
}

export function initializeGoogleAnalytics() {
  if (!isGoogleAnalyticsConfigured || initialized) return;

  prepareGoogleTagQueue();
  window.gtag?.("js", new Date());
  window.gtag?.("config", measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.id = "curvy-google-tag";
  document.head.appendChild(script);
  initialized = true;
}
