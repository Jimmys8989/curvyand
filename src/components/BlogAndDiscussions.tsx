import React from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import { BLOG_POSTS } from "../blog";
import InternalLink from "./InternalLink";

interface BlogAndDiscussionsProps {
  onNavigate: (path: string) => void;
}

export default function BlogAndDiscussions({ onNavigate }: BlogAndDiscussionsProps) {
  const featured = BLOG_POSTS.find((post) => post.featured) ?? BLOG_POSTS[0];
  const supporting = BLOG_POSTS.filter((post) => post.slug !== featured.slug);

  return (
    <div className="mx-auto max-w-6xl space-y-12 animate-fadeIn">
      <header className="grid gap-6 border-b border-[#E7E2D8] pb-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <p className="text-[10px] font-display font-bold uppercase tracking-[0.25em] text-[#9E5A44]">
            Articles & Guides
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-black leading-tight text-[#1C1917] sm:text-6xl">
            Curvy& Journal
          </h1>
        </div>
        <p className="text-sm leading-relaxed text-neutral-500 md:col-span-4">
          Original articles about plus-size sizing, fit, and more confident online shopping—written and edited by Curvy&.
        </p>
      </header>

      <section className="space-y-5">
        <InternalLink
          href={`/blog/${featured.slug}`}
          onNavigate={onNavigate}
          className="group relative flex min-h-[390px] flex-col justify-between overflow-hidden rounded-[2rem] bg-[#1C1917] p-7 text-[#FAF7F2] sm:p-10"
        >
          <div aria-hidden="true" className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
          <div aria-hidden="true" className="absolute -right-10 -top-10 h-48 w-48 rounded-full border border-[#DFB7B0]/30" />
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[10px] font-display font-bold uppercase tracking-[0.22em] text-[#DFB7B0]">
              Featured · {featured.eyebrow}
            </span>
            <BookOpen className="h-5 w-5 text-[#DFB7B0]" />
          </div>
          <div className="relative z-10 max-w-xl">
            <h2 className="font-serif text-4xl font-black leading-tight sm:text-5xl">{featured.title}</h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-neutral-300">{featured.summary}</p>
          </div>
          <div className="relative z-10 mt-8 flex items-center justify-between border-t border-white/10 pt-5 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
            <span>{featured.readTime}</span>
            <span className="inline-flex items-center gap-1.5 font-display font-bold text-white">
              Read article <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </InternalLink>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {supporting.map((post, index) => (
            <InternalLink
              key={post.slug}
              href={`/blog/${post.slug}`}
              onNavigate={onNavigate}
              className={`group flex flex-col justify-between rounded-[2rem] border p-6 transition-transform hover:-translate-y-0.5 ${
                index === 0
                  ? "border-[#D8B5A5] bg-[#EEDCD2]"
                  : "border-[#E7E2D8] bg-[#FDFBF7]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[9px] font-display font-bold uppercase tracking-[0.2em] text-[#9E5A44]">
                  <span>{post.eyebrow}</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="mt-7 font-serif text-2xl font-black leading-tight text-[#1C1917]">{post.title}</h2>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600">{post.summary}</p>
              </div>
              <ArrowRight className="mt-5 h-4 w-4 self-end text-[#9E5A44] transition-transform group-hover:translate-x-1" />
            </InternalLink>
          ))}
        </div>
      </section>
    </div>
  );
}
