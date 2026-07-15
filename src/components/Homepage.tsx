import React from "react";
import { ArrowUpRight, Ruler, Search } from "lucide-react";
import InternalLink from "./InternalLink";

interface HomepageProps {
  onNavigate: (path: string) => void;
}

export default function Homepage({ onNavigate }: HomepageProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-7 md:pb-16 md:pt-9">
      <section className="mx-auto mb-10 max-w-3xl text-center">
        <h1 className="font-serif text-4xl font-black tracking-tight text-[#1C1917] md:text-5xl">
          Find your size across plus-size brands.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-neutral-500 md:text-base">
          Enter your measurements or convert a size you already wear, then compare brand charts, fit notes, and sizing reviews.
        </p>
      </section>

      {/* Primary tool entry points */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        {/* Gateway 1: Size Converter */}
        <InternalLink
          href="/size-converter"
          onNavigate={onNavigate}
          className="group relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-[2rem] border border-[#1C1917] bg-[#1C1917] p-7 text-[#FAF7F2] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-7 sm:p-9"
        >
          <div aria-hidden="true" className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div aria-hidden="true" className="absolute -right-8 -top-10 h-44 w-44 rounded-full border border-[#DFB7B0]/30" />

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-display font-bold uppercase tracking-[0.24em] text-[#DFB7B0]">
                01 / Main Tool
              </span>
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#DFB7B0] transition-transform group-hover:rotate-6 group-hover:scale-105">
                <Ruler className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-14 max-w-md">
              <h2 className="font-serif text-4xl font-black tracking-tight sm:text-5xl">Size Converter</h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-300">
                Enter bust, waist, and hip measurements, or translate a size you already wear from one brand to another.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-5">
            <div className="flex flex-wrap gap-2 text-[9px] font-mono uppercase tracking-wider text-neutral-400">
              <span>Measurements</span>
              <span aria-hidden="true">·</span>
              <span>Brand-to-brand</span>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FAF7F2] px-4 py-2.5 text-[10px] font-display font-bold uppercase tracking-wider text-[#1C1917] transition-transform group-hover:translate-x-1">
              Open Converter
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </InternalLink>

        {/* Gateway 2: Brand Directory */}
        <InternalLink
          href="/brand-directory"
          onNavigate={onNavigate}
          className="group relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-[2rem] border border-[#D8B5A5] bg-[#EEDCD2] p-7 text-[#1C1917] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-5 sm:p-9"
        >
          <span aria-hidden="true" className="absolute -right-2 top-10 font-serif text-[10rem] font-black leading-none text-white/25">
            02
          </span>
          <div aria-hidden="true" className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#9E5A44]/30 to-transparent" />

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-display font-bold uppercase tracking-[0.24em] text-[#9E5A44]">
                02 / Explore
              </span>
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#9E5A44]/20 bg-white/35 text-[#9E5A44] transition-transform group-hover:-rotate-6 group-hover:scale-105">
                <Search className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-14 max-w-sm">
              <h2 className="font-serif text-4xl font-black tracking-tight sm:text-5xl">Brand Directory</h2>
              <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                Browse size ranges, measurement charts, practical fit notes, and sizing reviews before you shop.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-8 flex items-end justify-end border-t border-[#9E5A44]/15 pt-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#9E5A44] px-4 py-2.5 text-[10px] font-display font-bold uppercase tracking-wider text-white transition-transform group-hover:translate-x-1">
              Explore Brands
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </InternalLink>
      </div>

    </div>
  );
}
