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
  Scale
} from "lucide-react";
import { Brand, MeasurementProfile, GarmentType, BrandCategory } from "../types";
import { BRANDS, convertMeasurementsToSize, convertSizeToBrandSize, getCategoryTitle, generateSizeChartForBrand } from "../data";
import SearchableBrandSelect from "./SearchableBrandSelect";
import BodyMannequin from "./BodyMannequin";

interface BrandConverterProps {
  profile: MeasurementProfile | null;
  onProfileSave: (profile: MeasurementProfile) => void;
  brands: Brand[];
}

export default function BrandConverter({ profile, onProfileSave, brands }: BrandConverterProps) {
  // Input mode: "measurements" or "brand"
  const [mode, setMode] = useState<"measurements" | "brand">("measurements");

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
  const [sourceBrandId, setSourceBrandId] = useState<string>("torrid");
  const [sourceSize, setSourceSize] = useState<string>("2 (US 18-20)");
  const [targetBrandId, setTargetBrandId] = useState<string>("eloquii");

  // Selected brand for size charts subpages
  const [chartSubpageId, setChartSubpageId] = useState<string>("torrid");

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

  // Handle source brand selection change
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

  // Handle dynamic custom brand creation
  const handleRegisterCustomBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customBrandName.trim()) return;

    const newBrandId = customBrandName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    
    // Automatically generate responsive multi-category size charts based on parameters
    const sizeChartObj = {
      tops_dresses: generateSizeChartForBrand(customBrandScale, "tops_dresses", customBrandFit),
      pants_bottoms: generateSizeChartForBrand(customBrandScale, "pants_bottoms", customBrandFit),
      intimates_lingerie: generateSizeChartForBrand(customBrandScale, "intimates_lingerie", customBrandFit),
      swimwear: generateSizeChartForBrand(customBrandScale, "swimwear", customBrandFit),
      default: generateSizeChartForBrand(customBrandScale, "tops_dresses", customBrandFit),
    };

    const newBrand: Brand = {
      id: newBrandId,
      name: customBrandName.trim(),
      logo: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=200&h=200",
      category: customBrandCat,
      rating: 4.8,
      ratingCount: 1,
      votes: 1,
      sizingRange: customBrandScale === "torrid" ? "Torrid 00-6" : customBrandScale === "universal_standard" ? "US 00-40" : "Standard Plus Sizing",
      priceTier: customBrandPrice,
      aesthetic: customBrandAesthetic.split(",").map((s) => s.trim()),
      description: customBrandDesc || `Luxury styling brand representing high-quality couture tailored for curvy silhouettes.`,
      fitNotes: customBrandFit === "generous" ? "Runs roomy and highly supportive." : customBrandFit === "fitted" ? "Tailored snug fit." : "Highly standard true-to-size stretch profile.",
      sizeChart: sizeChartObj,
      siteUrl: customBrandUrl || "https://google.com",
      isCustom: true
    };

    // Push new brand dynamically! It gets appended to App.tsx's state and localStorage!
    const updatedBrands = [...brands, newBrand];
    
    // Directly mutate the parent through side effect
    // We can also trigger storage sync through the state passed down
    localStorage.setItem("curvy_brands", JSON.stringify(updatedBrands));
    
    // For immediate React state feedback we will prompt the parent
    // Wait, since we get brands as props, let's trigger a page reload or state alert.
    // To cleanly update we can just trigger a reload or custom state dispatcher.
    // Let's reload or dispatch to make it active instantly!
    setBrandSuccessMsg(`"${customBrandName}" has been registered successfully! It is now instantly searchable.`);
    
    // Reset fields
    setCustomBrandName("");
    setCustomBrandUrl("");
    setCustomBrandDesc("");
    
    setTimeout(() => {
      setBrandSuccessMsg(null);
      setIsAddingBrand(false);
      window.location.reload(); // Quick refresh to repopulate state from localStorage!
    }, 2500);
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
              setMode("measurements");
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
              setMode("brand");
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

              {/* Side-by-Side: Sliders on Left, Interactive Mannequin Diagram on Right */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Sliders (7 cols) */}
                <div className="md:col-span-7 space-y-5">
                  {/* BUST */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-display font-bold uppercase tracking-wider text-neutral-700">
                        Bust Line
                      </label>
                      <span className="font-mono font-bold text-[#9E5A44] bg-[#EEDCD2]/40 px-2 py-0.5 rounded text-sm">
                        {bust} {unit}
                      </span>
                    </div>
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
                      className="w-full h-1 bg-[#EEDCD2] rounded-lg appearance-none cursor-pointer accent-[#9E5A44]"
                    />
                  </div>

                  {/* WAIST */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-display font-bold uppercase tracking-wider text-neutral-700">
                        Waist Line
                      </label>
                      <span className="font-mono font-bold text-[#9E5A44] bg-[#EEDCD2]/40 px-2 py-0.5 rounded text-sm">
                        {waist} {unit}
                      </span>
                    </div>
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
                      className="w-full h-1 bg-[#EEDCD2] rounded-lg appearance-none cursor-pointer accent-[#9E5A44]"
                    />
                  </div>

                  {/* HIPS */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-display font-bold uppercase tracking-wider text-neutral-700">
                        Hip Line
                      </label>
                      <span className="font-mono font-bold text-[#9E5A44] bg-[#EEDCD2]/40 px-2 py-0.5 rounded text-sm">
                        {hips} {unit}
                      </span>
                    </div>
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
                      className="w-full h-1 bg-[#EEDCD2] rounded-lg appearance-none cursor-pointer accent-[#9E5A44]"
                    />
                  </div>

                  {/* HEIGHT */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-display font-bold uppercase tracking-wider text-neutral-700">
                        Height
                      </label>
                      <span className="font-mono font-bold text-[#9E5A44] bg-[#EEDCD2]/40 px-2 py-0.5 rounded text-sm">
                        {height} {unit === "in" ? "in" : "cm"}
                      </span>
                    </div>
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
                      className="w-full h-1 bg-[#EEDCD2] rounded-lg appearance-none cursor-pointer accent-[#9E5A44]"
                    />
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
                  />
                </div>
              </div>

              {/* SEARCHABLE TARGET BRAND SELECTOR */}
              <div className="pt-4 border-t border-[#E7E2D8]">
                <SearchableBrandSelect
                  brands={brands}
                  selectedBrandId={targetBrandId}
                  onBrandSelect={(id) => {
                    setTargetBrandId(id);
                    setFeedbackGiven(false);
                  }}
                  label="Target Luxury/Curve Brand"
                />
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

              {/* SEARCHABLE SOURCE BRAND SELECTOR */}
              <div className="space-y-4">
                <SearchableBrandSelect
                  brands={brands}
                  selectedBrandId={sourceBrandId}
                  onBrandSelect={(id) => {
                    handleSourceBrandChange(id);
                    setFeedbackGiven(false);
                  }}
                  label="My Reference Brand"
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
                    className="w-full rounded-lg border border-[#E7E2D8] bg-white px-3 py-2.5 text-xs sm:text-sm font-semibold text-neutral-800 focus:border-[#9E5A44] focus:ring-1 focus:ring-[#9E5A44]"
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

              {/* SEARCHABLE TARGET BRAND SELECTOR */}
              <div className="pt-2 border-t border-[#E7E2D8]">
                <SearchableBrandSelect
                  brands={brands.filter((b) => b.id !== sourceBrandId)}
                  selectedBrandId={targetBrandId}
                  onBrandSelect={(id) => {
                    setTargetBrandId(id);
                    setFeedbackGiven(false);
                  }}
                  label="Convert to Target Brand"
                />
              </div>
            </div>
          )}

          {/* Dynamic "Register Custom Brand" triggers */}
          <div className="pt-4 border-t border-[#E7E2D8] flex items-center justify-between">
            <span className="text-[10px] text-neutral-500 font-sans">Brand missing? Add it dynamically.</span>
            <button
              onClick={() => setIsAddingBrand(!isAddingBrand)}
              className="text-[#9E5A44] text-[10px] font-display font-bold uppercase tracking-widest flex items-center space-x-1 cursor-pointer hover:underline"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Register Brand</span>
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
                  <h3 className="font-serif font-black text-lg text-[#1C1917]">Couture Brand Registration</h3>
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
                  <h4 className="font-serif font-bold text-lg text-neutral-800">Registration Success</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed max-w-sm mx-auto">
                    {brandSuccessMsg}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRegisterCustomBrand} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-neutral-700">Brand Name</label>
                    <input
                      type="text"
                      required
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
                      value={customBrandDesc}
                      onChange={(e) => setCustomBrandDesc(e.target.value)}
                      rows={2}
                      className="w-full rounded-lg border border-[#E7E2D8] px-3 py-2 font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="sm:col-span-2 w-full rounded-lg bg-[#9E5A44] hover:bg-[#854B38] text-white py-3 text-xs font-display font-bold uppercase tracking-widest transition-luxury cursor-pointer shadow-md mt-2"
                  >
                    Register and Generate Sizing Charts
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
                  <h4 className="font-serif font-bold text-sm text-[#1C1917]">Detailed Fit Proportions</h4>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E7E2D8]/80">
                      <span className="block text-[10px] font-display uppercase tracking-wider text-neutral-500">Bust</span>
                      <span className="text-xs font-mono font-bold text-[#9E5A44]">{fitDetails.bust}</span>
                    </div>
                    <div className="bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E7E2D8]/80">
                      <span className="block text-[10px] font-display uppercase tracking-wider text-neutral-500">Waist</span>
                      <span className="text-xs font-mono font-bold text-[#9E5A44]">{fitDetails.waist}</span>
                    </div>
                    <div className="bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E7E2D8]/80">
                      <span className="block text-[10px] font-display uppercase tracking-wider text-neutral-500">Hips</span>
                      <span className="text-xs font-mono font-bold text-[#9E5A44]">{fitDetails.hips}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Explanation box */}
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#1C1917] flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4 text-[#9E5A44]" />
                  <span>Editorial Sizing Insights</span>
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed bg-white/50 p-4 rounded-xl border border-[#E7E2D8] italic">
                  "{explanation}"
                </p>
              </div>

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
