import React, { useState, useEffect } from "react";
import {
  Ruler,
  Sparkles,
  AlertCircle,
  Share2,
  ArrowRightLeft,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  Bookmark,
  Shirt,
  Compass,
  Heart,
  PlusCircle,
  X,
  Plus,
  Globe,
  Dribbble,
  Scale,
  Star
} from "lucide-react";
import { Brand, MeasurementProfile, GarmentType, BrandCategory } from "../types";
import { convertMeasurementsToSize, convertSizeToBrandSize, getCategoryTitle } from "../data";
import type { BrandSubmission } from "../community";
import SearchableBrandSelect from "./SearchableBrandSelect";
import BodyMannequin from "./BodyMannequin";

interface BrandConverterProps {
  profile: MeasurementProfile | null;
  onProfileSave: (profile: MeasurementProfile) => void;
  brands: Brand[];
  initialMode?: "measurements" | "brand";
  initialSourceBrandId?: string;
  initialTargetBrandId?: string;
  onSelectionChange?: (mode: "measurements" | "brand", sourceBrandId: string, targetBrandId: string) => void;
  communityEnabled: boolean;
  onSubmitBrand: (submission: BrandSubmission) => Promise<void>;
}

export default function BrandConverter({
  profile,
  onProfileSave,
  brands,
  initialMode = "measurements",
  initialSourceBrandId = "torrid",
  initialTargetBrandId = "eloquii",
  onSelectionChange,
  communityEnabled,
  onSubmitBrand,
}: BrandConverterProps) {
  // Input mode: "measurements" or "brand"
  const [mode, setMode] = useState<"measurements" | "brand">(initialMode);

  // Track currently active/focused measurement field for dynamic diagram highlight
  const [activeField, setActiveField] = useState<"bust" | "waist" | "hips" | "height" | null>(null);

  // Selected garment type
  const [garmentType, setGarmentType] = useState<GarmentType>("tops_dresses");

  // Measurements fields
  const [bust, setBust] = useState<number>(46);
  const [waist, setWaist] = useState<number>(40);
  const [hips, setHips] = useState<number>(50);
  const [height, setHeight] = useState<number>(170);
  const [unit, setUnit] = useState<"in" | "cm">("in");

  // Brand-to-brand fields
  const [sourceBrandId, setSourceBrandId] = useState<string>(initialSourceBrandId);
  const [sourceSize, setSourceSize] = useState<string>("2 (US 18-20)");
  const [targetBrandId, setTargetBrandId] = useState<string>(initialTargetBrandId);

  // Selected brand for size charts subpages
  const [chartSubpageId, setChartSubpageId] = useState<string>(initialTargetBrandId);

  // Custom Brand Creator panel toggle
  const [isAddingBrand, setIsAddingBrand] = useState(false);

  // Form states for dynamic brand registration (unlimited additions!)
  const [customBrandName, setCustomBrandName] = useState("");
  const [customBrandCat, setCustomBrandCat] = useState<BrandCategory>("premium_plus");
  const [customBrandScale, setCustomBrandScale] = useState<"us_num" | "us_alpha" | "torrid" | "universal_standard" | "denim_waist" | "lingerie_bra">("us_num");
  const [customBrandFit, setCustomBrandFit] = useState<"generous" | "fitted" | "true_to_size">("true_to_size");
  const [customBrandPrice, setCustomBrandPrice] = useState(2);
  const [customBrandUrl, setCustomBrandUrl] = useState("");
  const [customBrandAesthetic, setCustomBrandAesthetic] = useState("Minimalist, Trendy");
  const [customBrandDesc, setCustomBrandDesc] = useState("");
  const [brandSuccessMsg, setBrandSuccessMsg] = useState<string | null>(null);
  const [brandSubmissionError, setBrandSubmissionError] = useState<string | null>(null);
  const [brandSubmitting, setBrandSubmitting] = useState(false);
  const [brandWebsite, setBrandWebsite] = useState("");

  // Load profile when component mounts or profile changes
  useEffect(() => {
    if (profile) {
      setBust(profile.bust);
      setWaist(profile.waist);
      setHips(profile.hips);
      setHeight(profile.height);
      setUnit(profile.unit);
    }
  }, [profile]);

  // Synchronize with external url props from parent router
  useEffect(() => {
    if (initialMode && initialMode !== mode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  useEffect(() => {
    if (initialSourceBrandId && initialSourceBrandId !== sourceBrandId) {
      setSourceBrandId(initialSourceBrandId);
    }
  }, [initialSourceBrandId]);

  useEffect(() => {
    if (initialTargetBrandId && initialTargetBrandId !== targetBrandId) {
      setTargetBrandId(initialTargetBrandId);
      setChartSubpageId(initialTargetBrandId);
    }
  }, [initialTargetBrandId]);

  // Handle mode change with URL notification
  const handleModeChange = (newMode: "measurements" | "brand") => {
    setMode(newMode);
    onSelectionChange?.(newMode, sourceBrandId, targetBrandId);
  };

  // Handle target brand selection change with URL notification
  const handleTargetBrandChange = (newTargetId: string) => {
    setTargetBrandId(newTargetId);
    setChartSubpageId(newTargetId);
    onSelectionChange?.(mode, sourceBrandId, newTargetId);
  };

  // Handle source brand selection change with URL notification
  const handleSourceBrandChange = (brandId: string) => {
    setSourceBrandId(brandId);
    const selectedBrand = brands.find((b) => b.id === brandId);
    if (selectedBrand) {
      // Find matching size list based on current garment type, or fallback
      const currentChart = selectedBrand.sizeChart[garmentType] || selectedBrand.sizeChart.default || {};
      const sizes = Object.keys(currentChart);
      if (sizes.length > 0) {
        setSourceSize(sizes[0]);
      }
    }
    onSelectionChange?.(mode, brandId, targetBrandId);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onProfileSave({ bust, waist, hips, height, unit });
  };

  // Sizing Calculations taking current garmentType into account
  const targetBrand = brands.find((b) => b.id === targetBrandId) || brands[0];
  const sourceBrand = brands.find((b) => b.id === sourceBrandId) || brands[0];

  let resultSize = "";
  let confidence = 0;
  let fitDetails = { bust: "Perfect", waist: "Perfect", hips: "Perfect" };
  let explanation = "";

  if (mode === "measurements") {
    const res = convertMeasurementsToSize(bust, waist, hips, unit, targetBrand, garmentType);
    resultSize = res.bestSize;
    confidence = res.confidence;
    fitDetails = res.fitScore;
    explanation = `${targetBrand.name} ${resultSize} fits your physical proportions optimally for ${garmentType.replace("_", " ")} apparel, with a confidence score of ${confidence}%. ${targetBrand.fitNotes}`;
  } else {
    const res = convertSizeToBrandSize(sourceBrandId, sourceSize, targetBrandId, garmentType, brands);
    resultSize = res.targetSize;
    confidence = res.confidence;
    explanation = res.explanation;
  }

  const editorialFitNote = {
    text: targetBrand.fitNotes,
    recommendedSize: resultSize,
  };

  // Alternative brand suggestions if confidence is below 75%
  const getAlternativeBrand = () => {
    if (confidence >= 75) return null;

    const altResults: Array<{ brand: Brand; bestSize: string; confidence: number }> = [];

    if (mode === "measurements") {
      brands.forEach((b) => {
        if (b.id === targetBrand.id) return;
        const res = convertMeasurementsToSize(bust, waist, hips, unit, b, garmentType);
        altResults.push({
          brand: b,
          bestSize: res.bestSize,
          confidence: res.confidence,
        });
      });
    } else {
      // Brand to brand mode
      const sChart = sourceBrand.sizeChart[garmentType] || sourceBrand.sizeChart.default || {};
      const sourceRanges = sChart[sourceSize];
      if (sourceRanges) {
        const avgBust = (sourceRanges.bust[0] + sourceRanges.bust[1]) / 2;
        const avgWaist = (sourceRanges.waist[0] + sourceRanges.waist[1]) / 2;
        const avgHips = (sourceRanges.hips[0] + sourceRanges.hips[1]) / 2;

        brands.forEach((b) => {
          if (b.id === targetBrand.id || b.id === sourceBrandId) return;
          const res = convertMeasurementsToSize(avgBust, avgWaist, avgHips, "in", b, garmentType);
          altResults.push({
            brand: b,
            bestSize: res.bestSize,
            confidence: res.confidence,
          });
        });
      }
    }

    // Sort by confidence descending
    altResults.sort((a, b) => b.confidence - a.confidence);

    const bestAlt = altResults[0];
    if (bestAlt && bestAlt.confidence > confidence) {
      return bestAlt;
    }
    return null;
  };

  const alternativeBrandRec = getAlternativeBrand();

  // Missing brands are submitted to Supabase and become public only after moderation.
  const handleRegisterCustomBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!communityEnabled || !customBrandName.trim() || brandWebsite) return;

    const normalizedName = customBrandName.trim();
    if (brands.some((brand) => brand.name.toLowerCase() === normalizedName.toLowerCase())) {
      setBrandSubmissionError("This brand is already listed in the directory.");
      return;
    }

    const slugBase = normalizedName
      .normalize("NFKD")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
    const slug = slugBase || `community-${crypto.randomUUID().slice(0, 8)}`;

    setBrandSubmitting(true);
    setBrandSubmissionError(null);
    try {
      await onSubmitBrand({
        slug,
        name: normalizedName,
        category: customBrandCat,
        scaleSystem: customBrandScale,
        fitPreference: customBrandFit,
        priceTier: customBrandPrice,
        websiteUrl: customBrandUrl || undefined,
        aestheticTags: customBrandAesthetic
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
          .slice(0, 8),
        description: customBrandDesc || undefined,
      });

      setBrandSuccessMsg(
        `"${normalizedName}" was submitted for moderation. Once approved, it will appear for every visitor.`,
      );
      setCustomBrandName("");
      setCustomBrandUrl("");
      setCustomBrandDesc("");
    } catch (error) {
      setBrandSubmissionError(
        error instanceof Error ? error.message : "Unable to submit this brand.",
      );
    } finally {
      setBrandSubmitting(false);
    }
  };

  // Get current source brand sizes available for the selected garment type
  const currentSourceChart = sourceBrand.sizeChart[garmentType] || sourceBrand.sizeChart.default || {};
  const sourceSizes = Object.keys(currentSourceChart);

  // Quick feedback state
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  return (
    <div className="space-y-10">
      {/* Editorial Slogan Hero */}
      <div className="text-center max-w-xl mx-auto py-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-tight text-[#1C1917]">
          Size Converter
        </h1>
      </div>

      {/* Mode Switcher Buttons */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-full bg-[#EEDCD2]/40 p-1 border border-[#E7E2D8]">
          <button
            onClick={() => {
              handleModeChange("measurements");
              setFeedbackGiven(false);
            }}
            className={`flex items-center space-x-2 rounded-full px-5 py-2.5 text-xs font-display font-bold uppercase tracking-wider transition-luxury cursor-pointer ${
              mode === "measurements"
                ? "bg-[#9E5A44] text-[#FAF7F2] shadow-sm"
                : "text-neutral-600 hover:text-[#9E5A44]"
            }`}
          >
            <Ruler className="h-4 w-4" />
            <span>By My Measurements</span>
          </button>
          <button
            onClick={() => {
              handleModeChange("brand");
              setFeedbackGiven(false);
            }}
            className={`flex items-center space-x-2 rounded-full px-5 py-2.5 text-xs font-display font-bold uppercase tracking-wider transition-luxury cursor-pointer ${
              mode === "brand"
                ? "bg-[#9E5A44] text-[#FAF7F2] shadow-sm"
                : "text-neutral-600 hover:text-[#9E5A44]"
            }`}
          >
            <ArrowRightLeft className="h-4 w-4" />
            <span>Brand-to-Brand</span>
          </button>
        </div>
      </div>

      {/* Garment Type Horizontal Selection Row */}
      <div className="space-y-3">
        <span className="block text-center text-[10px] font-display font-bold uppercase tracking-widest text-neutral-500">
          Step 1: Choose Garment Category
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-4xl mx-auto">
          {[
            { id: "tops_dresses", label: "Tops & Dresses", icon: Shirt },
            { id: "pants_bottoms", label: "Pants & Denim", icon: Scale },
            { id: "swimwear", label: "Swimwear", icon: Compass },
            { id: "intimates_lingerie", label: "Lingerie & Bras", icon: Heart },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = garmentType === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setGarmentType(item.id as GarmentType);
                  setFeedbackGiven(false);
                }}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#9E5A44]/10 border-[#9E5A44] text-[#9E5A44] shadow-xs"
                    : "bg-white border-[#E7E2D8] text-neutral-600 hover:border-[#DFB7B0]"
                }`}
              >
                <Icon className="h-4 w-4 mb-1.5" />
                <span className="font-display font-bold text-[10px] uppercase tracking-wide">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Converter Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-7 bg-[#FDFBF7] border border-[#E7E2D8] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs relative">
          {mode === "measurements" ? (
            <form onSubmit={handleProfileSave} className="space-y-5">
              <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-[#EEDCD2]/60 rounded-lg text-[#9E5A44]">
                    <Ruler className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#1C1917]">Fit Profile</h3>
                  </div>
                </div>

                {/* Unit selector */}
                <div className="flex items-center border border-[#E7E2D8] rounded-md overflow-hidden text-xs">
                  <button
                    type="button"
                    onClick={() => setUnit("in")}
                    className={`px-3 py-1 font-mono transition-luxury cursor-pointer ${
                      unit === "in" ? "bg-[#9E5A44] text-[#FAF7F2] font-semibold" : "bg-white text-neutral-600"
                    }`}
                  >
                    IN
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnit("cm")}
                    className={`px-3 py-1 font-mono transition-luxury cursor-pointer ${
                      unit === "cm" ? "bg-[#9E5A44] text-[#FAF7F2] font-semibold" : "bg-white text-neutral-600"
                    }`}
                  >
                    CM
                  </button>
                </div>
              </div>

              {/* SEARCHABLE TARGET BRAND SELECTOR - PLACED PROMINENTLY AT THE TOP */}
              <div className="p-4 bg-[#FAF7F2] border-2 border-[#EEDCD2]/60 rounded-2xl space-y-2.5 shadow-3xs">
                <span className="font-display text-[9px] uppercase tracking-widest text-[#9E5A44] font-black block">
                  ✨ STEP 2: CHOOSE TARGET LUXURY BRAND
                </span>
                <SearchableBrandSelect
                  brands={brands}
                  selectedBrandId={targetBrandId}
                  onBrandSelect={(id) => {
                    handleTargetBrandChange(id);
                    setFeedbackGiven(false);
                  }}
                  label=""
                />
              </div>

              {/* Side-by-Side: Sliders on Left, Interactive Mannequin Diagram on Right */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Sliders (7 cols) */}
                <div className="md:col-span-7 space-y-3.5">
                  {/* BUST */}
                  <div className={`p-3 rounded-2xl border transition-all duration-300 ${
                    activeField === "bust"
                      ? "bg-[#FAF7F2] border-[#DFB7B0] shadow-3xs scale-[1.02]"
                      : "bg-white border-neutral-100"
                  }`}>
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-display font-bold uppercase tracking-wider text-neutral-800 flex items-center space-x-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#9E5A44]" />
                        <span>Bust</span>
                      </label>
                      <span className="font-mono font-bold text-[#9E5A44] bg-[#EEDCD2]/40 px-2.5 py-0.5 rounded text-sm transition-all">
                        {bust} {unit}
                      </span>
                    </div>
                    <div className="relative mt-2.5">
                      <div className="absolute inset-x-0 top-1.5 h-1.5 bg-[#F3EDE2] rounded-full pointer-events-none" />
                      <div 
                        className="absolute inset-x-0 top-1 h-3 opacity-25 pointer-events-none" 
                        style={{ backgroundImage: "repeating-linear-gradient(90deg, #9E5A44 0px, #9E5A44 1px, transparent 1px, transparent 10px)" }} 
                      />
                      <input
                        type="range"
                        min={unit === "in" ? 30 : 76}
                        max={unit === "in" ? 75 : 190}
                        value={bust}
                        onMouseEnter={() => setActiveField("bust")}
                        onMouseLeave={() => setActiveField(null)}
                        onFocus={() => setActiveField("bust")}
                        onBlur={() => setActiveField(null)}
                        onChange={(e) => {
                          setBust(parseInt(e.target.value));
                          setFeedbackGiven(false);
                        }}
                        className="w-full h-4 bg-transparent appearance-none cursor-pointer accent-[#9E5A44] relative z-10"
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-neutral-400 font-mono pt-1">
                      <span>Min: {unit === "in" ? "30\"" : "76cm"}</span>
                      <span>Max: {unit === "in" ? "75\"" : "190cm"}</span>
                    </div>
                  </div>

                  {/* WAIST */}
                  <div className={`p-3 rounded-2xl border transition-all duration-300 ${
                    activeField === "waist"
                      ? "bg-[#FAF7F2] border-[#DFB7B0] shadow-3xs scale-[1.02]"
                      : "bg-white border-neutral-100"
                  }`}>
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-display font-bold uppercase tracking-wider text-neutral-800 flex items-center space-x-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#D28268]" />
                        <span>Waist</span>
                      </label>
                      <span className="font-mono font-bold text-[#9E5A44] bg-[#EEDCD2]/40 px-2.5 py-0.5 rounded text-sm transition-all">
                        {waist} {unit}
                      </span>
                    </div>
                    <div className="relative mt-2.5">
                      <div className="absolute inset-x-0 top-1.5 h-1.5 bg-[#F3EDE2] rounded-full pointer-events-none" />
                      <div 
                        className="absolute inset-x-0 top-1 h-3 opacity-25 pointer-events-none" 
                        style={{ backgroundImage: "repeating-linear-gradient(90deg, #9E5A44 0px, #9E5A44 1px, transparent 1px, transparent 10px)" }} 
                      />
                      <input
                        type="range"
                        min={unit === "in" ? 22 : 55}
                        max={unit === "in" ? 70 : 178}
                        value={waist}
                        onMouseEnter={() => setActiveField("waist")}
                        onMouseLeave={() => setActiveField(null)}
                        onFocus={() => setActiveField("waist")}
                        onBlur={() => setActiveField(null)}
                        onChange={(e) => {
                          setWaist(parseInt(e.target.value));
                          setFeedbackGiven(false);
                        }}
                        className="w-full h-4 bg-transparent appearance-none cursor-pointer accent-[#9E5A44] relative z-10"
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-neutral-400 font-mono pt-1">
                      <span>Min: {unit === "in" ? "22\"" : "55cm"}</span>
                      <span>Max: {unit === "in" ? "70\"" : "178cm"}</span>
                    </div>
                  </div>

                  {/* HIPS */}
                  <div className={`p-3 rounded-2xl border transition-all duration-300 ${
                    activeField === "hips"
                      ? "bg-[#FAF7F2] border-[#DFB7B0] shadow-3xs scale-[1.02]"
                      : "bg-white border-neutral-100"
                  }`}>
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-display font-bold uppercase tracking-wider text-neutral-800 flex items-center space-x-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#C17A63]" />
                        <span>Hips</span>
                      </label>
                      <span className="font-mono font-bold text-[#9E5A44] bg-[#EEDCD2]/40 px-2.5 py-0.5 rounded text-sm transition-all">
                        {hips} {unit}
                      </span>
                    </div>
                    <div className="relative mt-2.5">
                      <div className="absolute inset-x-0 top-1.5 h-1.5 bg-[#F3EDE2] rounded-full pointer-events-none" />
                      <div 
                        className="absolute inset-x-0 top-1 h-3 opacity-25 pointer-events-none" 
                        style={{ backgroundImage: "repeating-linear-gradient(90deg, #9E5A44 0px, #9E5A44 1px, transparent 1px, transparent 10px)" }} 
                      />
                      <input
                        type="range"
                        min={unit === "in" ? 34 : 86}
                        max={unit === "in" ? 85 : 216}
                        value={hips}
                        onMouseEnter={() => setActiveField("hips")}
                        onMouseLeave={() => setActiveField(null)}
                        onFocus={() => setActiveField("hips")}
                        onBlur={() => setActiveField(null)}
                        onChange={(e) => {
                          setHips(parseInt(e.target.value));
                          setFeedbackGiven(false);
                        }}
                        className="w-full h-4 bg-transparent appearance-none cursor-pointer accent-[#9E5A44] relative z-10"
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-neutral-400 font-mono pt-1">
                      <span>Min: {unit === "in" ? "34\"" : "86cm"}</span>
                      <span>Max: {unit === "in" ? "85\"" : "216cm"}</span>
                    </div>
                  </div>

                  {/* HEIGHT */}
                  <div className={`p-3 rounded-2xl border transition-all duration-300 ${
                    activeField === "height"
                      ? "bg-[#FAF7F2] border-[#DFB7B0] shadow-3xs scale-[1.02]"
                      : "bg-white border-neutral-100"
                  }`}>
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-display font-bold uppercase tracking-wider text-neutral-800 flex items-center space-x-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                        <span>Height</span>
                      </label>
                      <span className="font-mono font-bold text-[#9E5A44] bg-[#EEDCD2]/40 px-2.5 py-0.5 rounded text-sm transition-all">
                        {height} {unit === "in" ? "in" : "cm"}
                      </span>
                    </div>
                    <div className="relative mt-2.5">
                      <div className="absolute inset-x-0 top-1.5 h-1.5 bg-[#F3EDE2] rounded-full pointer-events-none" />
                      <div 
                        className="absolute inset-x-0 top-1 h-3 opacity-25 pointer-events-none" 
                        style={{ backgroundImage: "repeating-linear-gradient(90deg, #9E5A44 0px, #9E5A44 1px, transparent 1px, transparent 10px)" }} 
                      />
                      <input
                        type="range"
                        min={unit === "in" ? 55 : 140}
                        max={unit === "in" ? 80 : 203}
                        value={height}
                        onMouseEnter={() => setActiveField("height")}
                        onMouseLeave={() => setActiveField(null)}
                        onFocus={() => setActiveField("height")}
                        onBlur={() => setActiveField(null)}
                        onChange={(e) => {
                          setHeight(parseInt(e.target.value));
                          setFeedbackGiven(false);
                        }}
                        className="w-full h-4 bg-transparent appearance-none cursor-pointer accent-[#9E5A44] relative z-10"
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-neutral-400 font-mono pt-1">
                      <span>Min: {unit === "in" ? "55\"" : "140cm"}</span>
                      <span>Max: {unit === "in" ? "80\"" : "203cm"}</span>
                    </div>
                  </div>
                </div>

                {/* Body Diagram (5 cols) */}
                <div className="md:col-span-5 h-full flex flex-col justify-center">
                  <BodyMannequin
                    bust={bust}
                    waist={waist}
                    hips={hips}
                    height={height}
                    unit={unit}
                    activeField={activeField}
                    onSelectField={(field) => setActiveField(field)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#9E5A44] hover:bg-[#854B38] text-white py-3 text-xs font-display font-bold uppercase tracking-widest transition-luxury cursor-pointer shadow-md"
              >
                Save Sizing Profile
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center space-x-2 border-b border-[#E7E2D8] pb-4">
                <div className="p-2 bg-[#EEDCD2]/60 rounded-lg text-[#9E5A44]">
                  <ArrowRightLeft className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1C1917]">Brand-to-Brand</h3>
                </div>
              </div>

              {/* STEP 2: SELECT YOUR REFERENCE BRAND & SIZE */}
              <div className="p-4 bg-white border border-[#E7E2D8] rounded-2xl space-y-3.5 shadow-3xs">
                <span className="font-display text-[9px] uppercase tracking-widest text-neutral-400 font-bold block">
                  ✨ STEP 2: CHOOSE REFERENCE BRAND
                </span>
                <SearchableBrandSelect
                  brands={brands}
                  selectedBrandId={sourceBrandId}
                  onBrandSelect={(id) => {
                    handleSourceBrandChange(id);
                    setFeedbackGiven(false);
                  }}
                  label=""
                />

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-neutral-700">
                    My Size in {sourceBrand.name}
                  </label>
                  <select
                    value={sourceSize}
                    onChange={(e) => {
                      setSourceSize(e.target.value);
                      setFeedbackGiven(false);
                    }}
                    className="w-full rounded-lg border border-[#E7E2D8] bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-neutral-800 focus:border-[#9E5A44] focus:ring-1 focus:ring-[#9E5A44]"
                  >
                    {sourceSizes.length > 0 ? (
                      sourceSizes.map((sz) => (
                        <option key={sz} value={sz}>
                          {sz}
                        </option>
                      ))
                    ) : (
                      <option value="">No sizes available</option>
                    )}
                  </select>
                </div>
              </div>

              {/* STEP 3: CONVERT TO TARGET LUXURY BRAND */}
              <div className="p-4 bg-[#FAF7F2] border-2 border-[#EEDCD2]/60 rounded-2xl space-y-2.5 shadow-3xs">
                <span className="font-display text-[9px] uppercase tracking-widest text-[#9E5A44] font-black block">
                  ✨ STEP 3: CONVERT TO TARGET LUXURY BRAND
                </span>
                <SearchableBrandSelect
                  brands={brands.filter((b) => b.id !== sourceBrandId)}
                  selectedBrandId={targetBrandId}
                  onBrandSelect={(id) => {
                    handleTargetBrandChange(id);
                    setFeedbackGiven(false);
                  }}
                  label=""
                />
              </div>
            </div>
          )}

          {/* Dynamic "Register Custom Brand" triggers */}
          <div className="pt-4 border-t border-[#E7E2D8] flex items-center justify-between">
            <span className="text-[10px] text-neutral-500 font-sans">Brand missing? Suggest it for the public directory.</span>
            <button
              onClick={() => {
                setIsAddingBrand(!isAddingBrand);
                setBrandSuccessMsg(null);
                setBrandSubmissionError(null);
              }}
              className="text-[#9E5A44] text-[10px] font-display font-bold uppercase tracking-widest flex items-center space-x-1 cursor-pointer hover:underline"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Suggest Brand</span>
            </button>
          </div>
        </div>

        {/* Right Column: Output Results & Custom Brand Panel overlay */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 min-h-[450px]">
          {isAddingBrand ? (
            /* COLLAPSIBLE REGISTRATION FORM FOR UNLIMITED BRANDS */
            <div className="bg-white border-2 border-[#9E5A44] rounded-2xl p-6 sm:p-8 space-y-5 flex-grow animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-3">
                <div className="flex items-center space-x-2">
                  <Plus className="h-5 w-5 text-[#9E5A44]" />
                  <h3 className="font-serif font-black text-lg text-[#1C1917]">Suggest a Missing Brand</h3>
                </div>
                <button
                  onClick={() => setIsAddingBrand(false)}
                  className="p-1 text-neutral-400 hover:text-red-500 rounded-full cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {brandSuccessMsg ? (
                <div className="py-12 text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-neutral-800">Suggestion Received</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed max-w-sm mx-auto">
                    {brandSuccessMsg}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRegisterCustomBrand} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <p className="sm:col-span-2 rounded-lg border border-[#E7E2D8] bg-[#FAF7F2] px-3 py-2 text-[10px] leading-relaxed text-neutral-500">
                    {communityEnabled
                      ? "Suggestions are stored in the shared database and reviewed before publication. Approved brands become visible to every visitor; nothing from this form is saved as a local-only brand."
                      : "The shared community database is not connected yet. You can preview this form, but submission will open after Supabase is configured."}
                  </p>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-neutral-700">Brand Name</label>
                    <input
                      type="text"
                      required
                      minLength={2}
                      maxLength={80}
                      placeholder="e.g. CurvyCouture"
                      value={customBrandName}
                      onChange={(e) => setCustomBrandName(e.target.value)}
                      className="w-full rounded-lg border border-[#E7E2D8] px-3 py-2"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-neutral-700">Category segment</label>
                    <select
                      value={customBrandCat}
                      onChange={(e) => setCustomBrandCat(e.target.value as BrandCategory)}
                      className="w-full rounded-lg border border-[#E7E2D8] bg-white px-3 py-2"
                    >
                      <option value="premium_plus">Premium Plus Size Brands</option>
                      <option value="mainstream">Mainstream Brands</option>
                      <option value="activewear">Activewear</option>
                      <option value="denim">Denim</option>
                      <option value="swimwear">Swimwear</option>
                      <option value="lingerie">Lingerie</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-neutral-700">Measurement Scale system</label>
                    <select
                      value={customBrandScale}
                      onChange={(e) => setCustomBrandScale(e.target.value as any)}
                      className="w-full rounded-lg border border-[#E7E2D8] bg-white px-3 py-2"
                    >
                      <option value="us_num">Standard US Sizing (10-40)</option>
                      <option value="us_alpha">Plus-Size Alpha (XS-4XL)</option>
                      <option value="torrid">Torrid System (00-6)</option>
                      <option value="universal_standard">Universal Standard (4XS-4XL)</option>
                      <option value="denim_waist">Waist Inches (Size 30-50)</option>
                      <option value="lingerie_bra">Full-Bust Bra Sizing</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-neutral-700">Typical Fit Cut</label>
                    <select
                      value={customBrandFit}
                      onChange={(e) => setCustomBrandFit(e.target.value as any)}
                      className="w-full rounded-lg border border-[#E7E2D8] bg-white px-3 py-2"
                    >
                      <option value="true_to_size">Standard True To Size</option>
                      <option value="generous">Generous / Loose Cuts</option>
                      <option value="fitted">Snug / Contoured Fitted</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-neutral-700">Price Tier</label>
                    <select
                      value={customBrandPrice}
                      onChange={(e) => setCustomBrandPrice(parseInt(e.target.value))}
                      className="w-full rounded-lg border border-[#E7E2D8] bg-white px-3 py-2"
                    >
                      <option value={1}>$ - Entry Budget</option>
                      <option value={2}>$$ - Mid Moderate</option>
                      <option value={3}>$$$ - Premium Contemporary</option>
                      <option value={4}>$$$$ - Luxury Couture</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-neutral-700">Store Website URL</label>
                    <input
                      type="url"
                      maxLength={500}
                      placeholder="https://example.com"
                      value={customBrandUrl}
                      onChange={(e) => setCustomBrandUrl(e.target.value)}
                      className="w-full rounded-lg border border-[#E7E2D8] px-3 py-2"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-neutral-700">Aesthetic tags (comma separated)</label>
                    <input
                      type="text"
                      maxLength={160}
                      placeholder="Trendy, Romantic, Comfort, Sexy"
                      value={customBrandAesthetic}
                      onChange={(e) => setCustomBrandAesthetic(e.target.value)}
                      className="w-full rounded-lg border border-[#E7E2D8] px-3 py-2"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-neutral-700">Description / Design Ethos</label>
                    <textarea
                      placeholder="Brief overview of the label..."
                      maxLength={800}
                      value={customBrandDesc}
                      onChange={(e) => setCustomBrandDesc(e.target.value)}
                      rows={2}
                      className="w-full rounded-lg border border-[#E7E2D8] px-3 py-2 font-sans"
                    />
                  </div>

                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="brand-website-field">Website</label>
                    <input
                      id="brand-website-field"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={brandWebsite}
                      onChange={(event) => setBrandWebsite(event.target.value)}
                    />
                  </div>

                  {brandSubmissionError && (
                    <p className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                      {brandSubmissionError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={!communityEnabled || brandSubmitting}
                    className="sm:col-span-2 w-full rounded-lg bg-[#9E5A44] hover:bg-[#854B38] text-white py-3 text-xs font-display font-bold uppercase tracking-widest transition-luxury cursor-pointer shadow-md mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {brandSubmitting ? "Submitting..." : "Submit Brand for Review"}
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* CONVERSION RECOMMENDATION DISPLAY CARD */
            <div className="bg-radial from-[#FDFBF7] to-[#F3EDE2] border-2 border-[#DFB7B0] rounded-2xl p-6 sm:p-8 space-y-6 flex-grow flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-4">
                <span className="font-display text-[10px] uppercase tracking-widest text-[#9E5A44] font-bold">
                  Tailored Recommendation
                </span>
                <div className="flex items-center space-x-1.5 bg-[#FAF7F2] border border-[#E7E2D8] px-2.5 py-1 rounded-full text-[10px] font-bold text-neutral-600">
                  <Sparkles className="h-3 w-3 text-[#9E5A44]" />
                  <span>{garmentType.replace("_", " ").toUpperCase()} MATCH</span>
                </div>
              </div>

              {/* BIG Size Output Display */}
              <div className="text-center py-6 space-y-2">
                <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">
                  Your Recommended Size in {targetBrand.name} is:
                </p>
                <div className="text-5xl sm:text-6xl font-serif font-black tracking-tight text-[#9E5A44]">
                  {resultSize}
                </div>
                <div className="flex items-center justify-center space-x-2 pt-2">
                  <div className="w-24 bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#9E5A44] h-full rounded-full"
                      style={{ width: `${confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-mono font-bold text-neutral-600">
                    {confidence}% Fit Rating
                  </span>
                </div>
              </div>

              {/* Fit Breakdown (Only for measurements mode) */}
              {mode === "measurements" && (
                <div className="bg-white/80 backdrop-blur-xs rounded-xl p-4 border border-[#E7E2D8] space-y-3">
                  <h4 className="font-serif font-bold text-sm text-[#1C1917] tracking-tight">Detailed Fit Proportions</h4>
                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    {[
                      { label: "Bust", score: fitDetails.bust, color: "bg-[#9E5A44]" },
                      { label: "Waist", score: fitDetails.waist, color: "bg-[#D28268]" },
                      { label: "Hips", score: fitDetails.hips, color: "bg-[#C17A63]" },
                    ].map((m) => {
                      const getBadgeStyle = (score: string) => {
                        if (score === "Perfect") return "bg-[#EEDCD2]/40 text-[#9E5A44] border-[#9E5A44]/20";
                        if (score === "Slightly Tight") return "bg-[#FDF0EC] text-[#D28268] border-[#D28268]/20";
                        return "bg-neutral-50 text-neutral-500 border-neutral-200";
                      };
                      const getDisplayLabel = (score: string) => {
                        if (score === "Perfect") return "Perfect";
                        if (score === "Slightly Tight") return "Snug";
                        return "Roomy";
                      };
                      return (
                        <div key={m.label} className="bg-[#FAF7F2] p-2 rounded-xl border border-[#E7E2D8]/50 flex flex-col items-center justify-between">
                          <span className="block text-[9px] font-display font-bold uppercase tracking-widest text-neutral-400">{m.label}</span>
                          <span className={`mt-1 px-2 py-0.5 rounded-full border text-[9px] font-sans font-extrabold uppercase tracking-wider block ${getBadgeStyle(m.score)}`}>
                            {getDisplayLabel(m.score)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sizing Slogan / Insight */}
              <div className="border-l-2 border-[#9E5A44] pl-4 py-2 italic text-xs text-neutral-600 bg-[#FAF7F2]/40 rounded-r-xl pr-2.5">
                <span className="font-serif block font-bold text-[#1C1917] text-[9px] uppercase tracking-widest not-italic mb-1">COUTURE BRIEF</span>
                "{explanation}"
              </div>

              {/* Curated editorial context; intentionally not presented as a user review. */}
              <div className="bg-white/95 rounded-xl p-3.5 border border-[#E7E2D8] space-y-2 text-left relative overflow-hidden shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-[#EEDCD2] text-[#9E5A44] flex items-center justify-center">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block font-sans font-bold text-xs text-[#1C1917]">Editorial Fit Note</span>
                      <span className="block font-mono text-[9px] text-neutral-400">Curated sizing guidance | Suggested: {editorialFitNote.recommendedSize}</span>
                    </div>
                  </div>
                </div>
                <p className="font-sans text-neutral-600 text-[11px] leading-relaxed">
                  {editorialFitNote.text}
                </p>
                <div className="flex items-center justify-between text-[9px] text-neutral-400 font-mono pt-1">
                  <span>Always compare with the retailer's current product chart.</span>
                  <span className="text-[#9E5A44] font-semibold bg-[#EEDCD2]/25 px-1.5 py-0.5 rounded">Not a customer review</span>
                </div>
              </div>

              {/* Smart Alternative Recommendation Panel for low confidence fits (<75%) */}
              {alternativeBrandRec && (
                <div className="bg-amber-50/65 border border-amber-200/80 rounded-xl p-3.5 space-y-3 text-left">
                  <div className="flex items-start space-x-2.5">
                    <div className="p-1.5 bg-amber-100 rounded-lg text-amber-800 shrink-0">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="font-serif font-black text-xs text-amber-900">🌿 Higher Compatibility Match Found</h5>
                      <p className="text-neutral-600 text-[11px] leading-relaxed mt-0.5">
                        We noticed {targetBrand.name}'s sizing might have limited tolerance for your curves ({confidence}% Fit Rating). 
                        Based on your profile, <span className="font-bold text-neutral-800">{alternativeBrandRec.brand.name}</span> has a much higher fit rating!
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-amber-200/50">
                    <div className="space-y-0.5">
                      <span className="block font-mono text-[9px] text-neutral-500 uppercase tracking-wider">Suggested Size:</span>
                      <span className="block font-sans font-extrabold text-xs sm:text-sm text-[#9E5A44]">
                        {alternativeBrandRec.brand.name} {alternativeBrandRec.bestSize} <span className="text-[10px] font-normal text-neutral-500">({alternativeBrandRec.confidence}% Rating)</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetBrandId(alternativeBrandRec.brand.id);
                        setChartSubpageId(alternativeBrandRec.brand.id);
                        setFeedbackGiven(false);
                      }}
                      className="px-2.5 py-1.5 bg-[#9E5A44] hover:bg-[#854B38] text-white text-[9px] font-display font-bold uppercase tracking-widest rounded-lg transition-luxury shadow-2xs shrink-0 cursor-pointer"
                    >
                      Switch Brand
                    </button>
                  </div>
                </div>
              )}

              {/* Interactivity: feedback questionnaire */}
              <div className="pt-2 flex items-center justify-between text-xs border-t border-[#E7E2D8]">
                <span className="text-neutral-500">Does this match your real-world experience?</span>
                {!feedbackGiven ? (
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setFeedbackGiven(true)}
                      className="bg-[#EEDCD2] text-[#9E5A44] hover:bg-[#9E5A44] hover:text-[#FAF7F2] px-3 py-1 rounded transition-luxury font-bold cursor-pointer"
                    >
                      Yes, Spot on!
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeedbackGiven(true)}
                      className="border border-[#DFB7B0] text-neutral-600 hover:bg-neutral-100 px-3 py-1 rounded transition-luxury font-bold cursor-pointer"
                    >
                      No, runs different
                    </button>
                  </div>
                ) : (
                  <span className="text-[#9E5A44] font-bold flex items-center space-x-1 animate-pulse">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Thank you! Sizing profile optimized.</span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* HORIZONTAL EXPANDABLE BRAND SIZE CHARTS SUBPAGES SECTION */}
      <div className="bg-[#FDFBF7] border border-[#E7E2D8] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E7E2D8] pb-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#1C1917]">Sizing Parameters Directory</h3>
          </div>

          {/* Search box for sizing directory */}
          <div className="w-full sm:w-64">
            <SearchableBrandSelect
              brands={brands}
              selectedBrandId={chartSubpageId}
              onBrandSelect={(id) => setChartSubpageId(id)}
              label=""
            />
          </div>
        </div>

        {/* Selected Brand Sizing Subpage Render */}
        {(() => {
          const selectedBrandForChart = brands.find((b) => b.id === chartSubpageId) || brands[0];
          // Determine active size chart mapping for selected subpage based on current garment category
          const activeSizingChart = (selectedBrandForChart.sizeChart[garmentType] || selectedBrandForChart.sizeChart.default || {}) as any;

          return (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FAF7F2] p-4 rounded-xl border border-[#E7E2D8]">
                <div className="space-y-1">
                  <span className="font-serif font-black text-lg text-[#9E5A44] flex items-center space-x-2">
                    <span>{selectedBrandForChart.name} Sizing Table</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#9E5A44]/10 text-[#9E5A44] rounded">
                      {garmentType.replace("_", " ")}
                    </span>
                  </span>
                  <p className="text-xs text-neutral-600">
                    Sizing Range: <span className="font-semibold text-neutral-800">{selectedBrandForChart.sizingRange}</span> | Fit Style: <span className="font-semibold text-neutral-800">{selectedBrandForChart.fitNotes}</span>
                  </p>
                </div>
                <a
                  href={selectedBrandForChart.siteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs text-[#9E5A44] font-display font-bold uppercase tracking-wider hover:underline"
                >
                  <span>Visit {selectedBrandForChart.name} Store</span>
                  <Bookmark className="h-3 w-3" />
                </a>
              </div>

              {/* Responsive Beautiful Size Chart Table */}
              <div className="overflow-x-auto rounded-xl border border-[#E7E2D8] bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] text-neutral-700 font-display uppercase tracking-wider text-[10px] border-b border-[#E7E2D8]">
                    <tr>
                      <th className="py-3 px-4 font-bold">Brand Size</th>
                      <th className="py-3 px-4 font-bold">Bust Size Range</th>
                      <th className="py-3 px-4 font-bold">Waist Size Range</th>
                      <th className="py-3 px-4 font-bold">Hips Size Range</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E2D8] font-mono text-neutral-600">
                    {Object.keys(activeSizingChart).length > 0 ? (
                      Object.entries(activeSizingChart as Record<string, any>).map(([szName, ranges]) => {
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
                              <div className="relative w-32 h-4 bg-[#FAF7F2] border border-[#E7E2D8] rounded-sm overflow-hidden select-none flex items-center shrink-0">
                                <div className="absolute inset-0 flex justify-between px-1 opacity-20 pointer-events-none">
                                  {[...Array(12)].map((_, i) => (
                                    <div key={i} className={`w-[1px] bg-neutral-950 ${i % 4 === 0 ? "h-2.5" : "h-1.5"}`} />
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
                          <tr key={szName} className="hover:bg-[#FAF7F2]/50 transition-luxury">
                            <td className="py-3 px-4 font-bold text-[#9E5A44] font-display text-sm">{szName}</td>
                            <td className="py-3 px-4">{renderTape(ranges.bust[0], ranges.bust[1], "bust")}</td>
                            <td className="py-3 px-4">{renderTape(ranges.waist[0], ranges.waist[1], "waist")}</td>
                            <td className="py-3 px-4">{renderTape(ranges.hips[0], ranges.hips[1], "hips")}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-neutral-400 font-sans italic">
                          No sizing data registered for this garment category.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Sizing Footer Disclaimer */}
              <p className="text-[10px] text-neutral-400 font-sans leading-relaxed text-center italic">
                * Note: Sizing metrics represent direct garment specifications set by the label for {garmentType.replace("_", " ")} apparel. Actual fit may vary based on material stretch, silhouette design, and individual posture.
              </p>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
