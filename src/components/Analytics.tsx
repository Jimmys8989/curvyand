import React, { useEffect, useState } from "react";
import {
  ANALYTICS_PREFERENCES_EVENT,
  getAnalyticsConsent,
  initializeGoogleAnalytics,
  isGoogleAnalyticsConfigured,
  saveAnalyticsConsent,
  type AnalyticsConsent,
  updateGoogleAnalyticsConsent,
} from "../analytics";

export default function Analytics() {
  const [consent, setConsent] = useState<AnalyticsConsent | null>(() => getAnalyticsConsent());
  const [preferencesOpen, setPreferencesOpen] = useState(() => consent === null);

  useEffect(() => {
    const openPreferences = () => setPreferencesOpen(true);
    window.addEventListener(ANALYTICS_PREFERENCES_EVENT, openPreferences);
    return () => window.removeEventListener(ANALYTICS_PREFERENCES_EVENT, openPreferences);
  }, []);

  useEffect(() => {
    if (consent === "granted") initializeGoogleAnalytics();
    updateGoogleAnalyticsConsent(consent ?? "denied");
  }, [consent]);

  if (!isGoogleAnalyticsConfigured || !preferencesOpen) return null;

  const chooseConsent = (choice: AnalyticsConsent) => {
    saveAnalyticsConsent(choice);
    setConsent(choice);
    setPreferencesOpen(false);
  };

  return (
    <aside
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-2xl border border-[#D8B5A5] bg-[#1C1917] px-5 py-4 text-[#FAF7F2] shadow-2xl sm:bottom-5 sm:flex sm:items-center sm:gap-6 sm:px-6"
      aria-label="Analytics preferences"
    >
      <div className="flex-1">
        <p className="text-[10px] font-display font-bold uppercase tracking-[0.18em] text-[#DFB7B0]">
          Your privacy choice
        </p>
        <p className="mt-1.5 text-xs leading-5 text-neutral-300">
          Allow optional Google Analytics to help us understand overall visits and improve the sizing tools. Your saved body measurements are never sent to Analytics.
        </p>
      </div>
      <div className="mt-4 flex shrink-0 gap-2 sm:mt-0">
        <button
          type="button"
          onClick={() => chooseConsent("denied")}
          className="rounded-full border border-neutral-600 px-4 py-2 text-[10px] font-display font-bold uppercase tracking-wider text-neutral-200 transition-colors hover:border-neutral-400 hover:text-white"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => chooseConsent("granted")}
          className="rounded-full bg-[#A85F45] px-4 py-2 text-[10px] font-display font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#BF7357]"
        >
          Allow analytics
        </button>
      </div>
    </aside>
  );
}
