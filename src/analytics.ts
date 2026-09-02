export type AnalyticsConsent = "granted" | "denied";

export const ANALYTICS_PREFERENCES_EVENT = "curvy:open-analytics-preferences";

const ANALYTICS_CONSENT_KEY = "curvy_analytics_consent";
const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() || "G-BS73WKMRC3";

export const isGoogleAnalyticsConfigured = /^G-[A-Z0-9]+$/i.test(measurementId);

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;

export function getAnalyticsConsent(): AnalyticsConsent | null {
  const stored = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
  return stored === "granted" || stored === "denied" ? stored : null;
}

export function saveAnalyticsConsent(consent: AnalyticsConsent) {
  window.localStorage.setItem(ANALYTICS_CONSENT_KEY, consent);
}

function prepareGoogleTagQueue() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
}

export function initializeGoogleAnalytics() {
  if (!isGoogleAnalyticsConfigured || initialized) return;

  prepareGoogleTagQueue();
  window.gtag?.("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag?.("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
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

export function updateGoogleAnalyticsConsent(consent: AnalyticsConsent) {
  if (!initialized) return;
  window.gtag?.("consent", "update", {
    analytics_storage: consent,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}
