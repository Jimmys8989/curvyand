import React from "react";
import { Scissors, Award, Sparkles, ChevronRight, Heart } from "lucide-react";

interface HomepageProps {
  onNavigate: (path: string) => void;
}

export default function Homepage({ onNavigate }: HomepageProps) {
  return (
    <div className="max-w-4xl mx-auto py-12 md:py-20 px-4">
      {/* Visual Accent */}
      <div className="flex justify-center mb-6">
        <span className="text-[11px] font-display font-black uppercase tracking-[0.25em] text-[#9E5A44] bg-[#EEDCD2]/40 px-3.5 py-1.5 rounded-full border border-[#E7E2D8]/30">
          The Plus Sizing Standard
        </span>
      </div>

      {/* Elegant Editorial Title */}
      <div className="text-center space-y-4 mb-16">
        <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-[#1C1917]">
          Curvy<span className="text-[#9E5A44] font-light italic">&</span>
        </h1>
        <p className="text-lg md:text-xl text-neutral-600 font-serif italic max-w-2xl mx-auto leading-relaxed">
          Sizing transparency, fit confidence, and high-fashion without compromise.
        </p>
        <div className="h-[1px] w-16 bg-[#9E5A44]/30 mx-auto mt-6"></div>
        <p className="text-xs md:text-sm text-neutral-500 font-sans max-w-lg mx-auto leading-relaxed pt-2">
          A premier digital studio crafted exclusively to align body measurements with community-verified sizing data across the top plus-size fashion brands.
        </p>
      </div>

      {/* Simple, Elegant Gateway Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {/* Gateway 1: Size Converter */}
        <div 
          onClick={() => onNavigate("/size-converter")}
          className="group relative bg-[#FDFBF7] border border-[#E7E2D8] hover:border-[#9E5A44] p-8 rounded-2xl shadow-3xs cursor-pointer transition-all duration-300 hover:shadow-sm flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-xl bg-[#EEDCD2]/40 text-[#9E5A44] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Scissors className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#1C1917] group-hover:text-[#9E5A44] transition-colors">
                Size Converter
              </h3>
              <p className="text-[10px] font-display font-bold uppercase tracking-wider text-[#9E5A44] mt-1">
                Precision Body Mapping
              </p>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed pt-1">
              Input your measurements once to dynamically calculate your exact size across dozens of top plus-size brands, and access tailored AI styling and fit advice.
            </p>
          </div>
          <div className="mt-8 pt-4 border-t border-[#E7E2D8]/40 flex items-center justify-between text-xs font-display font-bold uppercase tracking-widest text-neutral-400 group-hover:text-[#9E5A44] transition-colors">
            <span>Launch Converter</span>
            <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Gateway 2: Brand Directory */}
        <div 
          onClick={() => onNavigate("/brand-directory")}
          className="group relative bg-[#FDFBF7] border border-[#E7E2D8] hover:border-[#9E5A44] p-8 rounded-2xl shadow-3xs cursor-pointer transition-all duration-300 hover:shadow-sm flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-xl bg-[#EEDCD2]/40 text-[#9E5A44] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#1C1917] group-hover:text-[#9E5A44] transition-colors">
                Brand Directory
              </h3>
              <p className="text-[10px] font-display font-bold uppercase tracking-wider text-[#9E5A44] mt-1">
                Sizing Integrity Database
              </p>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed pt-1">
              Explore our verified database of plus-size brands. Browse sizing ranges, consult community reviews, and vote to maintain real-time sizing accuracy.
            </p>
          </div>
          <div className="mt-8 pt-4 border-t border-[#E7E2D8]/40 flex items-center justify-between text-xs font-display font-bold uppercase tracking-widest text-neutral-400 group-hover:text-[#9E5A44] transition-colors">
            <span>Explore Brands</span>
            <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Bottom Editorial Vibe Banner */}
      <div className="mt-16 text-center border-t border-[#E7E2D8] pt-12">
        <div className="flex items-center justify-center space-x-2 text-[#9E5A44] mb-3">
          <Heart className="h-4 w-4 fill-current" />
          <span className="text-[10px] font-display font-bold uppercase tracking-wider">Community First</span>
        </div>
        <p className="text-[11px] text-neutral-400 font-mono uppercase tracking-widest leading-relaxed">
          No filters. No guesswork. Just your perfect fit.
        </p>
      </div>
    </div>
  );
}
