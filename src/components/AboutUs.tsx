import React from "react";
import { ArrowLeft, BookOpen, ExternalLink, Heart, MessageSquare, Ruler, ShieldCheck } from "lucide-react";
import InternalLink from "./InternalLink";

interface AboutUsProps {
  onNavigate: (path: string) => void;
}

export default function AboutUs({ onNavigate }: AboutUsProps) {
  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-fadeIn">
      <InternalLink
        href="/"
        onNavigate={onNavigate}
        className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-[#9E5A44] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </InternalLink>

      <section className="overflow-hidden rounded-3xl border border-[#E7E2D8] bg-[#1C1917] px-6 py-12 text-[#FAF7F2] sm:px-12 sm:py-16">
        <div className="max-w-3xl space-y-5">
          <p className="text-[10px] font-display font-bold uppercase tracking-[0.28em] text-[#DFB7B0]">
            About Curvy&
          </p>
          <h1 className="font-serif text-4xl font-black leading-tight sm:text-6xl">
            Better sizing information for every curve.
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-300 sm:text-base">
            Curvy& helps plus-size shoppers compare brand sizing, understand garment measurements, and learn from real fit experiences before placing an order.
          </p>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {[
          {
            icon: Ruler,
            title: "Compare with confidence",
            text: "Translate measurements and known brand sizes into a clearer starting point for your next purchase.",
          },
          {
            icon: BookOpen,
            title: "Understand the fit",
            text: "Review size charts and concise editorial guidance without digging through dozens of product pages.",
          },
          {
            icon: MessageSquare,
            title: "Learn from shoppers",
            text: "See moderated Curvy& submissions alongside clearly labeled summaries of public external discussions.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-2xl border border-[#E7E2D8] bg-[#FDFBF7] p-6">
            <Icon className="h-5 w-5 text-[#9E5A44]" />
            <h2 className="mt-4 font-serif text-lg font-bold text-[#1C1917]">{title}</h2>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500">{text}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-8 rounded-3xl border border-[#E7E2D8] bg-[#FDFBF7] p-6 sm:p-10 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="text-[10px] font-display font-bold uppercase tracking-[0.22em] text-[#9E5A44]">
            How our information works
          </p>
          <h2 className="font-serif text-3xl font-black text-[#1C1917]">Clarity before certainty.</h2>
          <p className="text-sm leading-relaxed text-neutral-600">
            Fit is personal. Fabric, cut, garment category, and body shape can all change how the same labeled size feels. Curvy& is designed as a practical guide—not a guarantee of fit.
          </p>
          <p className="text-sm leading-relaxed text-neutral-600">
            Brand charts and editorial notes provide a starting point. We always recommend confirming the retailer's current product measurements before purchasing.
          </p>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-[#E7E2D8] bg-white p-4">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#9E5A44]" />
              <div>
                <h3 className="font-serif text-sm font-bold text-[#1C1917]">Transparent sourcing</h3>
                <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                  External experiences are paraphrased, labeled, and linked to their original public discussions. They are never presented as Curvy& customer submissions.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[#E7E2D8] bg-white p-4">
            <div className="flex gap-3">
              <Heart className="mt-0.5 h-5 w-5 shrink-0 text-[#9E5A44]" />
              <div>
                <h3 className="font-serif text-sm font-bold text-[#1C1917]">Moderated community</h3>
                <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                  Reviews submitted on Curvy& are checked before publication. We aim to keep contributions useful, respectful, and focused on sizing and fit.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[#E7E2D8] bg-white p-4">
            <div className="flex gap-3">
              <ExternalLink className="mt-0.5 h-5 w-5 shrink-0 text-[#9E5A44]" />
              <div>
                <h3 className="font-serif text-sm font-bold text-[#1C1917]">Independent shopping tool</h3>
                <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                  Curvy& is an independent sizing resource. Brand names and trademarks belong to their respective owners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-start justify-between gap-5 rounded-3xl border border-[#DFB7B0] bg-[#EEDCD2]/40 p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <h2 className="font-serif text-2xl font-black text-[#1C1917]">Find a better starting size.</h2>
          <p className="mt-1 text-xs text-neutral-500">Use your measurements or explore the brand directory.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <InternalLink
            href="/size-converter"
            onNavigate={onNavigate}
            className="rounded-full bg-[#9E5A44] px-4 py-2.5 text-xs font-display font-bold uppercase tracking-wider text-white hover:bg-[#854B38]"
          >
            Size Converter
          </InternalLink>
          <InternalLink
            href="/brand-directory"
            onNavigate={onNavigate}
            className="rounded-full border border-[#9E5A44] px-4 py-2.5 text-xs font-display font-bold uppercase tracking-wider text-[#9E5A44] hover:bg-white"
          >
            Brand Directory
          </InternalLink>
        </div>
      </section>
    </div>
  );
}
