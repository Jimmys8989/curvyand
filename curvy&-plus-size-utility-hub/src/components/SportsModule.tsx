import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Flame, Sparkles, Clock, Loader2, ArrowRight, CheckCircle2, Circle, AlertCircle, Quote } from "lucide-react";
import { SportsInput, SportsResult } from "../types";
import { generateMockSports } from "../mockData";

export default function SportsModule() {
  const [weeklyHours, setWeeklyHours] = useState<number>(4);
  const [preferredType, setPreferredType] = useState<string>("Low-Impact Strength");
  const [intensity, setIntensity] = useState<"low" | "medium" | "high">("medium");

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SportsResult | null>(null);
  const [completedDays, setCompletedDays] = useState<string[]>([]);

  const workoutStyles = [
    { name: "Low-Impact Strength (低冲击阻力塑形)", desc: "Build muscular support for joints. Perfect for body strength." },
    { name: "Zumba & Cardio Dance (有氧曲线舞蹈)", desc: "Joyful cardio movement, flowing hips, high energy." },
    { name: "Restorative Yoga & Flow (拉伸伸展流瑜伽)", desc: "Release pressure from lower back and hips. Deep restoration." },
    { name: "Aquatics & Swimming (水中阻力运动)", desc: "Absolute gravity freedom. Excellent low-impact cardio." }
  ];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/sports/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weeklyHours,
          preferredType,
          intensity
        })
      });

      if (!response.ok) {
        throw new Error("Sports API failed");
      }

      const data = await response.json();
      if (data.isMock) {
        setResult(generateMockSports({ weeklyHours, preferredType, intensity }));
      } else {
        setResult(data);
      }
      setCompletedDays([]); // Reset completed days for new plan
    } catch (err) {
      console.warn("Sports API failed, calling offline model:", err);
      setResult(generateMockSports({ weeklyHours, preferredType, intensity }));
      setCompletedDays([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleDayCompletion = (day: string) => {
    if (completedDays.includes(day)) {
      setCompletedDays(completedDays.filter((d) => d !== day));
    } else {
      setCompletedDays([...completedDays, day]);
    }
  };

  return (
    <div id="sports-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-4">
      {/* LEFT COLUMN: SPORTS FORM (5 cols) */}
      <div className="lg:col-span-5 bg-white border border-[#1A1A1A] p-6 md:p-8 flex flex-col justify-between rounded-none relative">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1A1A1A]"></div>
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-6 h-[1px] bg-[#1A1A1A]"></span>
            <span className="font-mono text-[10px] tracking-widest text-[#1A1A1A] uppercase font-bold">Kinetic Input</span>
          </div>

          <h3 className="font-serif italic text-3xl text-[#1A1A1A] mb-4">
            Curvy Movement Hub
          </h3>
          <p className="text-stone-600 text-xs mb-6 font-sans leading-relaxed">
            Construct a joint-friendly, empowering workout plan tailored for curves. We move to celebrate our physical strength and mobility, not to shrink our space.
          </p>

          <div className="space-y-6 mb-8 pb-6 border-b border-stone-200">
            {/* Weekly Hours Availability */}
            <div>
              <div className="flex justify-between text-xs text-[#1A1A1A] font-mono mb-1">
                <span className="font-semibold uppercase tracking-wider">每周可用运动时间 (Hours / Week)</span>
                <span className="font-bold text-[#D64545]">{weeklyHours} 小时</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full h-1 bg-stone-200 appearance-none cursor-pointer accent-[#D64545] rounded-none"
                id="sports-hours-slider"
              />
            </div>

            {/* Workout Style */}
            <div>
              <label className="font-serif text-xs tracking-wide text-[#1A1A1A] block mb-2 uppercase font-bold">
                1. Preferred Kinetic Style
              </label>
              <div className="space-y-2">
                {workoutStyles.map((style) => (
                  <label
                    key={style.name}
                    className={`flex flex-col p-3 border rounded-none cursor-pointer transition-all ${
                      preferredType === style.name
                        ? "border-[#1A1A1A] bg-[#FFF0F3]"
                        : "border-stone-200 bg-white hover:border-[#1A1A1A]/50"
                    }`}
                    id={`sports-style-${style.name.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-xs font-semibold text-[#1A1A1A]">{style.name.split(" ")[0]}</span>
                      <input
                        type="radio"
                        name="workoutType"
                        value={style.name}
                        checked={preferredType === style.name}
                        onChange={() => setPreferredType(style.name)}
                        className="accent-[#1A1A1A]"
                      />
                    </div>
                    <span className="text-[10px] text-stone-500 mt-1 leading-normal">{style.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Intensity Level */}
            <div>
              <label className="font-serif text-xs tracking-wide text-[#1A1A1A] block mb-2 uppercase font-bold">
                2. Pace & Energy Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["low", "medium", "high"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setIntensity(lvl)}
                    className={`py-2 text-xs font-mono border rounded-none uppercase tracking-wider transition-all cursor-pointer ${
                      intensity === lvl
                        ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                        : "border-stone-200 bg-white text-stone-700 hover:border-[#1A1A1A]"
                    }`}
                    id={`sports-intensity-${lvl}`}
                  >
                    {lvl === "low" ? "Gentle" : lvl === "medium" ? "Moderate" : "Dynamic"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-4 bg-[#1A1A1A] text-white hover:bg-[#D64545] transition-colors font-mono uppercase tracking-[0.2em] text-xs font-bold flex items-center justify-center gap-2 rounded-none mt-4 cursor-pointer disabled:opacity-80"
          id="btn-generate-sports"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Calibrating Planner...</span>
            </>
          ) : (
            <>
              <Flame className="w-4 h-4 text-[#D64545]" />
              <span>Generate My Fitness Planner</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* RIGHT COLUMN: SPORTS SCHEDULE RESULTS (7 cols) */}
      <div className="lg:col-span-7 bg-[#FAF9F6] border border-[#1A1A1A] p-6 md:p-8 min-h-[500px] flex flex-col justify-center rounded-none">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center justify-center py-12"
              key="sports-loading"
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-none border-t border-b border-[#1A1A1A] animate-spin"></div>
                <Flame className="w-6 h-6 text-[#D64545] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="font-serif italic text-xl text-[#1A1A1A] mb-2">Assembling Kinetic Flow...</p>
              <p className="text-stone-600 text-xs font-mono max-w-sm">
                Engineering a joint-protective weekly calendar supporting your available {weeklyHours} hours with safe {preferredType.split(" ")[0]} patterns...
              </p>
            </motion.div>
          ) : result ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
              key="sports-results"
            >
              {/* Philosophy */}
              <div>
                <span className="font-serif text-[10px] tracking-[0.2em] text-[#D64545] uppercase block mb-1 font-bold">
                  I. Movement Philosophy
                </span>
                <p className="text-stone-700 text-sm leading-relaxed font-light">
                  {result.philosophy}
                </p>
              </div>

              {/* Weekly Interactive Schedule */}
              <div>
                <span className="font-serif text-[10px] tracking-[0.2em] text-[#1A1A1A] uppercase block mb-4 font-bold">
                  II. Custom Weekly Plan (Click to Check-Off)
                </span>
                <div className="space-y-3">
                  {result.weeklySchedule.map((item, idx) => {
                    const isCompleted = completedDays.includes(item.day);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleDayCompletion(item.day)}
                        className={`border p-4 transition-all cursor-pointer flex items-start gap-4 select-none rounded-none ${
                          isCompleted
                            ? "bg-stone-100/50 border-stone-200 opacity-60"
                            : "bg-white border-[#1A1A1A] hover:border-[#D64545]"
                        }`}
                        id={`sports-day-${idx}`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-[#D64545]" />
                          ) : (
                            <Circle className="w-5 h-5 text-stone-300 hover:text-[#D64545]" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap justify-between items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] font-bold text-stone-500 uppercase">{item.day}</span>
                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#D64545] font-bold">
                              <Clock className="w-3 h-3" />
                              <span>{item.duration}</span>
                            </div>
                          </div>
                          <h5 className={`font-serif text-sm font-semibold text-[#1A1A1A] ${isCompleted ? "line-through text-stone-400" : ""}`}>
                            {item.activity}
                          </h5>
                          <p className="text-stone-500 text-[11px] leading-relaxed mt-1">
                            {item.instructions}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Joint Protection Tips */}
              <div className="bg-white border border-[#1A1A1A] p-5 rounded-none">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-[#D64545]" />
                  <span className="font-serif text-[10px] tracking-[0.2em] text-[#D64545] uppercase block font-bold">
                    III. Joint Safety & Comfort Guidelines
                  </span>
                </div>
                <div className="space-y-3 pl-1">
                  {result.tips.map((tip, idx) => (
                    <p key={idx} className="text-stone-600 text-[11px] leading-relaxed">
                      {tip}
                    </p>
                  ))}
                </div>
              </div>

              {/* Kinetic Affirmation */}
              <div className="border-t border-[#1A1A1A]/10 pt-6 mt-6 text-center font-serif">
                <Quote className="w-8 h-8 text-[#D64545]/10 mx-auto mb-2" />
                <p className="text-stone-700 text-xs italic leading-relaxed px-6 max-w-lg mx-auto">
                  {result.affirmation}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center text-center justify-center py-12"
              key="sports-empty"
            >
              <div className="w-12 h-12 rounded-none bg-[#FFF0F3] flex items-center justify-center mb-4 border border-[#1A1A1A]">
                <Flame className="w-5 h-5 text-[#D64545]" />
              </div>
              <h4 className="font-serif italic text-lg text-[#1A1A1A] mb-1">Tailor Your Fitness Plan</h4>
              <p className="text-stone-600 text-xs max-w-xs font-sans leading-relaxed">
                Set your weekly workout hour limit and select your active movement style to reveal an interactive, knee-friendly workout calendar.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
