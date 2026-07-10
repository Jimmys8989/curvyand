import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import BrandConverter from "./components/BrandConverter";
import DatabaseLeaderboard from "./components/DatabaseLeaderboard";
import BrandDetailView from "./components/BrandDetailView";
import BrowserBar from "./components/BrowserBar";
import Homepage from "./components/Homepage";
import { Brand, Comment, MeasurementProfile } from "./types";
import { BRANDS, INITIAL_COMMENTS } from "./data";
import { Ruler, Heart, Sparkles, Instagram, Facebook, Mail, BookOpen } from "lucide-react";

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

  // Brands with votes/ratings state (v2 key to reset and align to high-fidelity vote dataset)
  const [brands, setBrands] = useState<Brand[]>(() => {
    const saved = localStorage.getItem("curvy_brands_v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Brand[];
        // Filter out any custom-registered brands
        const nonCustomSaved = parsed.filter(b => !b.isCustom);
        // If the cached brand database is outdated (contains fewer official brands than our 56-brand list)
        if (nonCustomSaved.length < BRANDS.length) {
          // Immediately overwrite cache with current complete set
          localStorage.setItem("curvy_brands_v2", JSON.stringify(BRANDS));
          return BRANDS;
        }

        // To handle newly added brands, we merge: we start with all brands from BRANDS
        // and update their votes/ratings if they have saved equivalents.
        const merged = [...BRANDS];
        parsed.forEach((savedBrand) => {
          const index = merged.findIndex((b) => b.id === savedBrand.id);
          if (index !== -1) {
            merged[index] = {
              ...merged[index],
              votes: savedBrand.votes !== undefined ? savedBrand.votes : merged[index].votes,
              rating: savedBrand.rating !== undefined ? savedBrand.rating : merged[index].rating,
              ratingCount: savedBrand.ratingCount !== undefined ? savedBrand.ratingCount : merged[index].ratingCount,
            };
          } else if (savedBrand.isCustom) {
            // Keep custom registered brands
            merged.push(savedBrand);
          }
        });
        return merged;
      } catch (e) {
        return BRANDS;
      }
    }
    return BRANDS;
  });

  // User custom votes for each brand (brandId -> "up" | "down")
  const [userVotes, setUserVotes] = useState<Record<string, "up" | "down">>(() => {
    const saved = localStorage.getItem("curvy_user_votes_v2");
    return saved ? JSON.parse(saved) : {};
  });

  // Comments/Sizing Diary state (v2 key to force bust cached values)
  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem("curvy_comments_v2");
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  // Extract active brand from path if on /brand-directory/:id
  let selectedBrand: Brand | null = null;
  const brandMatch = currentPath.match(/^\/brand-directory\/([^/]+)$/);
  if (brandMatch) {
    const brandId = brandMatch[1];
    selectedBrand = brands.find((b) => b.id === brandId) || null;
  }

  // Sync state to local storage
  useEffect(() => {
    if (profile) {
      localStorage.setItem("curvy_profile", JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("curvy_brands_v2", JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    localStorage.setItem("curvy_user_votes_v2", JSON.stringify(userVotes));
  }, [userVotes]);

  useEffect(() => {
    localStorage.setItem("curvy_comments_v2", JSON.stringify(comments));
  }, [comments]);

  // Handler to save profile
  const handleProfileSave = (newProfile: MeasurementProfile) => {
    setProfile(newProfile);
  };

  // Handler to handle brand voting (Upvote / Downvote size accuracy with toggle/retract)
  const handleBrandVote = (brandId: string, type: "up" | "down") => {
    const currentVote = userVotes[brandId];
    let upChange = 0;
    let downChange = 0;
    let newVote: "up" | "down" | undefined;

    if (currentVote === type) {
      // Cancel the vote
      if (type === "up") {
        upChange = -1;
      } else {
        downChange = -1;
      }
      newVote = undefined;
    } else if (currentVote) {
      // Toggle vote
      if (type === "up") {
        upChange = 1;
        downChange = -1;
      } else {
        upChange = -1;
        downChange = 1;
      }
      newVote = type;
    } else {
      // New vote
      if (type === "up") {
        upChange = 1;
      } else {
        downChange = 1;
      }
      newVote = type;
    }

    // 1. Update user custom votes list
    setUserVotes((prevVotes) => {
      const updated = { ...prevVotes };
      if (newVote) {
        updated[brandId] = newVote;
      } else {
        delete updated[brandId];
      }
      return updated;
    });

    // 2. Update brand votes tally safely and independently
    setBrands((prevBrands) =>
      prevBrands.map((b) => {
        if (b.id === brandId) {
          // Fallbacks for any dynamically generated custom brands or old cached state
          const initialVotesUp = b.votesUp !== undefined ? b.votesUp : b.votes;
          const initialVotesDown = b.votesDown !== undefined ? b.votesDown : 0;
          const newVotesUp = Math.max(0, initialVotesUp + upChange);
          const newVotesDown = Math.max(0, initialVotesDown + downChange);
          return {
            ...b,
            votesUp: newVotesUp,
            votesDown: newVotesDown,
            votes: newVotesUp - newVotesDown,
          };
        }
        return b;
      })
    );
  };

  // Handler to handle brand scoring
  const handleBrandRate = (brandId: string, rating: number) => {
    setBrands((prev) =>
      prev.map((b) => {
        if (b.id === brandId) {
          const totalRating = b.rating * b.ratingCount + rating;
          const newCount = b.ratingCount + 1;
          return {
            ...b,
            ratingCount: newCount,
            rating: Math.round((totalRating / newCount) * 10) / 10,
          };
        }
        return b;
      })
    );
  };

  // Handler to add custom sizing review
  const handleAddComment = (newComment: Omit<Comment, "id" | "timestamp">) => {
    const commentWithMeta: Comment = {
      ...newComment,
      id: Date.now().toString(),
      isLocal: true, // Marked as locally created by user
      timestamp: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };

    setComments((prev) => [commentWithMeta, ...prev]);

    // Automatically boost rating count of the brand as well
    handleBrandRate(newComment.brandId, newComment.rating);
  };

  // Handler to delete custom reviews
  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] font-sans selection:bg-[#EEDCD2] selection:text-[#9E5A44]">
      {/* High-fidelity Mock Browser Frame with Secure Address Bar */}
      <BrowserBar currentPath={currentPath} onNavigate={navigateTo} />

      {/* Editorial Header */}
      <Header currentPath={currentPath} onNavigate={navigateTo} profile={profile} />

      {/* Main Container Stage */}
      <main className="flex-grow mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Render content based on current path */}
        {currentPath === "/" && (
          <Homepage onNavigate={navigateTo} />
        )}

        {currentPath === "/size-converter" && (
          <BrandConverter
            profile={profile}
            onProfileSave={handleProfileSave}
            brands={brands}
          />
        )}

        {currentPath.startsWith("/brand-directory") && (
          selectedBrand ? (
            <BrandDetailView
              brand={selectedBrand}
              comments={comments}
              onBack={() => navigateTo("/brand-directory")}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
            />
          ) : (
            <DatabaseLeaderboard
              brands={brands}
              userVotes={userVotes}
              onBrandVote={handleBrandVote}
              onBrandRate={handleBrandRate}
              onSelectBrand={(brand) => navigateTo(`/brand-directory/${brand.id}`)}
            />
          )
        )}
      </main>

      {/* Editorial Fashion Footer */}
      <footer className="bg-[#1C1917] text-[#FAF7F2] border-t border-[#FAF7F2]/10 py-12 mt-16 font-display">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-neutral-800">
            {/* Column 1: Brand Info */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#9E5A44] text-[#FAF7F2] cursor-pointer" onClick={() => navigateTo("/")}>
                  <span className="font-serif text-sm font-bold italic">&</span>
                </div>
                <span className="font-serif text-xl font-bold tracking-tight cursor-pointer" onClick={() => navigateTo("/")}>
                  Curvy<span className="text-[#DFB7B0] font-light italic">&</span>
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-sm font-sans">
                Curvy& is a premier digital fashion studio created specifically to serve the needs of the plus-size community. We believe in sizing transparency, fit confidence, and high-fashion without compromise.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="md:col-span-4 space-y-3 text-xs">
              <h4 className="font-bold uppercase tracking-widest text-[#DFB7B0] text-[10px]">
                Shopping Suite Links
              </h4>
              <ul className="space-y-2 font-sans text-neutral-400">
                <li>
                  <button onClick={() => navigateTo("/size-converter")} className="hover:text-white transition-colors cursor-pointer text-left">
                    Brand Size Converter
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo("/brand-directory")} className="hover:text-white transition-colors cursor-pointer text-left">
                    Leaderboard Directory & Database
                  </button>
                </li>

              </ul>
            </div>

            {/* Column 3: Social & Newsletter */}
            <div className="md:col-span-3 space-y-3 text-xs">
              <h4 className="font-bold uppercase tracking-widest text-[#DFB7B0] text-[10px]">
                Join the Movement
              </h4>
              <p className="text-neutral-400 font-sans">
                Sign up for weekly curve trend roundups and fit alerts.
              </p>
              <div className="flex space-x-3.5 pt-2">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="mailto:hello@curvyand.co" className="text-neutral-400 hover:text-white transition-colors">
                  <Mail className="h-4 w-4" />
                </a>
              </div>
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
