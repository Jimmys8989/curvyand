import React from "react";
import { Scissors, Award } from "lucide-react";
import InternalLink from "./InternalLink";

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function Header({ currentPath, onNavigate }: HeaderProps) {
  const isHome = currentPath === "/";
  const isConverterActive = currentPath.startsWith("/size-converter");
  const isDatabaseActive = currentPath.startsWith("/brand-directory");

  if (isHome) {
    return (
      <header className="sticky top-0 z-40 border-b border-[#E7E2D8]/70 bg-[#FAF7F2]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-center px-4">
          <InternalLink
            href="/"
            onNavigate={onNavigate}
            className="inline-flex items-center space-x-2.5 group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#9E5A44] text-[#FAF7F2] transition-transform group-hover:scale-105">
              <span className="font-serif text-lg font-bold italic leading-none">&</span>
            </div>
            <span className="font-serif text-2xl font-semibold tracking-[-0.035em] text-[#9E5A44] transition-opacity group-hover:opacity-80 sm:text-3xl">
              Curvy<span className="font-light italic text-[#C78169]">&</span>
            </span>
          </InternalLink>
        </div>
        <div className="bg-[#9E5A44] px-4 py-1 text-center text-[8px] font-display font-semibold uppercase tracking-[0.22em] text-[#FAF7F2] sm:text-[9px]">
          Empowering every curve with precise fit and luxurious design.
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#E7E2D8]/70 bg-[#FDFBF7]/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand Name */}
          <InternalLink
            href="/"
            onNavigate={onNavigate}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#9E5A44] text-[#FAF7F2] transition-transform group-hover:scale-105">
              <span className="font-serif text-base font-bold italic leading-none">&</span>
            </div>
            <span className="font-serif text-xl font-semibold tracking-tight text-[#9E5A44] transition-opacity group-hover:opacity-80 sm:text-2xl">
              Curvy<span className="font-light italic text-[#C78169]">&</span>
            </span>
          </InternalLink>

          {/* Nav Tabs */}
          <nav className="flex gap-1 sm:gap-3">
            <InternalLink
              href="/size-converter"
              onNavigate={onNavigate}
              className={`flex items-center gap-2 rounded-md px-2.5 py-2 text-[10px] font-display font-semibold uppercase tracking-wider transition-luxury sm:px-3 sm:text-xs ${
                isConverterActive
                  ? "bg-[#EEDCD2] text-[#9E5A44]"
                  : "text-neutral-600 hover:text-[#9E5A44] hover:bg-[#FAF7F2]"
              }`}
            >
              <Scissors className="h-4 w-4" />
              <span className="hidden sm:inline">Sizing Converter</span>
            </InternalLink>

            <InternalLink
              href="/brand-directory"
              onNavigate={onNavigate}
              className={`flex items-center gap-2 rounded-md px-2.5 py-2 text-[10px] font-display font-semibold uppercase tracking-wider transition-luxury sm:px-3 sm:text-xs ${
                isDatabaseActive
                  ? "bg-[#EEDCD2] text-[#9E5A44]"
                  : "text-neutral-600 hover:text-[#9E5A44] hover:bg-[#FAF7F2]"
              }`}
            >
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Brand Directory</span>
            </InternalLink>
          </nav>
        </div>
      </div>
      <div className="bg-[#9E5A44] px-4 py-1 text-center text-[8px] font-display font-semibold uppercase tracking-[0.22em] text-[#FAF7F2] sm:text-[9px]">
        Empowering every curve with precise fit and luxurious design.
      </div>
    </header>
  );
}
