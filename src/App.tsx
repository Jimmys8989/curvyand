import React, { useState, useEffect, useMemo } from "react";
import Header from "./components/Header";
import BrandConverter from "./components/BrandConverter";
import DatabaseLeaderboard from "./components/DatabaseLeaderboard";
import BrandDetailView from "./components/BrandDetailView";
import Homepage from "./components/Homepage";
import SEO from "./components/SEO";
import TermsAndPrivacy from "./components/TermsAndPrivacy";
import AboutUs from "./components/AboutUs";
import InternalLink from "./components/InternalLink";
import { Brand, Comment, MeasurementProfile } from "./types";
import { BRANDS } from "./data";
import { getSeoForPath, parseComparisonPath } from "./seo";
import {
  fetchPublishedCommunityBrands,
  fetchPublishedReviews,
  fetchVoteTotals,
  isCommunityBackendConfigured,
  submitBrandVote,
  submitBrandForModeration,
  submitReviewForModeration,
  type BrandSubmission,
  type ReviewSubmission,
  type VoteTotals,
} from "./community";

export default function App() {
  // Dynamic path routing state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const p = window.location.pathname;
    if (p === "/index.html" || !p) return "/";
    return p;
  });

  // Synchronize state with actual browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      setCurrentPath(p === "/index.html" || !p ? "/" : p);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Profile state with LocalStorage persistence
  const [profile, setProfile] = useState<MeasurementProfile | null>(() => {
    const saved = localStorage.getItem("curvy_profile");
    return saved ? JSON.parse(saved) : null;
  });

  // The visitor selection stays local, while public totals live in Supabase.
  const [userVotes, setUserVotes] = useState<Record<string, "up" | "down">>(() => {
    const saved = localStorage.getItem("curvy_user_votes_v3");
    return saved ? JSON.parse(saved) : {};
  });

  const [comments, setComments] = useState<Comment[]>([]);
  const [communityBrands, setCommunityBrands] = useState<Brand[]>([]);
  const [voteTotals, setVoteTotals] = useState<Record<string, VoteTotals>>({});
  const [reviewsLoading, setReviewsLoading] = useState(isCommunityBackendConfigured);
  const [communityError, setCommunityError] = useState<string | null>(null);

  useEffect(() => {
    if (!isCommunityBackendConfigured) return;

    let cancelled = false;
    Promise.all([
      fetchPublishedReviews(),
      fetchVoteTotals(),
      fetchPublishedCommunityBrands(),
    ])
      .then(([publishedReviews, totals, publishedBrands]) => {
        if (cancelled) return;
        setComments(publishedReviews);
        setVoteTotals(totals);
        setCommunityBrands(publishedBrands);
      })
      .catch((error) => {
        if (!cancelled) {
          setCommunityError(error instanceof Error ? error.message : "Unable to load community data.");
        }
      })
      .finally(() => {
        if (!cancelled) setReviewsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const brands = useMemo(
    () => {
      const builtInIds = new Set(BRANDS.map((brand) => brand.id));
      const allBrands = [
        ...BRANDS,
        ...communityBrands.filter((brand) => !builtInIds.has(brand.id)),
      ];

      return allBrands.map((brand) => {
        const brandReviews = comments.filter((comment) => comment.brandId === brand.id);
        const ratingCount = brandReviews.length;
        const rating = ratingCount
          ? Math.round(
              (brandReviews.reduce((sum, review) => sum + review.rating, 0) / ratingCount) * 10,
            ) / 10
          : 0;
        const publicTotals = voteTotals[brand.id] ?? { votesUp: 0, votesDown: 0 };
        const votesUp = brand.votesUp + publicTotals.votesUp;
        const votesDown = brand.votesDown + publicTotals.votesDown;

        return {
          ...brand,
          rating,
          ratingCount,
          votesUp,
          votesDown,
          votes: votesUp - votesDown,
        };
      });
    },
    [comments, communityBrands, voteTotals],
  );

  // Extract active brand from path if on /brand-directory/:id
  let selectedBrand: Brand | null = null;
  const brandMatch = currentPath.match(/^\/brand-directory\/([^/]+)$/);
  if (brandMatch) {
    const brandId = brandMatch[1];
    selectedBrand = brands.find((b) => b.id === brandId) || null;
  }

  // Parser for dynamic SEO-friendly size converter paths
  let converterMode: "measurements" | "brand" = "measurements";
  let urlTargetBrandId = "torrid";
  let urlSourceBrandId = "torrid";

  const isSizeConverterPath =
    currentPath === "/size-converter" ||
    currentPath.startsWith("/size-converter-") ||
    currentPath.startsWith("/size-converter/");

  if (isSizeConverterPath) {
    if (currentPath.startsWith("/size-converter-")) {
      converterMode = "measurements";
      const brandId = currentPath.substring("/size-converter-".length);
      urlTargetBrandId = brandId;
    } else if (currentPath.startsWith("/size-converter/")) {
      const comparison = parseComparisonPath(currentPath, brands);
      if (comparison) {
        converterMode = "brand";
        urlSourceBrandId = comparison.sourceBrand.id;
        urlTargetBrandId = comparison.targetBrand.id;
      }
    }
  }

  const handleConverterSelectionChange = (
    mode: "measurements" | "brand",
    sourceId: string,
    targetId: string
  ) => {
    let newPath = "/size-converter";
    if (mode === "measurements") {
      newPath = `/size-converter-${targetId}`;
    } else {
      newPath = `/size-converter/${sourceId}to${targetId}`;
    }
    window.history.pushState({}, "", newPath);
    setCurrentPath(newPath);
  };

  // Sync state to local storage
  useEffect(() => {
    if (profile) {
      localStorage.setItem("curvy_profile", JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("curvy_user_votes_v3", JSON.stringify(userVotes));
  }, [userVotes]);

  // Handler to save profile
  const handleProfileSave = (newProfile: MeasurementProfile) => {
    setProfile(newProfile);
  };

  const handleBrandVote = async (brandId: string, type: "up" | "down") => {
    if (!isCommunityBackendConfigured) return;

    const previousVote = userVotes[brandId];
    const nextVote = previousVote === type ? null : type;

    setUserVotes((current) => {
      const updated = { ...current };
      if (nextVote) updated[brandId] = nextVote;
      else delete updated[brandId];
      return updated;
    });

    try {
      await submitBrandVote(brandId, nextVote);
      setVoteTotals(await fetchVoteTotals());
      setCommunityError(null);
    } catch (error) {
      setUserVotes((current) => {
        const reverted = { ...current };
        if (previousVote) reverted[brandId] = previousVote;
        else delete reverted[brandId];
        return reverted;
      });
      setCommunityError(error instanceof Error ? error.message : "Unable to save vote.");
    }
  };

  const handleAddComment = async (newComment: ReviewSubmission) => {
    await submitReviewForModeration(newComment);
  };

  const handleBrandSubmission = async (submission: BrandSubmission) => {
    await submitBrandForModeration(submission);
  };

  const seo = getSeoForPath(currentPath, brands);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] font-sans selection:bg-[#EEDCD2] selection:text-[#9E5A44]">
      {/* Dynamic SEO Injector */}
      <SEO
        title={seo.title}
        description={seo.description}
        canonicalPath={seo.canonicalPath}
        ogType={seo.ogType}
        ogImage={seo.ogImage}
        robots={seo.robots}
        schema={seo.schema}
      />
      {/* Editorial Header */}
      <Header currentPath={currentPath} onNavigate={navigateTo} />

      {/* Main Container Stage */}
      <main className="flex-grow mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 pb-10 w-full">
        {/* Render content based on current path */}
        {currentPath === "/" && (
          <Homepage onNavigate={navigateTo} />
        )}

        {currentPath === "/terms-and-privacy" && (
          <TermsAndPrivacy onBack={() => navigateTo("/")} />
        )}

        {currentPath === "/about" && (
          <AboutUs onNavigate={navigateTo} />
        )}

        {isSizeConverterPath && seo.pageKind !== "not-found" && (
          <BrandConverter
            profile={profile}
            onProfileSave={handleProfileSave}
            brands={brands}
            comments={comments}
            initialMode={converterMode}
            initialSourceBrandId={urlSourceBrandId}
            initialTargetBrandId={urlTargetBrandId}
            onSelectionChange={handleConverterSelectionChange}
            communityEnabled={isCommunityBackendConfigured}
            onSubmitBrand={handleBrandSubmission}
          />
        )}

        {currentPath.startsWith("/brand-directory") && seo.pageKind !== "not-found" && (
          selectedBrand ? (
            <BrandDetailView
              brand={selectedBrand}
              comments={comments}
              onBack={() => navigateTo("/brand-directory")}
              onAddComment={handleAddComment}
              communityEnabled={isCommunityBackendConfigured}
              reviewsLoading={reviewsLoading}
              communityError={communityError}
            />
          ) : (
            <DatabaseLeaderboard
              brands={brands}
              userVotes={userVotes}
              onBrandVote={handleBrandVote}
              communityEnabled={isCommunityBackendConfigured}
              onSelectBrand={(brand) => navigateTo(`/brand-directory/${brand.id}`)}
            />
          )
        )}

        {seo.pageKind === "not-found" && (
          <section className="max-w-xl mx-auto py-20 text-center space-y-5">
            <p className="text-xs font-display font-bold uppercase tracking-widest text-[#9E5A44]">
              Error 404
            </p>
            <h1 className="font-serif text-4xl font-black text-[#1C1917]">
              Page not found
            </h1>
            <p className="text-sm text-neutral-500">
              The page may have moved. Explore the size converter or brand directory instead.
            </p>
            <div className="flex justify-center gap-3">
              <InternalLink href="/size-converter" onNavigate={navigateTo} className="px-4 py-2 rounded-lg bg-[#9E5A44] text-white text-sm font-bold">
                Size Converter
              </InternalLink>
              <InternalLink href="/brand-directory" onNavigate={navigateTo} className="px-4 py-2 rounded-lg border border-[#E7E2D8] text-sm font-bold text-[#1C1917]">
                Brand Directory
              </InternalLink>
            </div>
          </section>
        )}
      </main>

      {/* Editorial Fashion Footer */}
      <footer className="bg-[#1C1917] text-[#FAF7F2] border-t border-[#FAF7F2]/10 py-12 mt-16 font-display">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 border-b border-neutral-800 pb-10 md:grid-cols-12">
            {/* Column 1: Brand */}
            <div className="space-y-3 md:col-span-4">
              <InternalLink href="/" onNavigate={navigateTo} className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#9E5A44] text-[#FAF7F2] cursor-pointer">
                  <span className="font-serif text-sm font-bold italic">&</span>
                </div>
                <span className="font-serif text-xl font-bold tracking-tight cursor-pointer">
                  Curvy<span className="text-[#DFB7B0] font-light italic">&</span>
                </span>
              </InternalLink>
              <p className="max-w-xs text-xs leading-relaxed text-neutral-400 font-sans">
                Plus-size sizing tools and fit guidance.
              </p>
            </div>

            {/* Column 2: Explore */}
            <div className="md:col-span-4 space-y-3 text-xs">
              <h4 className="font-bold uppercase tracking-widest text-[#DFB7B0] text-[10px]">
                Explore
              </h4>
              <ul className="space-y-2 font-sans text-neutral-400">
                <li>
                  <InternalLink href="/size-converter" onNavigate={navigateTo} className="hover:text-white transition-colors cursor-pointer text-left">
                    Brand Size Converter
                  </InternalLink>
                </li>
                <li>
                  <InternalLink href="/brand-directory" onNavigate={navigateTo} className="hover:text-white transition-colors cursor-pointer text-left">
                    Brand Directory
                  </InternalLink>
                </li>
                <li>
                  <InternalLink href="/about" onNavigate={navigateTo} className="hover:text-white transition-colors cursor-pointer text-left">
                    About Us
                  </InternalLink>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div className="md:col-span-4 space-y-3 text-xs">
              <h4 className="font-bold uppercase tracking-widest text-[#DFB7B0] text-[10px]">
                Legal & Compliance
              </h4>
              <ul className="space-y-2 font-sans text-neutral-400">
                <li>
                  <InternalLink href="/terms-and-privacy" onNavigate={navigateTo} className="hover:text-white transition-colors cursor-pointer text-left">
                    Terms & Privacy
                  </InternalLink>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 text-[10px] text-neutral-500 font-mono">
            <p>© 2026 Curvy& Co. Celebrating every proportion with absolute elegance.</p>
            <p className="mt-2 sm:mt-0">Made with love for the plus-size community</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
