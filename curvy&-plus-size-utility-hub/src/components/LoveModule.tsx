import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, MapPin, Loader2, ArrowRight, BookOpen, Quote, ShieldCheck, HelpCircle } from "lucide-react";
import { LoveInput, LoveResult } from "../types";
import { generateMockLove } from "../mockData";

export default function LoveModule() {
  const [age, setAge] = useState<number>(27);
  const [location, setLocation] = useState<string>("Shanghai");
  const [intention, setIntention] = useState<"serious" | "casual">("serious");
  const [preferences, setPreferences] = useState<string>("Warm-hearted & Creative");

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<LoveResult | null>(null);
  const [activeStoryIdx, setActiveStoryIdx] = useState<number>(0);

  // Curated plus-size love stories
  const loveStories = [
    {
      names: "Chloe & Tyler",
      role: "Art Gallery Romance / Shanghai",
      text: "Chloe, an elegant大码插画师 from Shanghai, always felt hesitant on mainstream dating apps, feeling pressured to only post face-only crop photos. When she joined WooPlus, she uploaded full-length photos, proud of her curves. There she met Tyler, a landscape architect who swiped instantly, enchanted by her radiant energy. They connected over a shared love for modern sculpture. Today, they are happily married, living in a light-filled loft, proving that when you show up as your authentic self, genuine love arrives.",
      quote: "“WooPlus gave me the safety to stop apologizing for my size. Tyler fell in love with my presence, not a pixelated mask.”"
    },
    {
      names: "Mia & Sean",
      role: "Handmade Ceramic Magic / Beijing",
      text: "Mia, a vibrant plus-size product manager from Beijing, decided to delete apps that made her feel invisible. She joined WooPlus and updated her bio: 'Art, curves, and high gastronomy.' Sean, an artisanal coffee roaster, was drawn to her fierce confidence. Their first date was a messy, laughter-filled pottery workshop. Three years later, they own a boutique coffee-and-clay studio together.",
      quote: "“The moment I owned my curves, the universe sent me someone who cherished every single one of them.”"
    },
    {
      names: "Aisha & Julien",
      role: "Parisian Literature / Paris",
      text: "Aisha, an independent plus-size writer, found her soulmate in Julien, a French head baker, on WooPlus. He adored her literature blogs and her unapologetic Parisian chic style. Their dates consisted of midnight walks along the Seine and hot croissants at dawn. Today, they collaborate on a popular cookbook and culinary blog.",
      quote: "“Your size is the canvas of your life—dress it in passion, and the right partner will read you like poetry.”"
    }
  ];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/love/dating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age,
          location,
          intention,
          preferences
        })
      });

      if (!response.ok) {
        throw new Error("Dating API failed");
      }

      const data = await response.json();
      if (data.isMock) {
        setResult(generateMockLove({ age, location, intention, preferences }));
      } else {
        setResult(data);
      }
    } catch (err) {
      console.warn("Love API failed, calling offline model:", err);
      setResult(generateMockLove({ age, location, intention, preferences }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="love-section" className="space-y-12 py-4">
      {/* SECTION 1: INSPIRING LOVE STORIES CAROUSEL */}
      <div className="bg-white border border-[#1A1A1A] p-6 md:p-8 rounded-none">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-4 h-4 text-[#D64545]" />
          <span className="font-mono text-[10px] tracking-widest text-[#1A1A1A] uppercase font-bold">Featured Love Stories</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Stories list toggles */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-serif italic text-2xl text-[#1A1A1A] mb-4">
              Curvy Love Stories
            </h3>
            {loveStories.map((story, idx) => (
              <button
                key={story.names}
                onClick={() => setActiveStoryIdx(idx)}
                className={`w-full text-left p-4 transition-all border rounded-none cursor-pointer flex flex-col ${
                  activeStoryIdx === idx
                    ? "border-[#1A1A1A] bg-[#FFF0F3]"
                    : "border-stone-200 hover:border-[#1A1A1A]/60"
                }`}
                id={`btn-love-story-${idx}`}
              >
                <span className="font-serif font-semibold text-sm text-[#1A1A1A]">{story.names}</span>
                <span className="text-[10px] text-stone-500 font-mono mt-0.5">{story.role}</span>
              </button>
            ))}
          </div>

          {/* Active Story Reader */}
          <div className="lg:col-span-8 bg-[#FAF9F6] border border-[#1A1A1A] p-6 relative flex flex-col justify-between min-h-[250px] rounded-none">
            <Quote className="w-16 h-16 text-[#D64545]/10 absolute top-4 right-4" />
            <div>
              <p className="text-stone-700 text-xs md:text-sm leading-relaxed mb-6 font-sans font-light">
                {loveStories[activeStoryIdx].text}
              </p>
            </div>
            <div className="border-t border-[#1A1A1A]/10 pt-4">
              <p className="font-serif italic text-[#D64545] text-xs md:text-sm pl-4 border-l-2 border-[#D64545]">
                {loveStories[activeStoryIdx].quote}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: DATING MATCHER WIZARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Matcher Form (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#1A1A1A] p-6 md:p-8 flex flex-col justify-between rounded-none relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1A1A1A]"></div>
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-6 h-[1px] bg-[#1A1A1A]"></span>
              <span className="font-mono text-[10px] tracking-widest text-[#1A1A1A] uppercase font-bold">Dating Matcher</span>
            </div>

            <h3 className="font-serif italic text-3xl text-[#1A1A1A] mb-4">
              Love & Connection Blueprint
            </h3>
            <p className="text-stone-600 text-xs mb-6 font-sans leading-relaxed">
              Design your premium dating strategy. Input your preferences to generate WooPlus custom profile optimization, photo guidelines, high-vibe icebreakers, and regional date itineraries.
            </p>

            <div className="space-y-6 mb-8 pb-6 border-b border-stone-200">
              {/* Age */}
              <div>
                <div className="flex justify-between text-xs text-[#1A1A1A] font-mono mb-1">
                  <span className="font-semibold uppercase tracking-wider">您的年龄 (Age)</span>
                  <span className="font-bold text-[#D64545]">{age} 年轻</span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="65"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full h-1 bg-stone-200 appearance-none cursor-pointer accent-[#D64545] rounded-none"
                  id="love-age-slider"
                />
              </div>

              {/* Location */}
              <div>
                <label className="font-serif text-xs tracking-wide text-[#1A1A1A] block mb-1 uppercase font-bold">
                  所在城市/地区 (Location / Region)
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Shanghai, Beijing, Chengdu"
                    className="w-full text-xs font-sans border border-[#1A1A1A] pl-9 pr-4 py-2.5 bg-white outline-none rounded-none focus:border-[#D64545]"
                    id="love-location-input"
                  />
                </div>
              </div>

              {/* Intention */}
              <div>
                <label className="font-serif text-xs tracking-wide text-[#1A1A1A] block mb-2 uppercase font-bold">
                  寻觅的关系类型 (Dating Intention)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setIntention("serious")}
                    className={`py-3 text-xs font-mono border rounded-none transition-all cursor-pointer ${
                      intention === "serious"
                        ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                        : "border-stone-200 bg-white text-stone-700 hover:border-[#1A1A1A]"
                    }`}
                    id="btn-intention-serious"
                  >
                    Serious Romance
                  </button>
                  <button
                    type="button"
                    onClick={() => setIntention("casual")}
                    className={`py-3 text-xs font-mono border rounded-none transition-all cursor-pointer ${
                      intention === "casual"
                        ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                        : "border-stone-200 bg-white text-stone-700 hover:border-[#1A1A1A]"
                    }`}
                    id="btn-intention-casual"
                  >
                    Casual & Fun
                  </button>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <label className="font-serif text-xs tracking-wide text-[#1A1A1A] block mb-1 uppercase font-bold">
                  期望的伴侣特质 (Partner Trait Preference)
                </label>
                <select
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  className="w-full text-xs font-sans border border-[#1A1A1A] p-2.5 bg-white rounded-none outline-none focus:border-[#D64545]"
                  id="partner-traits-select"
                >
                  <option value="Warm-hearted & Creative (温暖随和、富有艺术气息)">Warm-hearted & Creative</option>
                  <option value="Confident & Outgoing (自信开朗、幽默大方)">Confident & Outgoing</option>
                  <option value="Intellectual & Refined (知性理智、有深度)">Intellectual & Refined</option>
                  <option value="Adventurous & Athletic (热爱探险、活力满满)">Adventurous & Athletic</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-4 bg-[#1A1A1A] text-white hover:bg-[#D64545] transition-colors font-mono uppercase tracking-[0.2em] text-xs font-bold flex items-center justify-center gap-2 rounded-none mt-4 cursor-pointer disabled:opacity-80"
            id="btn-generate-dating"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Consulting Matchmaker...</span>
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 text-[#D64545]" />
                <span>Generate Love Strategy</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Matcher Results (7 cols) */}
        <div className="lg:col-span-7 bg-[#FAF9F6] border border-[#1A1A1A] p-6 md:p-8 min-h-[500px] flex flex-col justify-center rounded-none">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center justify-center py-12"
                key="love-loading"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-none border-t border-b border-[#1A1A1A] animate-spin"></div>
                  <Heart className="w-6 h-6 text-[#D64545] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="font-serif italic text-xl text-[#1A1A1A] mb-2">Designing Love Alignment...</p>
                <p className="text-stone-600 text-xs font-mono max-w-sm">
                  Reviewing WooPlus data metrics for {location} & tailoring profile assets for relationship type: {intention === "serious" ? "Serious Romance" : "Casual Exploration"}...
                </p>
              </motion.div>
            ) : result ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
                key="love-results"
              >
                {/* Intro */}
                <div>
                  <span className="font-serif text-[10px] tracking-[0.2em] text-[#D64545] uppercase block mb-1 font-bold">
                    I. Romantic Horizon
                  </span>
                  <p className="text-stone-700 text-sm leading-relaxed font-light">
                    {result.introduction}
                  </p>
                </div>

                {/* WooPlus spotlight - Highlighted Box */}
                <div className="bg-[#FFF0F3] border border-[#1A1A1A] p-5 md:p-6 relative overflow-hidden rounded-none">
                  <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-[0.03]">
                    <Heart className="w-64 h-64 text-[#D64545]" />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-5 h-5 text-[#D64545]" />
                    <h4 className="font-serif font-bold text-sm text-[#1A1A1A] uppercase tracking-wider">
                      Premium Platform Recommendation: WooPlus
                    </h4>
                  </div>
                  <p className="text-stone-700 text-xs leading-relaxed mb-4">
                    {result.whyWooPlus}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-[9px] font-mono uppercase bg-white border border-[#1A1A1A]/10 text-[#D64545] font-bold px-2 py-1">
                      Anti-Body-Shaming Space
                    </span>
                    <span className="text-[9px] font-mono uppercase bg-white border border-[#1A1A1A]/10 text-[#D64545] font-bold px-2 py-1">
                      Empowered Full-Body Profiles
                    </span>
                    <span className="text-[9px] font-mono uppercase bg-white border border-[#1A1A1A]/10 text-[#D64545] font-bold px-2 py-1">
                      Curvy-Proud Matches
                    </span>
                  </div>
                  <a
                    href="https://www.wooplus.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 py-2.5 px-5 bg-[#1A1A1A] text-white text-xs font-mono hover:bg-[#D64545] transition-colors rounded-none uppercase tracking-wider cursor-pointer"
                    id="wooplus-link"
                  >
                    <span>Download & Join WooPlus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Profile optimization advice */}
                <div>
                  <span className="font-serif text-[10px] tracking-[0.2em] text-[#1A1A1A] uppercase block mb-3 font-bold">
                    II. WooPlus Profile Blueprint
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tagline & photo */}
                    <div className="bg-white border border-[#1A1A1A] p-4 space-y-3 rounded-none">
                      <div>
                        <span className="text-[9px] font-mono text-stone-400 block mb-1 font-bold">PRO BIO TAGLINE</span>
                        <p className="font-serif italic text-xs text-[#1A1A1A] leading-relaxed">
                          {result.profileTips.tagline}
                        </p>
                      </div>
                      <div className="border-t border-stone-200 pt-3">
                        <span className="text-[9px] font-mono text-stone-400 block mb-1 font-bold">PRO PHOTOGRAPHY ADVICE</span>
                        <p className="text-stone-600 text-[11px] leading-relaxed">
                          {result.profileTips.photoAdvice}
                        </p>
                      </div>
                    </div>

                    {/* Icebreakers */}
                    <div className="bg-white border border-[#1A1A1A] p-4 rounded-none">
                      <span className="text-[9px] font-mono text-stone-400 block mb-2 font-bold">ENGAGING ICEBREAKERS</span>
                      <ul className="space-y-2">
                        {result.profileTips.icebreakers.map((ice, idx) => (
                          <li key={idx} className="text-[11px] text-stone-600 pl-3 border-l border-[#D64545] py-0.5 leading-relaxed">
                            {ice}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Date Itinerary */}
                <div>
                  <span className="font-serif text-[10px] tracking-[0.2em] text-[#1A1A1A] uppercase block mb-3 font-bold">
                    III. Bespoke First Date Itineraries ({location})
                  </span>
                  <div className="space-y-3">
                    {result.dateIdeas.map((idea, idx) => (
                      <div key={idx} className="bg-white border border-[#1A1A1A] p-4 flex flex-col justify-between rounded-none">
                        <div className="flex justify-between items-start gap-4">
                          <h5 className="font-serif font-semibold text-xs text-[#1A1A1A] mb-1">{idea.title}</h5>
                          <span className="text-[9px] font-mono uppercase bg-stone-100 border border-stone-200 px-1.5 py-0.5 text-stone-500 rounded-none shrink-0">{idea.vibe}</span>
                        </div>
                        <p className="text-stone-600 text-[11px] leading-relaxed mt-1">{idea.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Empowerment Quote */}
                <div className="border-t border-[#1A1A1A]/10 pt-6 mt-6 text-center font-serif">
                  <p className="text-[#D64545] text-xs italic leading-relaxed px-6 max-w-lg mx-auto font-bold">
                    {result.empowermentQuote}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center text-center justify-center py-12"
                key="love-empty"
              >
                <div className="w-12 h-12 rounded-none bg-[#FFF0F3] flex items-center justify-center mb-4 border border-[#1A1A1A]">
                  <Heart className="w-5 h-5 text-[#D64545]" />
                </div>
                <h4 className="font-serif italic text-lg text-[#1A1A1A] mb-1">Tailor Your Dating Blueprint</h4>
                <p className="text-stone-600 text-xs max-w-xs font-sans leading-relaxed">
                  Configure your profile goals above and click generate to access custom WooPlus profile tips, icebreakers, and romantic itineraries.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
