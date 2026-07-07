import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Apple, Sparkles, Loader2, ArrowRight, Ban, Check, ShieldAlert, BookOpen } from "lucide-react";
import { HealthInput, HealthResult } from "../types";
import { generateMockHealth } from "../mockData";

export default function HealthModule() {
  const [selectedDislikes, setSelectedDislikes] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [dietaryPreference, setDietaryPreference] = useState<string>("Balanced Wellness");

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<HealthResult | null>(null);

  const dislikeOptions = ["Cilantro (香菜)", "Onions (洋葱)", "Bitter Melon (苦瓜)", "Celery (芹菜)", "Eggplant (茄子)", "Garlic (大蒜)"];
  const allergyOptions = [
    { id: "gluten", label: "Gluten-Free (无麸质)" },
    { id: "nuts", label: "Nut-Free (无坚果)" },
    { id: "dairy", label: "Dairy-Free (无乳制品)" },
    { id: "seafood", label: "Seafood-Free (无海鲜)" }
  ];

  const dietaryOptions = [
    { name: "Balanced Wellness", desc: "Focuses on clean slow carbs, healthy fats, and high-quality protein." },
    { name: "High-Protein / Muscle Support", desc: "Rich in wild-caught fish, organic meats, and high amino acids." },
    { name: "Plant-Based / Vegan", desc: "Wholesome grains, rich legume fiber, seeds, and vibrant plant fats." },
    { name: "Gentle Keto / Healthy Fats", desc: "Curated avocados, raw nuts, extra virgin oils, low glycemic profile." }
  ];

  const toggleDislike = (item: string) => {
    if (selectedDislikes.includes(item)) {
      setSelectedDislikes(selectedDislikes.filter((d) => d !== item));
    } else {
      setSelectedDislikes([...selectedDislikes, item]);
    }
  };

  const toggleAllergy = (item: string) => {
    if (allergies.includes(item)) {
      setAllergies(allergies.filter((a) => a !== item));
    } else {
      setAllergies([...allergies, item]);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/health/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dislikes: selectedDislikes,
          allergies,
          dietaryPreference
        })
      });

      if (!response.ok) {
        throw new Error("Health API failed");
      }

      const data = await response.json();
      if (data.isMock) {
        setResult(generateMockHealth({ dislikes: selectedDislikes, allergies, dietaryPreference }));
      } else {
        setResult(data);
      }
    } catch (err) {
      console.warn("Health API failed, calling offline model:", err);
      setResult(generateMockHealth({ dislikes: selectedDislikes, allergies, dietaryPreference }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="health-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-4">
      {/* LEFT COLUMN: HEALTH FORM (5 cols) */}
      <div className="lg:col-span-5 bg-white border border-[#1A1A1A] p-6 md:p-8 flex flex-col justify-between rounded-none relative">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1A1A1A]"></div>
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-6 h-[1px] bg-[#1A1A1A]"></span>
            <span className="font-mono text-[10px] tracking-widest text-[#1A1A1A] uppercase font-bold">Nourish Input</span>
          </div>

          <h3 className="font-serif italic text-3xl text-[#1A1A1A] mb-4">
            Curvy Nourish Studio
          </h3>
          <p className="text-stone-600 text-xs mb-6 font-sans leading-relaxed">
            Construct a body-loving daily recipe plan. Absolutely no calorie counting, no food restriction, no guilt. We feed our cells to radiate energy, support hormones, and look gorgeous.
          </p>

          <div className="space-y-6 mb-8 pb-6 border-b border-stone-200">
            {/* Dietary Style Selector */}
            <div>
              <label className="font-serif text-xs tracking-wide text-[#1A1A1A] block mb-2 uppercase font-bold">
                1. Dietary Preference
              </label>
              <div className="space-y-2">
                {dietaryOptions.map((opt) => (
                  <label
                    key={opt.name}
                    className={`flex flex-col p-3 border rounded-none cursor-pointer transition-all ${
                      dietaryPreference === opt.name
                        ? "border-[#1A1A1A] bg-[#FFF0F3]"
                        : "border-stone-200 hover:border-[#1A1A1A]/50"
                    }`}
                    id={`dietary-pref-${opt.name.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-xs font-semibold text-[#1A1A1A]">{opt.name}</span>
                      <input
                        type="radio"
                        name="dietaryStyle"
                        value={opt.name}
                        checked={dietaryPreference === opt.name}
                        onChange={() => setDietaryPreference(opt.name)}
                        className="accent-[#1A1A1A]"
                      />
                    </div>
                    <span className="text-[10px] text-stone-500 mt-1 leading-normal">{opt.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Food Dislikes / Avoids */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Ban className="w-3.5 h-3.5 text-stone-400" />
                <label className="font-serif text-xs tracking-wide text-[#1A1A1A] block uppercase font-bold">
                  2. Disliked Ingredients (将为您剔除)
                </label>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {dislikeOptions.map((item) => {
                  const isSelected = selectedDislikes.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleDislike(item)}
                      className={`px-3 py-1.5 border rounded-none text-xs font-mono transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                          : "border-stone-200 bg-white text-stone-600 hover:border-[#1A1A1A]"
                      }`}
                      id={`dislike-chip-${item.split(" ")[0].toLowerCase()}`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Allergies / Contraindications */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <ShieldAlert className="w-3.5 h-3.5 text-stone-400" />
                <label className="font-serif text-xs tracking-wide text-[#1A1A1A] block uppercase font-bold">
                  3. Allergies & Contraindications
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {allergyOptions.map((opt) => {
                  const isChecked = allergies.includes(opt.id);
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-2.5 p-2.5 border rounded-none cursor-pointer text-xs font-sans transition-all ${
                        isChecked
                          ? "border-[#1A1A1A] bg-[#FFF0F3]"
                          : "border-stone-200 bg-white text-stone-600 hover:border-[#1A1A1A]/50"
                      }`}
                      id={`allergy-checkbox-${opt.id}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAllergy(opt.id)}
                        className="accent-[#1A1A1A]"
                      />
                      <span>{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-4 bg-[#1A1A1A] text-white hover:bg-[#D64545] transition-colors font-mono uppercase tracking-[0.2em] text-xs font-bold flex items-center justify-center gap-2 rounded-none mt-4 cursor-pointer disabled:opacity-80"
          id="btn-generate-health"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Nourishing Recipe Engine...</span>
            </>
          ) : (
            <>
              <Apple className="w-4 h-4 text-[#D64545]" />
              <span>Generate My Nourish Plan</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* RIGHT COLUMN: HEALTH RESULTS DISPLAY (7 cols) */}
      <div className="lg:col-span-7 bg-[#FAF9F6] border border-[#1A1A1A] p-6 md:p-8 min-h-[500px] flex flex-col justify-center rounded-none">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center justify-center py-12"
              key="health-loading"
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-none border-t border-b border-[#1A1A1A] animate-spin"></div>
                <Apple className="w-6 h-6 text-[#D64545] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="font-serif italic text-xl text-[#1A1A1A] mb-2">Simmering Nourishment...</p>
              <p className="text-stone-600 text-xs font-mono max-w-sm">
                Formulating customized breakfast, lunch, and dinner recipes. Omitting dislikes ({selectedDislikes.length} selected) & respecting allergies ({allergies.length} selected)...
              </p>
            </motion.div>
          ) : result ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
              key="health-results"
            >
              {/* Core Philosophy Approach */}
              <div>
                <span className="font-serif text-[10px] tracking-[0.2em] text-[#D64545] uppercase block mb-1 font-bold">
                  I. Culinary Philosophy
                </span>
                <p className="text-stone-700 text-sm leading-relaxed font-light">
                  {result.approach}
                </p>
              </div>

              {/* 3 Course Meal Cards */}
              <div>
                <span className="font-serif text-[10px] tracking-[0.2em] text-[#1A1A1A] uppercase block mb-4 font-bold">
                  II. Bespoke Daily Courses
                </span>
                <div className="space-y-4">
                  {(["breakfast", "lunch", "dinner"] as const).map((mealKey) => {
                    const meal = result.mealPlan[mealKey];
                    return (
                      <div key={mealKey} className="bg-white border border-[#1A1A1A] p-5 rounded-none">
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                          <span className="font-mono text-[9px] uppercase bg-stone-100 border border-stone-200 text-stone-500 px-1.5 py-0.5 rounded-none font-bold">
                            {mealKey}
                          </span>
                          <span className="text-[10px] italic text-[#D64545] font-serif font-bold">{meal.vibe}</span>
                        </div>
                        <h4 className="font-serif italic text-base text-[#1A1A1A] mb-3">
                          {meal.title}
                        </h4>
                        
                        {/* Ingredients List */}
                        <div className="mb-3">
                          <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider block mb-1 font-bold">Ingredients (食材清单)</span>
                          <div className="flex flex-wrap gap-1.5">
                            {meal.ingredients.map((ing, idx) => (
                              <span key={idx} className="text-[10px] bg-stone-50 border border-stone-150 px-2 py-0.5 text-stone-600 font-sans rounded-none">
                                {ing}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Prep Steps */}
                        <div className="border-t border-stone-100 pt-3">
                          <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider block mb-1 font-bold">Preparation (烹饪精髓)</span>
                          <p className="text-stone-600 text-[11px] leading-relaxed">
                            {meal.instructions}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Snack recommendation */}
              <div className="bg-[#FFF0F3] border border-[#1A1A1A] p-4 rounded-none">
                <span className="font-serif text-[10px] tracking-[0.2em] text-[#D64545] uppercase block mb-1 font-bold">
                  III. High-Vibe Snack Idea
                </span>
                <p className="text-stone-700 text-xs italic">
                  “{result.snackIdea}”
                </p>
              </div>

              {/* Nourishment benefits focus */}
              <div className="bg-white border border-[#1A1A1A] p-5 rounded-none">
                <div className="flex items-center gap-1.5 mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-[#D64545]" />
                  <span className="font-serif text-[10px] tracking-[0.2em] text-[#1A1A1A] uppercase block font-bold">
                    IV. Focus Benefits
                  </span>
                </div>
                <p className="text-stone-700 text-xs leading-relaxed font-light">
                  {result.nourishmentFocus}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center text-center justify-center py-12"
              key="health-empty"
            >
              <div className="w-12 h-12 rounded-none bg-[#FFF0F3] flex items-center justify-center mb-4 border border-[#1A1A1A]">
                <Apple className="w-5 h-5 text-[#D64545]" />
              </div>
              <h4 className="font-serif italic text-lg text-[#1A1A1A] mb-1">Tailor Your Nourish Plan</h4>
              <p className="text-stone-600 text-xs max-w-xs font-sans leading-relaxed">
                Set your dietary style, exclude dislikes, select any allergies, and click generate to access custom body-loving luxury recipe designs.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
