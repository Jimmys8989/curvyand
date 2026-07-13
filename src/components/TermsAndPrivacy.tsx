import React, { useState } from "react";
import { ShieldCheck, FileText, ArrowLeft, Scale, Lock } from "lucide-react";

interface TermsAndPrivacyProps {
  onBack: () => void;
}

export default function TermsAndPrivacy({ onBack }: TermsAndPrivacyProps) {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");

  return (
    <div className="max-w-4xl mx-auto py-8 md:py-12 px-4 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="group flex items-center space-x-2 text-xs font-display font-bold uppercase tracking-wider text-[#9E5A44] hover:text-[#5C3224] transition-colors mb-8 cursor-pointer"
        id="btn-terms-back"
      >
        <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
        <span>Back to Home</span>
      </button>

      {/* Header */}
      <div className="text-center mb-10 space-y-3">
        <span className="text-[11px] font-display font-black uppercase tracking-[0.25em] text-[#9E5A44] bg-[#EEDCD2]/40 px-3.5 py-1.5 rounded-full border border-[#E7E2D8]/30">
          Legal & Compliance
        </span>
        <h1 className="font-serif text-3xl md:text-4xl text-[#1C1917] tracking-tight">
          Terms & Privacy Policy
        </h1>
        <p className="text-sm font-serif italic text-[#9E5A44] max-w-lg mx-auto">
          Our commitment to size-inclusive fashion accuracy, user privacy, and data transparency.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex rounded-full bg-[#EEDCD2]/40 p-1 border border-[#E7E2D8]">
          <button
            onClick={() => setActiveTab("terms")}
            className={`flex items-center space-x-2 rounded-full px-6 py-3 text-xs font-display font-bold uppercase tracking-wider transition-luxury cursor-pointer ${
              activeTab === "terms"
                ? "bg-[#9E5A44] text-[#FAF7F2] shadow-sm"
                : "text-[#9E5A44] hover:text-[#5C3224] hover:bg-[#EEDCD2]/20"
            }`}
            id="tab-terms-terms"
          >
            <Scale className="h-3.5 w-3.5" />
            <span>Terms of Service</span>
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`flex items-center space-x-2 rounded-full px-6 py-3 text-xs font-display font-bold uppercase tracking-wider transition-luxury cursor-pointer ${
              activeTab === "privacy"
                ? "bg-[#9E5A44] text-[#FAF7F2] shadow-sm"
                : "text-[#9E5A44] hover:text-[#5C3224] hover:bg-[#EEDCD2]/20"
            }`}
            id="tab-terms-privacy"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Privacy Policy</span>
          </button>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-[#FAF7F2] border border-[#E7E2D8] rounded-2xl p-6 md:p-10 shadow-sm space-y-6 text-[#44403C] leading-relaxed font-sans text-sm">
        {activeTab === "terms" ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-[#E7E2D8]">
              <FileText className="h-6 w-6 text-[#9E5A44]" />
              <h2 className="font-serif text-xl font-bold text-[#1C1917]">Terms of Service</h2>
            </div>
            <p className="text-neutral-500 text-xs italic">Last updated: July 12, 2026</p>

            <section className="space-y-3">
              <h3 className="font-serif font-bold text-[#1C1917] text-base">1. Agreement to Terms</h3>
              <p>
                By accessing or using the <strong>Curvy&</strong> sizing suite platform, you agree to be bound by these Terms of Service. If you do not agree to all of the terms and conditions, you are prohibited from using this utility.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-serif font-bold text-[#1C1917] text-base">2. Purpose of Sizing Suite</h3>
              <p>
                Curvy& provides digital tools including size converters, brand directory databases, and sizing comparison calculators. All recommendations generated are estimations based on official brand sizing charts and community feedback. Because garments can vary based on fabric, cut, and manufacturing tolerances, we do not guarantee a 100% accurate fit for any individual body shape.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-serif font-bold text-[#1C1917] text-base">3. User Measurement Profiles</h3>
              <p>
                If you create a Measurement Profile on our site, your input data (such as bust, waist, hips, and height) is stored exclusively in your local browser storage (<code className="bg-[#EEDCD2]/30 px-1 rounded text-xs font-mono">localStorage</code>) to maintain absolute privacy. You are responsible for maintaining the confidentiality of your own local device settings.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-serif font-bold text-[#1C1917] text-base">4. Community Reviews & Contributions</h3>
              <p>
                When you post reviews, feedback, or vote on fit consistency scores for plus-size brands, you agree that your comments are helpful, respectful, and free of vulgarity. We reserve the right to remove any review that is inappropriate or malicious. You retain ownership of your comments, but grant us a non-exclusive, perpetual license to display them within the sizing database.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-serif font-bold text-[#1C1917] text-base">5. Intellectual Property</h3>
              <p>
                All editorial graphics, UI styling, brand logos (excluding official third-party trademarks, which belong to their respective copyright owners), custom sizing logic algorithms, and brand directory lists are the intellectual property of Curvy& and may not be reproduced without written authorization.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-serif font-bold text-[#1C1917] text-base">6. Disclaimer of Warranties</h3>
              <p className="italic text-neutral-500">
                The Curvy& application is provided on an "as is" and "as available" basis. We disclaim all warranties of any kind, whether express or implied, including the accuracy or commercial fitness of sizing charts, fit statistics, and user reviews.
              </p>
            </section>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-[#E7E2D8]">
              <ShieldCheck className="h-6 w-6 text-[#9E5A44]" />
              <h2 className="font-serif text-xl font-bold text-[#1C1917]">Privacy Policy</h2>
            </div>
            <p className="text-neutral-500 text-xs italic">Last updated: July 12, 2026</p>

            <section className="space-y-3">
              <h3 className="font-serif font-bold text-[#1C1917] text-base">1. Information We Collect</h3>
              <p>
                We believe in absolute data privacy.
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Personal Sizing Metrics:</strong> Your bust, waist, hips, and height measurements are stored entirely client-side using browser-based <code className="bg-[#EEDCD2]/30 px-1 rounded text-xs font-mono">localStorage</code>. We never transmit these personal metrics to external web servers.
                </li>
                <li>
                  <strong>Community Feedback:</strong> When you submit a brand review or size vote, that specific comment (and the custom display name you choose) is synchronized to our server to show other shoppers. No real-world contact details or billing info are requested.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="font-serif font-bold text-[#1C1917] text-base">2. How We Use Information</h3>
              <p>
                We use the server-side review data solely to power the community leaderboard and help other plus-size individuals make informed shopping choices. We do not sell, rent, or lease any data to ad agencies or data brokers.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-serif font-bold text-[#1C1917] text-base">3. Cookies & Tracking</h3>
              <p>
                Curvy& does not use invasive cross-site tracking pixels or behavioral ad cookies. We may use simple local session identifiers to remember your navigation preferences.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-serif font-bold text-[#1C1917] text-base">4. Data Deletion</h3>
              <p>
                You can wipe your sizing profile instantly by clicking "Clear Profile" inside the Sizing Converter. To remove your custom reviews, you can use the delete button adjacent to your review or email our web administrator.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-serif font-bold text-[#1C1917] text-base">5. Updates to This Policy</h3>
              <p>
                We may periodically update our privacy policies. We encourage users to check this page to stay informed about how we celebrate and protect your fit data.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
