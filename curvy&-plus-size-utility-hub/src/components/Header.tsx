import React from "react";
import { Sparkles, Heart, Flame, Apple } from "lucide-react";

export default function Header() {
  return (
    <div className="w-full bg-[#FAF9F6] text-[#1A1A1A]">
      {/* Top Navigation Header from Design HTML */}
      <header className="h-20 border-b border-[#1A1A1A] flex items-center justify-between px-4 md:px-10 flex-shrink-0">
        <div className="text-3xl md:text-4xl font-serif font-black tracking-tighter uppercase italic">
          Curvy<span className="not-italic text-[#D64545]">&</span>
        </div>
        <nav className="flex gap-4 md:gap-8 text-[11px] uppercase tracking-[0.2em] font-semibold opacity-60">
          <a href="#" className="hover:opacity-100 transition-opacity">Archive</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Community</a>
          <a href="#" className="hover:opacity-100 transition-opacity">About</a>
          <a href="#" className="text-[#1A1A1A] opacity-100 border-b border-[#1A1A1A]">Tools</a>
        </nav>
        <div className="w-10 h-10 border border-[#1A1A1A] flex items-center justify-center">
          <div className="w-6 h-[1px] bg-[#1A1A1A] relative before:absolute before:top-[-6px] before:w-6 before:h-[1px] before:bg-[#1A1A1A] after:absolute after:bottom-[-6px] after:w-6 after:h-[1px] after:bg-[#1A1A1A]"></div>
        </div>
      </header>

      {/* Main Mission Section */}
      <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Editorial Top bar */}
        <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 font-mono mb-6 flex items-center gap-4">
          <span>Est. 2026</span>
          <span className="w-1.5 h-1.5 bg-[#1A1A1A] rounded-full"></span>
          <span>Bespoke Curvy Studio</span>
          <span className="w-1.5 h-1.5 bg-[#1A1A1A] rounded-full"></span>
          <span>Vogue Edition</span>
        </div>

        {/* Brand Mission Statement */}
        <p className="max-w-2xl text-stone-600 font-sans font-light tracking-wide text-sm md:text-base leading-relaxed mb-6">
          A customized premium digital toolkit crafted exclusively for plus-size women. 
          We believe in celebrating curves, commanding respect, and designing life with bold, uncompromising luxury.
        </p>

        {/* Miniature grid links for aesthetic structure */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mt-4 border-t border-[#1A1A1A] pt-6 font-mono text-[11px] tracking-wider uppercase text-stone-700">
          <div className="flex items-center justify-center gap-2 py-1 hover:text-[#D64545] transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-[#D64545]" />
            <span>I. Fashion Atelier</span>
          </div>
          <div className="flex items-center justify-center gap-2 py-1 hover:text-[#D64545] transition-colors">
            <Heart className="w-3.5 h-3.5 text-[#D64545]" />
            <span>II. Love Storyteller</span>
          </div>
          <div className="flex items-center justify-center gap-2 py-1 hover:text-[#D64545] transition-colors">
            <Flame className="w-3.5 h-3.5 text-[#D64545]" />
            <span>III. Kinetic Fitness</span>
          </div>
          <div className="flex items-center justify-center gap-2 py-1 hover:text-[#D64545] transition-colors">
            <Apple className="w-3.5 h-3.5 text-[#D64545]" />
            <span>IV. Holistic Nourish</span>
          </div>
        </div>
      </div>
    </div>
  );
}
