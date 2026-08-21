import React from "react";
import { ArrowLeft, ArrowUpRight, Clock, MapPin } from "lucide-react";
import type { BlogPost } from "../blog";
import InternalLink from "./InternalLink";

interface BlogPostViewProps {
  post: BlogPost;
  onNavigate: (path: string) => void;
}

const STORE_STATUS_STYLES = {
  stores: "border-[#A8D7C2] bg-[#ECF8F1] text-[#177A5C]",
  limited: "border-[#E3C39F] bg-[#FFF6E9] text-[#9A5D24]",
  "online-only": "border-[#D9D6D0] bg-[#F4F2EE] text-neutral-500",
} as const;

export default function BlogPostView({ post, onNavigate }: BlogPostViewProps) {
  return (
    <article className="mx-auto max-w-4xl animate-fadeIn">
      <InternalLink
        href="/blog"
        onNavigate={onNavigate}
        className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-[#9E5A44] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Journal
      </InternalLink>

      <header className="mt-8 border-b border-[#E7E2D8] pb-10 text-center">
        <p className="text-[10px] font-display font-bold uppercase tracking-[0.24em] text-[#9E5A44]">{post.eyebrow}</p>
        <h1 className="mx-auto mt-4 max-w-3xl font-serif text-4xl font-black leading-tight text-[#1C1917] sm:text-6xl">{post.title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-neutral-500">{post.summary}</p>
        <div className="mt-5 flex items-center justify-center gap-3 text-[10px] font-mono text-neutral-400">
          <span>{post.author}</span>
          <span aria-hidden="true">·</span>
          <span>{post.publishedAt}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
        </div>
      </header>

      <div className="space-y-10 py-10">
        {post.sections.map((section) => (
          <section
            key={section.heading}
            className={`space-y-4 ${section.regions ? "" : "mx-auto max-w-2xl"}`}
          >
            <h2 className="font-serif text-2xl font-black text-[#1C1917]">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-7 text-neutral-600">{paragraph}</p>
            ))}
            {section.bullets && (
              <ul className="space-y-3 border-l-2 border-[#DFB7B0] pl-5">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="text-sm leading-6 text-neutral-600">{bullet}</li>
                ))}
              </ul>
            )}
            {section.ranking && (
              <div className="space-y-3 pt-2">
                {section.ranking.map((entry) => (
                  <div key={entry.rank} className="rounded-2xl border border-[#E7E2D8] bg-[#FDFBF7] p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#9E5A44] font-serif text-lg font-black text-white">
                          {entry.rank}
                        </span>
                        <div>
                          <InternalLink
                            href={`/brand-directory/${entry.brandSlug}`}
                            onNavigate={onNavigate}
                            className="font-serif text-xl font-black text-[#1C1917] hover:text-[#9E5A44]"
                          >
                            {entry.brand}
                          </InternalLink>
                          <p className="mt-0.5 text-[8px] font-display font-bold uppercase tracking-[0.16em] text-neutral-400">
                            {entry.confidence} predictability
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-[#F5EAE4] px-3 py-1 font-mono text-xs font-bold text-[#9E5A44]">
                        {entry.score}/10
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-neutral-600">{entry.verdict}</p>
                    <p className="mt-3 border-t border-dashed border-[#E7E2D8] pt-3 text-xs leading-5 text-neutral-500">
                      <span className="font-display font-bold uppercase tracking-wider text-[#9E5A44]">Watch for: </span>
                      {entry.watchFor}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {section.regions && (
              <div className="space-y-5 pt-3">
                <div
                  className="flex flex-wrap gap-2 rounded-2xl border border-[#E7E2D8] bg-[#FDFBF7] p-3"
                  aria-label="Physical store status legend"
                >
                  <span className="rounded-full border border-[#A8D7C2] bg-[#ECF8F1] px-3 py-1 text-[9px] font-display font-bold uppercase tracking-[0.12em] text-[#177A5C]">
                    In-store
                  </span>
                  <span className="rounded-full border border-[#E3C39F] bg-[#FFF6E9] px-3 py-1 text-[9px] font-display font-bold uppercase tracking-[0.12em] text-[#9A5D24]">
                    Selected locations
                  </span>
                  <span className="rounded-full border border-[#D9D6D0] bg-[#F4F2EE] px-3 py-1 text-[9px] font-display font-bold uppercase tracking-[0.12em] text-neutral-500">
                    Online only
                  </span>
                </div>
                {section.regions.map((region) => (
                  <section
                    key={region.code}
                    className="overflow-hidden rounded-[2rem] border border-[#E3D9CD] bg-[#FDFBF7]"
                  >
                    <div className="grid gap-4 border-b border-[#E7E2D8] bg-[#F5EAE4] p-6 sm:grid-cols-[auto_1fr] sm:items-start sm:p-8">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#9E5A44] font-serif text-lg font-black text-white">
                        {region.code}
                      </span>
                      <div>
                        <h3 className="font-serif text-3xl font-black text-[#1C1917]">{region.name}</h3>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">{region.intro}</p>
                      </div>
                    </div>

                    <div className="grid gap-px bg-[#E7E2D8] sm:grid-cols-2">
                      {region.brands.map((brand) => (
                        <div
                          key={brand.name}
                          className="flex min-h-[21rem] flex-col bg-[#FDFBF7] p-6 transition-colors hover:bg-white sm:p-7"
                        >
                          <a
                            href={brand.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/brand flex items-start justify-between gap-3"
                          >
                            <h4 className="font-serif text-2xl font-black text-[#1C1917] transition-colors group-hover/brand:text-[#9E5A44]">
                              {brand.name}
                            </h4>
                            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[#9E5A44] transition-transform group-hover/brand:-translate-y-0.5 group-hover/brand:translate-x-0.5" />
                          </a>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="w-fit rounded-full border border-[#D8B5A5] bg-[#FAF7F2] px-3 py-1 text-[9px] font-display font-bold uppercase tracking-[0.14em] text-[#9E5A44]">
                              {brand.sizeRange}
                            </span>
                            {brand.storeUrl ? (
                              <a
                                href={brand.storeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[9px] font-display font-bold uppercase tracking-[0.12em] transition-opacity hover:opacity-75 ${STORE_STATUS_STYLES[brand.storeStatus]}`}
                                aria-label={`${brand.storeLabel} — open official store information for ${brand.name}`}
                              >
                                <MapPin className="h-3 w-3" />
                                {brand.storeLabel}
                                <ArrowUpRight className="h-2.5 w-2.5" />
                              </a>
                            ) : (
                              <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[9px] font-display font-bold uppercase tracking-[0.12em] ${STORE_STATUS_STYLES[brand.storeStatus]}`}>
                                <MapPin className="h-3 w-3" />
                                {brand.storeLabel}
                              </span>
                            )}
                          </div>
                          <p className="mt-5 text-[9px] font-display font-bold uppercase tracking-[0.16em] text-neutral-400">
                            Best for
                          </p>
                          <p className="mt-1 text-xs font-semibold leading-5 text-[#1C1917]">{brand.bestFor}</p>
                          <p className="mt-3 text-xs leading-5 text-neutral-600">{brand.note}</p>
                          <p className="mt-auto border-t border-dashed border-[#E7E2D8] pt-4 text-[11px] leading-5 text-neutral-500">
                            <span className="font-display font-bold uppercase tracking-[0.12em] text-neutral-400">Store note: </span>
                            {brand.storeNote}
                          </p>
                        </div>
                      ))}
                    </div>

                    <p className="border-t border-[#E7E2D8] px-6 py-4 text-xs leading-5 text-neutral-500 sm:px-8">
                      <span className="font-display font-bold uppercase tracking-wider text-[#9E5A44]">Local note: </span>
                      {region.shoppingNote}
                    </p>
                  </section>
                ))}
              </div>
            )}
          </section>
        ))}

        {post.researchNote && post.researchSources && (
          <aside className="mx-auto max-w-2xl rounded-2xl border border-[#D8B5A5] bg-[#F5EAE4] p-6">
            <p className="text-[9px] font-display font-bold uppercase tracking-[0.2em] text-[#9E5A44]">
              {post.researchLabel ?? "Community Research"}
            </p>
            <p className="mt-3 text-xs leading-6 text-neutral-600">{post.researchNote}</p>
            <ul className="mt-4 space-y-2 border-t border-[#D8B5A5]/60 pt-4">
              {post.researchSources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-1.5 text-xs leading-5 text-[#9E5A44] hover:underline"
                  >
                    <span>{source.label}</span>
                    <ArrowUpRight className="mt-0.5 h-3 w-3 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <aside className="mx-auto max-w-2xl rounded-2xl border border-[#E7E2D8] bg-[#FDFBF7] p-5 text-xs leading-relaxed text-neutral-500">
          Curvy& provides general sizing guidance, not a guarantee of fit. Always compare your current measurements with the retailer's latest product chart and return policy.
        </aside>
      </div>
    </article>
  );
}
