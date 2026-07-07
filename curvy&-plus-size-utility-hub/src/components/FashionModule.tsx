import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, Loader2, RefreshCw, BookmarkCheck, Heart, ExternalLink } from "lucide-react";
import { FashionInput, FashionResult } from "../types";
import { generateMockFashion } from "../mockData";

export default function FashionModule() {
  const [bust, setBust] = useState<number>(105);
  const [waist, setWaist] = useState<number>(90);
  const [hips, setHips] = useState<number>(115);
  const [style, setStyle] = useState<string>("Classic Vogue");
  const [selectedColors, setSelectedColors] = useState<string[]>(["Merlot Red", "Rich Cream"]);
  const [occasion, setOccasion] = useState<string>("Runway Cocktail");
  const [season, setSeason] = useState<string>("Autumn");

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<FashionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const styleArchetypes = [
    { name: "Classic Vogue", desc: "Timeless tailoring, clean structured shoulders, monochrome tones." },
    { name: "Parisian Minimalist", desc: "Effortless drapey silks, soft cashmere, oversized coats." },
    { name: "Bold Streetwear", desc: "Dynamic volumes, cargo shapes, platform boots, statement crops." },
    { name: "Romantic Boho", desc: "Ethereal tiered midi dresses, lace inserts, warm floral notes." },
    { name: "Retro Hollywood", desc: "Glamorous sweetheart necklines, hourglass cinches, vintage prints." }
  ];

  const colorPaletteOptions = [
    { name: "Merlot Red", hex: "#D64545" },
    { name: "Rich Cream", hex: "#FAF9F6" },
    { name: "Olive Green", hex: "#556B2F" },
    { name: "Cobalt Blue", hex: "#0047AB" },
    { name: "Chocolate Brown", hex: "#3D2314" },
    { name: "Camel Sand", hex: "#C19A6B" },
    { name: "Obsidian Black", hex: "#1A1A1A" }
  ];

  const occasions = [
    "Runway Cocktail", "Office Vogue / Professional", "Cozy Weekend Travel", "Sunday Gallery Brunch", "Romantic Dinner Gala"
  ];

  const toggleColor = (colorName: string) => {
    if (selectedColors.includes(colorName)) {
      setSelectedColors(selectedColors.filter((c) => c !== colorName));
    } else {
      setSelectedColors([...selectedColors, colorName]);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/fashion/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bust,
          waist,
          hips,
          style,
          colors: selectedColors,
          season,
          occasion
        })
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const data = await response.json();
      if (data.isMock) {
        // Fallback to offline generator if API is empty
        const offlineData = generateMockFashion({ bust, waist, hips, style, colors: selectedColors, season, occasion });
        setResult(offlineData);
      } else {
        setResult(data);
      }
    } catch (err: any) {
      console.warn("Fashion API error, using client-side engine:", err);
      // Fallback
      const offlineData = generateMockFashion({ bust, waist, hips, style, colors: selectedColors, season, occasion });
      setResult(offlineData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="fashion-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-4">
      {/* LEFT COLUMN: ATELIER FORM (5 cols) */}
      <div className="lg:col-span-5 bg-white border border-[#1A1A1A] p-6 md:p-8 flex flex-col justify-between rounded-none relative">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#D64545]"></div>
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-6 h-[1px] bg-[#D64545]"></span>
            <span className="font-mono text-[10px] tracking-widest text-[#D64545] uppercase font-bold">Atelier Input</span>
          </div>

          <h3 className="font-serif italic text-3xl text-[#1A1A1A] mb-4">
            Curvy Styling Atelier
          </h3>
          <p className="text-stone-600 text-xs mb-6 font-sans leading-relaxed">
            Enter your measurements and select your fashion aesthetic to generate custom high-fashion proportions, outfit blueprints, and curated brands.
          </p>

          {/* Measurements */}
          <div className="space-y-6 mb-8 border-b border-stone-200 pb-6">
            <h4 className="font-serif text-sm tracking-wide text-[#1A1A1A] mb-2 uppercase font-bold">
              1. Proportional Dimensions
            </h4>
            
            {/* Bust */}
            <div>
              <div className="flex justify-between text-xs text-[#1A1A1A] font-mono mb-1">
                <span className="font-semibold uppercase tracking-wider">胸围 (Bust)</span>
                <span className="font-bold text-[#D64545]">{bust} cm</span>
              </div>
              <input
                type="range"
                min="80"
                max="160"
                value={bust}
                onChange={(e) => setBust(Number(e.target.value))}
                className="w-full h-1 bg-stone-200 appearance-none cursor-pointer accent-[#D64545] rounded-none"
                id="bust-slider"
              />
            </div>

            {/* Waist */}
            <div>
              <div className="flex justify-between text-xs text-[#1A1A1A] font-mono mb-1">
                <span className="font-semibold uppercase tracking-wider">腰围 (Waist)</span>
                <span className="font-bold text-[#D64545]">{waist} cm</span>
              </div>
              <input
                type="range"
                min="60"
                max="140"
                value={waist}
                onChange={(e) => setWaist(Number(e.target.value))}
                className="w-full h-1 bg-stone-200 appearance-none cursor-pointer accent-[#D64545] rounded-none"
                id="waist-slider"
              />
            </div>

            {/* Hips */}
            <div>
              <div className="flex justify-between text-xs text-[#1A1A1A] font-mono mb-1">
                <span className="font-semibold uppercase tracking-wider">臀围 (Hips)</span>
                <span className="font-bold text-[#D64545]">{hips} cm</span>
              </div>
              <input
                type="range"
                min="80"
                max="170"
                value={hips}
                onChange={(e) => setHips(Number(e.target.value))}
                className="w-full h-1 bg-stone-200 appearance-none cursor-pointer accent-[#D64545] rounded-none"
                id="hips-slider"
              />
            </div>
          </div>

          {/* Style Archetypes */}
          <div className="mb-6">
            <h4 className="font-serif text-sm tracking-wide text-[#1A1A1A] mb-3 uppercase font-bold">
              2. Style Archetype
            </h4>
            <div className="space-y-2">
              {styleArchetypes.map((arch) => (
                <label
                  key={arch.name}
                  className={`flex flex-col p-3 border rounded-none cursor-pointer transition-all ${
                    style === arch.name
                      ? "border-[#1A1A1A] bg-[#FFF0F3]"
                      : "border-stone-200 bg-white hover:border-[#1A1A1A]/50"
                  }`}
                  id={`style-archetype-${arch.name.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xs font-semibold text-[#1A1A1A]">{arch.name}</span>
                    <input
                      type="radio"
                      name="style"
                      value={arch.name}
                      checked={style === arch.name}
                      onChange={() => setStyle(arch.name)}
                      className="accent-[#1A1A1A]"
                    />
                  </div>
                  <span className="text-[10px] text-stone-500 mt-1 leading-normal">{arch.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Color Palettes */}
          <div className="mb-6">
            <h4 className="font-serif text-sm tracking-wide text-[#1A1A1A] mb-2 uppercase font-bold">
              3. Color Palette
            </h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {colorPaletteOptions.map((palette) => {
                const isSelected = selectedColors.includes(palette.name);
                return (
                  <button
                    key={palette.name}
                    type="button"
                    onClick={() => toggleColor(palette.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-none text-xs font-mono transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                        : "border-stone-200 bg-white text-stone-700 hover:border-[#1A1A1A]"
                    }`}
                    id={`color-chip-${palette.name.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-none border border-stone-800/20"
                      style={{ backgroundColor: palette.hex }}
                    />
                    <span>{palette.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Context selectors (Occasion & Season) */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="font-serif text-xs tracking-wide text-[#1A1A1A] block mb-1 uppercase font-bold">
                4. Occasion
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full text-xs font-sans border border-[#1A1A1A] p-2.5 bg-white rounded-none outline-none focus:border-[#D64545]"
                id="occasion-select"
              >
                {occasions.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-serif text-xs tracking-wide text-[#1A1A1A] block mb-1 uppercase font-bold">
                5. Season
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full text-xs font-sans border border-[#1A1A1A] p-2.5 bg-white rounded-none outline-none focus:border-[#D64545]"
                id="season-select"
              >
                {["Spring", "Summer", "Autumn", "Winter"].map((sea) => (
                  <option key={sea} value={sea}>
                    {sea}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-4 bg-[#1A1A1A] text-white hover:bg-[#D64545] transition-colors font-mono uppercase tracking-[0.2em] text-xs font-bold flex items-center justify-center gap-2 rounded-none mt-4 cursor-pointer disabled:opacity-80"
          id="btn-generate-style"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Tailoring Playbook...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#D64545]" />
              <span>Tailor My Style Playbook</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* RIGHT COLUMN: REPORT OUT (7 cols) */}
      <div className="lg:col-span-7 bg-[#FAF9F6] border border-[#1A1A1A] p-6 md:p-8 min-h-[500px] flex flex-col justify-center rounded-none">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center justify-center py-12"
              key="fashion-loading"
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-none border-t border-b border-[#1A1A1A] animate-spin"></div>
                <Sparkles className="w-6 h-6 text-[#D64545] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="font-serif italic text-xl text-[#1A1A1A] mb-2">Analyzing Silhouette Proportions...</p>
              <p className="text-stone-600 text-xs font-mono max-w-sm">
                Evaluating Bust ({bust}cm), Waist ({waist}cm), and Hips ({hips}cm) against luxury high-fashion draping formulas...
              </p>
            </motion.div>
          ) : result ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
              key="fashion-results"
            >
              {/* Badge indicating engine mode */}
              <div className="flex justify-between items-center border-b border-[#1A1A1A]/10 pb-4">
                <div className="flex items-center gap-2">
                  <BookmarkCheck className="w-4 h-4 text-[#D64545]" />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#1A1A1A] font-bold">
                    {result.isMock ? "Vogue Editorial Smart Engine" : "Gemini AI Tailored Edition"}
                  </span>
                </div>
                <button
                  onClick={handleGenerate}
                  className="font-mono text-[9px] uppercase tracking-wider text-[#D64545] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  id="btn-restyle"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Restyle</span>
                </button>
              </div>

              {/* Proportional Archetype Card */}
              <div>
                <span className="font-serif text-[10px] tracking-[0.2em] text-[#D64545] uppercase block mb-1 font-bold">
                  I. Silhouette Archetype
                </span>
                <h2 className="font-serif italic text-4xl text-[#1A1A1A] mb-2">
                  {result.bodyShape}
                </h2>
                <p className="text-stone-700 text-sm leading-relaxed font-light">
                  {result.shapeDescription}
                </p>
              </div>

              {/* Styling Principles */}
              <div className="bg-white border border-[#1A1A1A] p-4 md:p-6 rounded-none">
                <span className="font-serif text-[10px] tracking-[0.2em] text-[#1A1A1A] uppercase block mb-3 font-bold">
                  II. Core Draping Principles
                </span>
                <ul className="space-y-3">
                  {result.stylingPrinciples.map((princ, idx) => (
                    <li key={idx} className="flex gap-3 text-xs text-stone-700 leading-relaxed items-start">
                      <span className="font-mono text-[#D64545] text-[11px] font-bold mt-0.5">0{idx + 1}.</span>
                      <span>{princ}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Custom Outfit Blueprints */}
              <div>
                <span className="font-serif text-[10px] tracking-[0.2em] text-[#1A1A1A] uppercase block mb-4 font-bold">
                  III. Editorial Lookbook
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.outfits.map((outfit, idx) => (
                    <div key={idx} className="bg-white border border-[#1A1A1A] p-4 flex flex-col justify-between rounded-none">
                      <div>
                        <span className="font-mono text-[9px] text-stone-400 block mb-1 font-bold">LOOK 0{idx + 1}</span>
                        <h4 className="font-serif italic text-base text-[#1A1A1A] mb-2 leading-snug">{outfit.name}</h4>
                        <p className="text-stone-600 text-[11px] leading-relaxed mb-4">{outfit.formula}</p>
                      </div>
                      <div className="border-t border-stone-150 pt-3 mt-2">
                        <span className="font-serif text-[9px] text-[#D64545] uppercase tracking-wider block mb-1 font-bold">Editorial Trick</span>
                        <p className="text-stone-500 text-[10px] italic leading-relaxed">{outfit.stylingTrick}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brands section */}
              <div>
                <span className="font-serif text-[10px] tracking-[0.2em] text-[#1A1A1A] uppercase block mb-4 font-bold">
                  IV. Curated Fit-Engineered Brands
                </span>
                <div className="space-y-3">
                  {result.brands.map((brand, idx) => (
                    <div key={idx} className="bg-white border border-[#1A1A1A] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-none">
                      <div className="max-w-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-serif font-semibold text-sm text-[#1A1A1A]">{brand.name}</h5>
                          <span className="text-[10px] px-1.5 py-0.5 bg-stone-100 border border-stone-200 text-stone-500 font-mono rounded-none">{brand.priceRange}</span>
                        </div>
                        <p className="text-stone-600 text-[11px] leading-relaxed">{brand.why}</p>
                      </div>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(brand.name + " plus size clothing")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-mono text-[#D64545] font-bold flex items-center gap-1 shrink-0 hover:underline cursor-pointer"
                        id={`brand-link-${brand.name.replace(/\s+/g, '-').toLowerCase()}`}
                      >
                        <span>Explore</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editor Letter */}
              <div className="border-t border-[#1A1A1A]/10 pt-6 mt-8 font-serif">
                <span className="text-xs text-[#1A1A1A] tracking-wide uppercase block mb-2 font-bold">Editor-in-Chief Letter</span>
                <p className="text-stone-700 text-xs italic leading-relaxed pl-4 border-l border-[#D64545] font-light">
                  "{result.stylingAdvice}"
                </p>
                <div className="flex items-center gap-2 mt-4 pl-4 text-[10px] font-mono text-stone-500 uppercase tracking-widest">
                  <span>Signed,</span>
                  <span className="font-serif italic font-semibold text-[#D64545] lowercase font-bold">curvy& team</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center text-center justify-center py-12"
              key="fashion-empty"
            >
              <div className="w-12 h-12 rounded-none bg-[#FFF0F3] flex items-center justify-center mb-4 border border-[#1A1A1A]">
                <Sparkles className="w-5 h-5 text-[#D64545]" />
              </div>
              <h4 className="font-serif italic text-lg text-[#1A1A1A] mb-1">Design Your Silhouette</h4>
              <p className="text-stone-600 text-xs max-w-xs font-sans leading-relaxed">
                Adjust your proportions, set your archetype, and click below to reveal your personal styling lookbook.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
