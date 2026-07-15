import React from "react";
import { Scissors, Award, Sparkles, Heart } from "lucide-react";
import { MeasurementProfile } from "../types";
import InternalLink from "./InternalLink";

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  profile: MeasurementProfile | null;
}

export default function Header({ currentPath, onNavigate, profile }: HeaderProps) {
  const isConverterActive = currentPath === "/size-converter";
  const isDatabaseActive = currentPath.startsWith("/brand-directory");

  return (
    <header className="border-b border-[#E7E2D8] bg-[#FDFBF7] sticky top-0 z-40">
      {/* Top micro-announcement banner */}
      <div className="bg-[#9E5A44] py-1.5 px-4 text-center text-[11px] font-display font-medium tracking-widest text-[#FAF7F2] uppercase">
        Empowering every curve with precise fit and luxurious design.
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo & Brand Name */}
          <InternalLink
            href="/"
            onNavigate={onNavigate}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9E5A44] text-[#FAF7F2] group-hover:scale-105 transition-transform">
              <span className="font-serif text-xl font-bold italic leading-none">&</span>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#1C1917] group-hover:text-[#9E5A44] transition-colors">
                Curvy<span className="text-[#9E5A44] font-light italic">&</span>
              </span>
              <p className="text-[10px] font-display tracking-widest text-neutral-500 uppercase">
                Fashion Sizing Suite
              </p>
            </div>
          </InternalLink>

          {/* Nav Tabs */}
          <nav className="flex space-x-1 sm:space-x-4">
            <InternalLink
              href="/size-converter"
              onNavigate={onNavigate}
              className={`flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm font-display font-semibold uppercase tracking-wider rounded-md transition-luxury cursor-pointer ${
                isConverterActive
                  ? "bg-[#EEDCD2] text-[#9E5A44]"
                  : "text-neutral-600 hover:text-[#9E5A44] hover:bg-[#FAF7F2]"
              }`}
            >
              <Scissors className="h-4 w-4" />
              <span>Sizing Converter</span>
            </InternalLink>

            <InternalLink
              href="/brand-directory"
              onNavigate={onNavigate}
              className={`flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm font-display font-semibold uppercase tracking-wider rounded-md transition-luxury cursor-pointer ${
                isDatabaseActive
                  ? "bg-[#EEDCD2] text-[#9E5A44]"
                  : "text-neutral-600 hover:text-[#9E5A44] hover:bg-[#FAF7F2]"
              }`}
            >
              <Award className="h-4 w-4" />
              <span>Brand Directory</span>
            </InternalLink>
          </nav>

          {/* User Profile Mini Display */}
          <div className="hidden md:flex items-center space-x-2.5">
            {profile ? (
              <div className="flex items-center space-x-2 bg-[#FAF7F2] border border-[#E7E2D8] py-1.5 px-3 rounded-full">
                <Heart className="h-3 w-3 text-[#9E5A44] fill-current animate-pulse" />
                <span className="text-[11px] font-mono font-medium text-neutral-700">
                  Profile: {profile.bust}-{profile.waist}-{profile.hips} {profile.unit}
                </span>
              </div>
            ) : (
              <div className="text-[11px] text-neutral-400 font-display tracking-wide italic">
                No custom measurements set
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
