import React, { useState } from "react";
import { Star, ArrowUp, ArrowDown, Search, Filter, Compass, Bookmark, DollarSign, Tag, HelpCircle } from "lucide-react";
import { Brand, BrandCategory } from "../types";
import { getCategoryTitle } from "../data";

interface DatabaseLeaderboardProps {
  brands: Brand[];
  onBrandVote: (brandId: string, type: "up" | "down") => void;
  onBrandRate: (brandId: string, rating: number) => void;
  onSelectBrand: (brand: Brand) => void;
}

export default function DatabaseLeaderboard({
  brands,
  onBrandVote,
  onBrandRate,
  onSelectBrand,
}: DatabaseLeaderboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<BrandCategory | "all">("all");
  const [selectedAesthetic, setSelectedAesthetic] = useState<string>("all");
  const [selectedPrice, setSelectedPrice] = useState<number | "all">("all");

  // Get all unique aesthetics
  const allAesthetics = Array.from(
    new Set(brands.flatMap((b) => b.aesthetic))
  );

  // Filter and sort brands by vote count (ranking leaderboard!)
  const filteredBrands = brands
    .filter((b) => {
      const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || b.category === selectedCategory;
      const matchesAesthetic = selectedAesthetic === "all" || b.aesthetic.includes(selectedAesthetic);
      const matchesPrice = selectedPrice === "all" || b.priceTier === selectedPrice;
      return matchesSearch && matchesCategory && matchesAesthetic && matchesPrice;
    })
    .sort((a, b) => b.votes - a.votes); // Primary sort by community votes

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Editorial Title */}
      <div className="text-center max-w-xl mx-auto py-2">
        <h2 className="font-serif text-3xl sm:text-4xl font-black tracking-tight text-[#1C1917]">
          Brand Directory
        </h2>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-[#FDFBF7] border border-[#E7E2D8] rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-3 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search e.g. Torrid..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E7E2D8] bg-white text-xs text-neutral-800 placeholder-neutral-400 focus:border-[#9E5A44] focus:ring-1 focus:ring-[#9E5A44] transition-luxury"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-neutral-400">
              <Tag className="h-4 w-4 text-neutral-400" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E7E2D8] bg-white text-xs text-neutral-700 focus:border-[#9E5A44] focus:ring-1 focus:ring-[#9E5A44] font-medium"
            >
              <option value="all">All Category Segments</option>
              <option value="premium_plus">Premium Plus Size Brands</option>
              <option value="mainstream">Mainstream Brands</option>
              <option value="activewear">Activewear</option>
              <option value="denim">Denim</option>
              <option value="swimwear">Swimwear</option>
              <option value="lingerie">Lingerie</option>
            </select>
          </div>

          {/* Aesthetic Tag Filter */}
          <div className="md:col-span-3 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-neutral-400">
              <Compass className="h-4 w-4" />
            </div>
            <select
              value={selectedAesthetic}
              onChange={(e) => setSelectedAesthetic(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E7E2D8] bg-white text-xs text-neutral-700 focus:border-[#9E5A44] focus:ring-1 focus:ring-[#9E5A44] font-medium"
            >
              <option value="all">All Styles & Aesthetics</option>
              {allAesthetics.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          {/* Price Tier Filter */}
          <div className="md:col-span-3 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-neutral-400">
              <DollarSign className="h-4 w-4" />
            </div>
            <select
              value={selectedPrice === "all" ? "all" : selectedPrice.toString()}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedPrice(val === "all" ? "all" : parseInt(val));
              }}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E7E2D8] bg-white text-xs text-neutral-700 focus:border-[#9E5A44] focus:ring-1 focus:ring-[#9E5A44] font-medium"
            >
              <option value="all">All Price Tiers</option>
              <option value="1">Budget Friendly ($)</option>
              <option value="2">Moderate ($$)</option>
              <option value="3">Premium ($$$)</option>
              <option value="4">Luxury Essentials ($$$$)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Database Leaderboard Grid */}
      <div className="space-y-4">
        <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-2.5 text-[10px] font-display font-bold uppercase tracking-widest text-neutral-400 border-b border-[#E7E2D8]">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-4">Brand Profile</div>
          <div className="col-span-2 text-center">Segment Category</div>
          <div className="col-span-2 text-center">Sizing Range</div>
          <div className="col-span-1 text-center">Price</div>
          <div className="col-span-1 text-center">Popularity</div>
          <div className="col-span-1 text-right">Explore</div>
        </div>

        {filteredBrands.length > 0 ? (
          filteredBrands.map((brand, index) => {
            // Rank badge style
            let rankColor = "bg-[#FAF7F2] text-neutral-700";
            if (index === 0) rankColor = "bg-[#D4AF37] text-white font-extrabold"; // Gold
            if (index === 1) rankColor = "bg-[#C0C0C0] text-white font-extrabold"; // Silver
            if (index === 2) rankColor = "bg-[#CD7F32] text-white font-extrabold"; // Bronze

            return (
              <div
                key={brand.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-[#FDFBF7] border border-[#E7E2D8] hover:border-[#DFB7B0] rounded-2xl p-5 sm:p-6 transition-luxury shadow-2xs hover:shadow-sm"
              >
                {/* 1. Rank & Vote Controller */}
                <div className="col-span-1 flex lg:flex-col items-center justify-between lg:justify-center space-x-4 lg:space-x-0 lg:space-y-1.5 pb-3 lg:pb-0 border-b lg:border-b-0 border-[#E7E2D8]">
                  <div className="flex items-center space-x-2 lg:space-x-0 lg:flex-col">
                    <span className="text-xs uppercase font-display font-bold text-neutral-400 lg:hidden">
                      Leaderboard Rank
                    </span>
                    <span className={`h-8 w-8 flex items-center justify-center rounded-full text-xs font-mono ${rankColor}`}>
                      #{index + 1}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 bg-white border border-[#E7E2D8] rounded-lg p-0.5 shadow-3xs">
                    <button
                      onClick={() => onBrandVote(brand.id, "up")}
                      className="p-1 hover:text-[#9E5A44] rounded hover:bg-[#EEDCD2]/40 transition-colors cursor-pointer"
                      title="Upvote brand size accuracy"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <span className="text-xs font-mono font-bold text-neutral-700 px-1">
                      {brand.votes}
                    </span>
                    <button
                      onClick={() => onBrandVote(brand.id, "down")}
                      className="p-1 hover:text-neutral-500 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                      title="Downvote brand size accuracy"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* 2. Brand Identity */}
                <div className="col-span-4 flex items-center space-x-4">
                  <img
                    src={brand.logo}
                    alt={`${brand.name} Cover`}
                    className="h-14 w-14 rounded-xl object-cover border border-[#E7E2D8]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-serif font-black text-base text-[#1C1917] leading-tight hover:text-[#9E5A44] cursor-pointer flex items-center" onClick={() => onSelectBrand(brand)}>
                        <span>{brand.name}</span>
                        {brand.isCustom && (
                          <span className="text-[8px] uppercase font-mono px-1 bg-[#9E5A44] text-[#FAF7F2] rounded ml-1.5 shrink-0">Custom</span>
                        )}
                      </h3>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EEDCD2]/60 text-[#9E5A44]">
                        ★ {brand.rating}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 line-clamp-1">{brand.description}</p>
                  </div>
                </div>

                {/* 3. Segment Category */}
                <div className="col-span-2 flex flex-wrap gap-1 lg:justify-center">
                  <span className="px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#E7E2D8] text-[10px] text-neutral-700 font-display font-semibold uppercase tracking-wider text-center w-full block">
                    {getCategoryTitle(brand.category)}
                  </span>
                </div>

                {/* 4. Sizing Range */}
                <div className="col-span-2 lg:text-center">
                  <span className="text-[10px] uppercase font-display font-bold text-neutral-400 block lg:hidden">
                    Size Range
                  </span>
                  <span className="text-xs font-mono font-semibold text-neutral-700 bg-[#FAF7F2] py-1 px-2.5 rounded-md border border-[#E7E2D8]/50">
                    {brand.sizingRange}
                  </span>
                </div>

                {/* 5. Price Tier */}
                <div className="col-span-1 lg:text-center">
                  <span className="text-[10px] uppercase font-display font-bold text-neutral-400 block lg:hidden mr-1">
                    Price:
                  </span>
                  <span className="font-mono text-xs font-black text-neutral-800">
                    {"$".repeat(brand.priceTier)}
                    <span className="text-neutral-300">{"$".repeat(4 - brand.priceTier)}</span>
                  </span>
                </div>

                {/* 6. Scoring Detail Slider */}
                <div className="col-span-1 text-center">
                  <div className="text-[10px] text-neutral-400 font-display font-medium uppercase tracking-wider">
                    Reviews
                  </div>
                  <div className="text-xs font-mono font-bold text-neutral-600">
                    {brand.ratingCount} reviews
                  </div>
                </div>

                {/* 7. Action explore */}
                <div className="col-span-1 text-right flex justify-between lg:justify-end items-center mt-3 lg:mt-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#E7E2D8]">
                  <span className="text-xs text-neutral-400 block lg:hidden italic">
                    Ready to explore?
                  </span>
                  <button
                    onClick={() => onSelectBrand(brand)}
                    className="px-4 py-2 bg-white hover:bg-[#9E5A44] hover:text-white border border-[#E7E2D8] hover:border-[#9E5A44] rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-luxury cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-[#FDFBF7] border border-[#E7E2D8] rounded-xl py-12 text-center text-neutral-400 italic">
            No curvy brands match your current search parameters. Clear filters to start over.
          </div>
        )}
      </div>
    </div>
  );
}
