import React from "react";
import { Scissors, Award, Sparkles, Heart } from "lucide-react";
import { MeasurementProfile } from "../types";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: MeasurementProfile | null;
}

export default function Header({ activeTab, setActiveTab, profile }: HeaderProps) {
  return (
    <header className="border-b border-[#E7E2D8] bg-[#FDFBF7] sticky top-0 z-40">
      {/* Top micro-announcement banner */}
      <div className="bg-[#9E5A44] py-1.5 px-4 text-center text-[11px] font-display font-medium tracking-widest text-[#FAF7F2] uppercase">
        Empowering every curve with precise fit and luxurious design.
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo & Brand Name */}
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9E5A44] text-[#FAF7F2]">
              <span className="font-serif text-xl font-bold italic leading-none">&</span>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#1C1917]">
                Curvy<span className="text-[#9E5A44] font-light italic">&</span>
              </span>
              <p className="text-[10px] font-display tracking-widest text-neutral-500 uppercase">
                Fashion Sizing Suite
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex space-x-1 sm:space-x-4">
            <button
              onClick={() => setActiveTab("converter")}
              className={`flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm font-display font-semibold uppercase tracking-wider rounded-md transition-luxury cursor-pointer ${
                activeTab === "converter"
                  ? "bg-[#EEDCD2] text-[#9E5A44]"
                  : "text-neutral-600 hover:text-[#9E5A44] hover:bg-[#FAF7F2]"
              }`}
            >
              <Scissors className="h-4 w-4" />
              <span>Sizing Converter</span>
            </button>

            <button
              onClick={() => setActiveTab("database")}
              className={`flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm font-display font-semibold uppercase tracking-wider rounded-md transition-luxury cursor-pointer ${
                activeTab === "database"
                  ? "bg-[#EEDCD2] text-[#9E5A44]"
                  : "text-neutral-600 hover:text-[#9E5A44] hover:bg-[#FAF7F2]"
              }`}
            >
              <Award className="h-4 w-4" />
              <span>Brand Directory</span>
            </button>
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
