import React, { useState } from "react";
import { ArrowLeft, Star, Heart, Check, HelpCircle, MessageSquare, Plus, Calendar, Ruler, Info, Shirt, Scale, Compass, ExternalLink } from "lucide-react";
import { Brand, Comment, GarmentType } from "../types";
import BrandLogo from "./BrandLogo";
import type { ReviewSubmission } from "../community";
import { getExternalReviewsForBrand } from "../externalReviews";

interface BrandDetailViewProps {
  brand: Brand;
  comments: Comment[];
  onBack: () => void;
  onAddComment: (comment: ReviewSubmission) => Promise<void>;
  communityEnabled: boolean;
  reviewsLoading: boolean;
  communityError: string | null;
}

export default function BrandDetailView({
  brand,
  comments,
  onBack,
  onAddComment,
  communityEnabled,
  reviewsLoading,
  communityError,
}: BrandDetailViewProps) {
  // Form states
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [fitsRatio, setFitsRatio] = useState<"runsSmall" | "trueToSize" | "runsLarge">("trueToSize");
  const [userSize, setUserSize] = useState("");
  const [selectedFormGarment, setSelectedFormGarment] = useState<GarmentType>("tops_dresses");

  const [formOpen, setFormOpen] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [website, setWebsite] = useState("");

  // Active chart category tab
  const [activeChartTab, setActiveChartTab] = useState<GarmentType>("tops_dresses");

  const handleBackLink = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    onBack();
  };

  // Filter comments for this brand
  const brandComments = comments.filter((c) => c.brandId === brand.id);
  const externalReviews = getExternalReviewsForBrand(brand.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!communityEnabled || !author.trim() || text.trim().length < 40 || website) return;

    setSubmitting(true);
    setFormError(null);
    try {
      await onAddComment({
        brandId: brand.id,
        author,
        text,
        rating,
        fitsRatio,
        userSize: userSize || undefined,
        garmentType: selectedFormGarment,
      });

      setAuthor("");
      setText("");
      setRating(5);
      setFitsRatio("trueToSize");
      setUserSize("");
      setFormSuccess(true);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to submit your review.");
    } finally {
      setSubmitting(false);
    }
  };

  // Extract the active size chart based on the selected clothing tab
  const activeSizingChart = (brand.sizeChart[activeChartTab] || brand.sizeChart.default || {}) as any;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Back button */}
      <a
        href="/brand-directory"
        onClick={handleBackLink}
        className="inline-flex items-center space-x-2 text-xs font-display font-bold uppercase tracking-wider text-[#9E5A44] hover:underline cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Directory Leaderboard</span>
      </a>

      {/* Hero Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-950 text-white min-h-[220px] flex items-end p-6 sm:p-10 border border-[#E7E2D8]">
        {/* Background photo */}
        <div className="absolute inset-0 z-0">
          <img
            src={brand.coverImage || brand.logo}
            alt={brand.name}
            className="w-full h-full object-cover opacity-30 filter blur-xs"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>

        <div className="relative z-10 space-y-4 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <BrandLogo
              name={brand.name}
              logoUrl={brand.logo}
              siteUrl={brand.siteUrl}
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white p-2 border border-[#E7E2D8] shadow-md shrink-0"
            />
            <div className="space-y-1.5">
              <span className="font-display text-[10px] uppercase tracking-widest text-[#DFB7B0] font-bold block">
                Editorial Brand Bio
              </span>
              <div className="flex items-center space-x-3 flex-wrap">
                <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight flex items-center">
                  <span>{brand.name}</span>
                  {brand.isCustom && (
                    <span className="text-xs uppercase font-mono px-2 py-0.5 bg-[#9E5A44] text-[#FAF7F2] rounded ml-3">Custom</span>
                  )}
                </h1>
                {brand.ratingCount > 0 && (
                  <div className="flex items-center space-x-1.5 bg-[#9E5A44] px-3 py-1 rounded-full text-xs font-bold text-[#FAF7F2]">
                    <Star className="h-3 w-3 fill-current" />
                    <span>{brand.rating} from {brand.ratingCount} public reviews</span>
                  </div>
                )}
              </div>
              <p className="font-sans text-neutral-300 text-sm leading-relaxed max-w-2xl">
                {brand.description}
              </p>
              <a
                href={brand.siteUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3.5 py-2 text-[10px] font-display font-bold uppercase tracking-wider text-white transition-colors hover:border-white/60 hover:bg-white/20"
              >
                Visit {brand.name} Website
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Breakdown Layout */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Left Column: Brand fit profile & exact charts */}
        <div className="space-y-6 lg:contents">
          {/* Fit Assessment Card */}
          <div className="bg-[#FDFBF7] border border-[#E7E2D8] rounded-2xl p-6 space-y-5 lg:order-1 lg:col-span-5">
            <h3 className="font-serif font-bold text-lg text-[#1C1917] border-b border-[#E7E2D8] pb-3">
              Editorial Fit Assessment
            </h3>

            {/* Fit notes details */}
            <div className="space-y-4">
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E7E2D8]/80 text-xs text-neutral-700 space-y-1.5">
                <p className="font-serif font-black text-[#9E5A44] flex items-center space-x-1">
                  <Info className="h-4 w-4" />
                  <span>Editorial Fit Note:</span>
                </p>
                <p className="leading-relaxed italic">{brand.fitNotes}</p>
                <p className="text-[10px] text-neutral-400 not-italic">
                  Curated guidance, not a customer review. Check the retailer's current product chart before ordering.
                </p>
              </div>

              {/* General characteristics list */}
              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-neutral-700 uppercase tracking-wider text-[10px] mb-1">
                    <span>Chest/Bust Room</span>
                    <span className="text-[#9E5A44]">Extremely Generous</span>
                  </div>
                  <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#9E5A44] h-full rounded-full" style={{ width: "90%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-neutral-700 uppercase tracking-wider text-[10px] mb-1">
                    <span>Stretch & Fabric Give</span>
                    <span className="text-[#9E5A44]">Moderate-to-High</span>
                  </div>
                  <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#9E5A44] h-full rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-neutral-700 uppercase tracking-wider text-[10px] mb-1">
                    <span>Thigh & Hip Room</span>
                    <span className="text-[#9E5A44]">Perfect Pear Shaping</span>
                  </div>
                  <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#9E5A44] h-full rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sizing Chart Sheet with clothing category switcher */}
          <div className="bg-[#FDFBF7] border border-[#E7E2D8] rounded-2xl p-6 space-y-4 lg:order-3 lg:col-span-12">
            <div className="border-b border-[#E7E2D8] pb-3 space-y-2">
              <h3 className="font-serif font-bold text-lg text-[#1C1917]">
                Official Size Parameters
              </h3>
              
              {/* Internal horizontal tab bar inside detail view */}
              <div className="flex flex-wrap gap-1 bg-[#FAF7F2] p-1 rounded-lg border border-[#E7E2D8]">
                {[
                  { id: "tops_dresses", label: "Tops" },
                  { id: "pants_bottoms", label: "Pants" },
                  { id: "swimwear", label: "Swim" },
                  { id: "intimates_lingerie", label: "Lingerie" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveChartTab(tab.id as GarmentType)}
                    className={`flex-1 text-[10px] font-display font-bold uppercase tracking-wider py-1 rounded cursor-pointer transition-colors ${
                      activeChartTab === tab.id
                        ? "bg-[#9E5A44] text-white"
                        : "text-neutral-500 hover:text-[#9E5A44]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#E7E2D8] bg-white">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#FAF7F2] font-display uppercase tracking-wider text-[9px] text-neutral-500 border-b border-[#E7E2D8]">
                  <tr>
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Bust Size Range</th>
                    <th className="py-2.5 px-3">Waist Size Range</th>
                    <th className="py-2.5 px-3">Hips Size Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E2D8] text-neutral-600">
                  {Object.keys(activeSizingChart).length > 0 ? (
                    Object.entries(activeSizingChart as Record<string, any>).map(([sz, r]) => {
                      const renderTape = (min: number, max: number, type: "bust" | "waist" | "hips") => {
                        const globalMin = 20;
                        const globalMax = 80;
                        const total = globalMax - globalMin;
                        const leftPercent = Math.max(0, Math.min(100, ((min - globalMin) / total) * 100));
                        const widthPercent = Math.max(4, Math.min(100, ((max - min) / total) * 100));
                        const barColors = {
                          bust: "bg-[#9E5A44]",
                          waist: "bg-[#D28268]",
                          hips: "bg-[#C17A63]",
                        };
                        return (
                          <div className="flex items-center space-x-3 py-1">
                            <span className="font-mono text-xs font-bold text-[#1C1917] w-12 shrink-0">{min}-{max}"</span>
                            <div className="relative w-28 h-4 bg-[#FAF7F2] border border-[#E7E2D8] rounded-sm overflow-hidden select-none flex items-center shrink-0">
                              <div className="absolute inset-0 flex justify-between px-1 opacity-20 pointer-events-none">
                                {[...Array(10)].map((_, i) => (
                                  <div key={i} className={`w-[1px] bg-neutral-950 ${i % 3 === 0 ? "h-2.5" : "h-1.5"}`} />
                                ))}
                              </div>
                              <div
                                className={`absolute h-2.5 rounded-xs opacity-80 ${barColors[type]}`}
                                style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                              />
                            </div>
                          </div>
                        );
                      };

                      return (
                        <tr key={sz} className="hover:bg-[#FAF7F2]/40 transition-colors">
                          <td className="py-2 px-3 font-bold text-[#9E5A44] font-display">{sz}</td>
                          <td className="py-2 px-3">{renderTape(r.bust[0], r.bust[1], "bust")}</td>
                          <td className="py-2 px-3">{renderTape(r.waist[0], r.waist[1], "waist")}</td>
                          <td className="py-2 px-3">{renderTape(r.hips[0], r.hips[1], "hips")}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-neutral-400 font-sans italic">
                        No sizing spec recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Reviews / Community Guide */}
        <div className="space-y-6 lg:order-2 lg:col-span-7">
          <div className="bg-[#FDFBF7] border border-[#E7E2D8] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col gap-3 border-b border-[#E7E2D8] pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-[#9E5A44]" />
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#1C1917]">
                    Sizing Reviews
                  </h3>
                  <p className="mt-0.5 text-[10px] font-mono text-neutral-400">
                    {externalReviews.length + brandComments.length} review{externalReviews.length + brandComments.length === 1 ? "" : "s"} available · External sources are labeled
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFormOpen((current) => {
                    if (!current) {
                      setFormSuccess(false);
                      setFormError(null);
                    }
                    return !current;
                  });
                }}
                disabled={!communityEnabled}
                aria-expanded={formOpen}
                aria-controls="community-review-form"
                className="flex w-full items-center justify-center space-x-1.5 rounded-full bg-[#9E5A44] px-4 py-2 text-xs font-display font-bold uppercase tracking-wider text-white shadow-sm transition-luxury hover:bg-[#854B38] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                <Plus className={`h-3.5 w-3.5 transition-transform ${formOpen ? "rotate-45" : ""}`} />
                <span>{formOpen ? "Close Form" : "Write Sizing Note"}</span>
              </button>
            </div>

            {!communityEnabled && (
              <div className="rounded-xl border border-[#E7E2D8] bg-[#FAF7F2] px-4 py-3 text-xs text-neutral-500">
                Public community reviews are opening soon. Sourced external perspectives remain available in the meantime.
              </div>
            )}

            {communityError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                Community data is temporarily unavailable. Please try again later.
              </div>
            )}

            {/* Write a comment form */}
            {formOpen && (
              <div id="community-review-form" className="bg-white rounded-xl border border-[#DFB7B0] p-5 space-y-4 shadow-sm animate-fadeIn">
                <div className="flex justify-between items-center pb-2 border-b border-[#E7E2D8]">
                  <h4 className="font-serif font-bold text-[#9E5A44] text-sm">Post a New Sizing Review</h4>
                  <button
                    onClick={() => setFormOpen(false)}
                    className="text-neutral-400 hover:text-neutral-600 text-xs cursor-pointer font-bold uppercase"
                  >
                    {formSuccess ? "Close" : "Cancel"}
                  </button>
                </div>

                {formSuccess ? (
                  <div className="bg-[#EEDCD2]/60 border border-[#DFB7B0] rounded-xl p-6 text-center space-y-2">
                    <Heart className="h-8 w-8 text-[#9E5A44] mx-auto fill-current animate-bounce" />
                    <h5 className="font-serif font-bold text-lg text-neutral-800">Review Received!</h5>
                    <p className="text-xs text-neutral-500">It will appear publicly after a quick moderation review.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {/* Author */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-neutral-500">
                          My Display Name
                        </label>
                        <input
                          type="text"
                          required
                          minLength={2}
                          maxLength={50}
                          placeholder="e.g., Jennifer K."
                          value={author}
                          onChange={(e) => setAuthor(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-[#E7E2D8] bg-white placeholder-neutral-400 focus:border-[#9E5A44] focus:ring-1 focus:ring-[#9E5A44]"
                        />
                      </div>

                      {/* Usual size */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-neutral-500">
                          My Usual Size in This Brand
                        </label>
                        <input
                          type="text"
                          maxLength={80}
                          placeholder="e.g., Size 2 (US 18-20)"
                          value={userSize}
                          onChange={(e) => setUserSize(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-[#E7E2D8] bg-white placeholder-neutral-400 focus:border-[#9E5A44] focus:ring-1 focus:ring-[#9E5A44]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      {/* Stars Rating */}
                      <div className="space-y-1 sm:col-span-1">
                        <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-neutral-500">
                          Overall Satisfaction
                        </label>
                        <div className="flex items-center space-x-1.5 pt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="p-1 hover:scale-110 transition-transform cursor-pointer"
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  star <= rating ? "text-[#9E5A44] fill-current" : "text-neutral-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sizing accuracy ratio */}
                      <div className="space-y-1 sm:col-span-1">
                        <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-neutral-500">
                          Pattern Sizing Accuracy
                        </label>
                        <select
                          value={fitsRatio}
                          onChange={(e) => setFitsRatio(e.target.value as any)}
                          className="w-full rounded-lg border border-[#E7E2D8] bg-white px-2 py-1.5 text-xs font-semibold text-neutral-700 focus:border-[#9E5A44]"
                        >
                          <option value="runsSmall">Runs Small (Size Up)</option>
                          <option value="trueToSize">True to Size (Perfect)</option>
                          <option value="runsLarge">Runs Large (Size Down)</option>
                        </select>
                      </div>

                      {/* Form Garment type selection */}
                      <div className="space-y-1 sm:col-span-1">
                        <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-neutral-500">
                          Garment Type Reviewed
                        </label>
                        <select
                          value={selectedFormGarment}
                          onChange={(e) => setSelectedFormGarment(e.target.value as GarmentType)}
                          className="w-full rounded-lg border border-[#E7E2D8] bg-white px-2 py-1.5 text-xs font-semibold text-neutral-700 focus:border-[#9E5A44]"
                        >
                          <option value="tops_dresses">Tops & Dresses</option>
                          <option value="pants_bottoms">Pants & Denim</option>
                          <option value="swimwear">Swimwear</option>
                          <option value="intimates_lingerie">Lingerie & Bras</option>
                        </select>
                      </div>
                    </div>

                    {/* Review text */}
                    <div className="space-y-1 text-xs">
                      <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-neutral-500">
                        My Fitting Diary & Sizing Comments
                      </label>
                      <textarea
                        required
                        minLength={40}
                        maxLength={1000}
                        rows={3}
                        placeholder="Share your bust, waist, and hip parameters, and how the garment fits around curves..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E7E2D8] bg-white placeholder-neutral-400 focus:border-[#9E5A44] focus:ring-1 focus:ring-[#9E5A44]"
                      />
                      <p className="text-[10px] text-neutral-400">
                        Approved reviews are public. Please do not include contact details or other sensitive information.
                      </p>
                    </div>

                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="review-website">Website</label>
                      <input
                        id="review-website"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={website}
                        onChange={(event) => setWebsite(event.target.value)}
                      />
                    </div>

                    {formError && (
                      <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                        {formError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting || !communityEnabled}
                      className="w-full rounded-lg bg-[#9E5A44] hover:bg-[#854B38] text-white py-2.5 text-xs font-display font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Submitting..." : "Submit for Review"}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Sourced and first-party reviews share one list; provenance stays visible on each card. */}
            <div className="space-y-4">
              {externalReviews.map((review) => {
                const signalLabel =
                  review.fitSignal === "runsSmall"
                    ? "Often reported smaller"
                    : review.fitSignal === "runsLarge"
                      ? "Often reported generous"
                      : review.fitSignal === "trueToSize"
                        ? "Often reported true to size"
                        : "Mixed fit reports";
                const signalStyle =
                  review.fitSignal === "runsSmall"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : review.fitSignal === "runsLarge"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : review.fitSignal === "trueToSize"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-neutral-50 text-neutral-600 border-neutral-200";

                return (
                  <article key={review.id} className="space-y-3 rounded-xl border border-[#E7E2D8]/80 bg-[#FAF7F2]/60 p-5 transition-colors hover:bg-[#FAF7F2]">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-serif text-sm font-bold text-[#1C1917]">{review.topic}</p>
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[8px] font-display font-bold uppercase tracking-wider text-emerald-700">
                            External User Review
                          </span>
                        </div>
                        <p className="mt-1 text-[9px] font-mono text-neutral-400">
                          {review.sourceName} · {review.sourceCommunity} · {review.sourceDate}
                        </p>
                      </div>
                      <span className={`rounded-full border px-2.5 py-1 text-[9px] font-display font-bold uppercase tracking-wider ${signalStyle}`}>
                        {signalLabel}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-neutral-600">{review.summary}</p>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-[#E7E2D8] pt-2">
                      <span className="text-[9px] font-mono text-neutral-400">Paraphrased from the linked public discussion</span>
                      <a
                        href={review.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="inline-flex items-center gap-1 text-[10px] font-display font-bold uppercase tracking-wider text-[#9E5A44] hover:underline"
                      >
                        Read original discussion
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </article>
                );
              })}

              {reviewsLoading ? (
                <div className="text-center py-10 text-neutral-400 italic text-xs">
                  Loading public reviews...
                </div>
              ) : brandComments.length > 0 ? (
                brandComments.map((comment) => {
                  let ratioLabel = "Fits Perfect";
                  let ratioColor = "bg-[#EEDCD2] text-[#9E5A44]";
                  if (comment.fitsRatio === "runsSmall") {
                    ratioLabel = "Runs Small (Size Up)";
                    ratioColor = "bg-red-50 text-red-600 border border-red-200";
                  } else if (comment.fitsRatio === "runsLarge") {
                    ratioLabel = "Runs Large (Size Down)";
                    ratioColor = "bg-amber-50 text-amber-600 border border-amber-200";
                  }

                  return (
                    <div
                      key={comment.id}
                      className="bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] border border-[#E7E2D8]/80 rounded-xl p-5 space-y-3 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        {/* Author info */}
                        <div className="flex items-center space-x-3">
                          {comment.avatar ? (
                            <img
                              src={comment.avatar}
                              alt={comment.author}
                              className="h-9 w-9 rounded-full object-cover border border-[#DFB7B0]"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full border border-[#DFB7B0] bg-[#EEDCD2] text-[#9E5A44] flex items-center justify-center font-serif font-black text-sm">
                              {comment.author.trim().charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-black text-xs text-[#1C1917]">
                                {comment.author}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 mt-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-3 w-3 ${
                                    star <= comment.rating
                                      ? "text-[#9E5A44] fill-current"
                                      : "text-neutral-300"
                                  }`}
                                />
                              ))}
                              {comment.userSize && (
                                <span className="text-[10px] text-neutral-400 font-mono pl-1.5">
                                  Ordered: {comment.userSize}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Fitting tag */}
                        <div className="flex items-center space-x-2 shrink-0">
                          {comment.garmentType && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-100 text-neutral-600">
                              {comment.garmentType.replace("_", " ")}
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-display uppercase tracking-wider ${ratioColor}`}>
                            {ratioLabel}
                          </span>
                        </div>
                      </div>

                      {/* Text */}
                      <p className="text-xs text-neutral-600 leading-relaxed font-sans italic">
                        "{comment.text}"
                      </p>

                      {/* Bottom action row */}
                      <div className="flex items-center justify-end text-right pt-2 border-t border-dashed border-[#E7E2D8]/50">
                        <p className="text-[9px] text-neutral-400 font-mono">
                          Published on {comment.timestamp}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : externalReviews.length === 0 ? (
                <div className="text-center py-10 text-neutral-400 italic text-xs">
                  No sizing reviews have been published for {brand.name} yet. Be the first to share your fit experience.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
