import React, { useState } from "react";

interface BrandLogoProps {
  name: string;
  logoUrl?: string;
  siteUrl?: string;
  className?: string;
}

export default function BrandLogo({
  name,
  logoUrl,
  siteUrl,
  className = "h-12 w-12 rounded-xl",
}: BrandLogoProps) {
  const [error, setError] = useState(false);

  // Extract initials for the high-fashion monogram fallback
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || name.slice(0, 2).toUpperCase();

  // Construct logo URL if not provided directly
  let finalUrl = logoUrl;
  if (!finalUrl && siteUrl) {
    try {
      const domain = new URL(siteUrl).hostname.replace(/^www\./, "");
      finalUrl = `https://logo.clearbit.com/${domain}`;
    } catch {
      // ignore
    }
  }

  // Elegant color schemes for the monogram fallback circles
  const bgColors = [
    "bg-[#FAF7F2] text-[#9E5A44] border-[#E7E2D8]",
    "bg-[#FAF0EB] text-[#D28268] border-[#F1E4DF]",
    "bg-[#F7F4F0] text-[#C17A63] border-[#EAE3DC]",
  ];
  // Simple deterministic hash to choose color scheme
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorClass = bgColors[hash % bgColors.length];

  if (!finalUrl || error) {
    return (
      <div
        className={`${className} flex items-center justify-center font-display font-black text-xs tracking-widest border uppercase shrink-0 shadow-3xs ${colorClass}`}
        title={name}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className={`${className} bg-white border border-[#E7E2D8] flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-3xs relative group`}>
      <img
        src={finalUrl}
        alt={`${name} Logo`}
        onError={() => setError(true)}
        className="max-h-full max-w-full object-contain transition-all duration-300 group-hover:scale-105"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
