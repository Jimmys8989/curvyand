import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Heart, Flame, Apple, HelpCircle, Layers, ArrowRight, Instagram, Mail, Globe, AlertCircle } from "lucide-react";
import Header from "./components/Header";
import FashionModule from "./components/FashionModule";
import LoveModule from "./components/LoveModule";
import SportsModule from "./components/SportsModule";
import HealthModule from "./components/HealthModule";

type ActiveTab = "fashion" | "love" | "sports" | "health";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("fashion");
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");
  const [subscribed, setSubscribed] = useState<boolean>(false);

  // Smooth scroll to tool container on tab change
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    const element = document.getElementById("module-container");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] font-sans antialiased selection:bg-[#D64545] selection:text-white pb-12">
      {/* Editorial Header */}
      <Header />

      {/* Hero Visual Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-12">
        <div className="border border-[#1A1A1A] bg-[#FAF9F6] p-6 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 rounded-none">
          {/* Decorative element resembling a magazine fold */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-stone-200/50 to-transparent pointer-events-none"></div>
          
          <div className="max-w-xl space-y-4">
            <span className="font-mono text-[9px] uppercase tracking-widest text-white font-bold bg-[#1A1A1A] px-2.5 py-1">
              Editorial Studio Concept
            </span>
            <h2 className="font-serif italic text-3xl md:text-5xl text-[#1A1A1A] leading-tight">
              Bespoke utility tools designed for <span className="underline decoration-[#D64545] underline-offset-4">curvy confidence</span>.
            </h2>
            <p className="text-stone-600 text-xs md:text-sm leading-relaxed">
              Mainstream apps demand plus-size individuals to shrink or hide. At Curvy&, we design engines to help you expand, celebrate, and nourish. Select a studio module below to design your lifestyle playbook.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0 flex flex-col gap-2">
            <div className="bg-white border border-[#1A1A1A] p-5 max-w-sm rounded-none">
              <span className="font-mono text-[9px] uppercase text-[#1A1A1A] font-bold block mb-2 tracking-widest border-b border-stone-200 pb-1">Toolkit Features</span>
              <ul className="space-y-1.5 font-sans text-xs text-stone-700">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#D64545] rounded-full"></span>
                  <span><strong>Fashion</strong>: Multi-proportional outfit generator</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#D64545] rounded-full"></span>
                  <span><strong>Love</strong>: Safety-first dating app planner</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#1A1A1A] rounded-full"></span>
                  <span><strong>Sports</strong>: Knee & Joint protective weekly fitness</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#D64545] rounded-full"></span>
                  <span><strong>Health</strong>: Anti-inflammatory, non-deprivation meals</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Module Bento Selector */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-12">
        <h3 className="font-serif italic text-lg text-stone-600 tracking-wider mb-4 uppercase text-center md:text-left">
          Select A Bespoke Studio Panel
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tab 1: Fashion */}
          <button
            onClick={() => handleTabChange("fashion")}
            className={`text-left p-6 border transition-all cursor-pointer relative flex flex-col justify-between h-44 group rounded-none ${
              activeTab === "fashion"
                ? "bg-white border-[#1A1A1A] shadow-none"
                : "bg-white/80 border-stone-200 hover:border-[#1A1A1A]/60"
            }`}
            id="tab-btn-fashion"
          >
            {activeTab === "fashion" && (
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#D64545]"></div>
            )}
            <div className="flex justify-between items-start w-full">
              <span className="font-mono text-xs text-stone-400">01 / STYLING</span>
              <span className="text-[10px] bg-[#1A1A1A] text-white px-2 py-0.5 font-bold font-mono">01</span>
            </div>
            <div>
              <h4 className="font-serif italic text-xl text-[#1A1A1A]">Fashion</h4>
              <p className="text-[10px] text-stone-500 font-sans mt-1">智能穿搭与版型搭配</p>
            </div>
          </button>

          {/* Tab 2: Love - styled with delicate pink from Design HTML */}
          <button
            onClick={() => handleTabChange("love")}
            className={`text-left p-6 border transition-all cursor-pointer relative flex flex-col justify-between h-44 group rounded-none ${
              activeTab === "love"
                ? "bg-[#FFF0F3] border-[#1A1A1A] shadow-none"
                : "bg-white/80 border-stone-200 hover:border-[#1A1A1A]/60"
            }`}
            id="tab-btn-love"
          >
            {activeTab === "love" && (
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#1A1A1A]"></div>
            )}
            <div className="flex justify-between items-start w-full">
              <span className="font-mono text-xs text-stone-400">02 / STORIES & DATING</span>
              <span className="text-[10px] bg-[#D64545] text-white px-2 py-0.5 font-bold font-mono">02</span>
            </div>
            <div>
              <h4 className="font-serif italic text-xl text-[#1A1A1A]">Love & Match</h4>
              <p className="text-[10px] text-stone-500 font-sans mt-1">大码情缘与WooPlus约会规划</p>
            </div>
          </button>

          {/* Tab 3: Sports */}
          <button
            onClick={() => handleTabChange("sports")}
            className={`text-left p-6 border transition-all cursor-pointer relative flex flex-col justify-between h-44 group rounded-none ${
              activeTab === "sports"
                ? "bg-white border-[#1A1A1A] shadow-none"
                : "bg-white/80 border-stone-200 hover:border-[#1A1A1A]/60"
            }`}
            id="tab-btn-sports"
          >
            {activeTab === "sports" && (
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#1A1A1A]"></div>
            )}
            <div className="flex justify-between items-start w-full">
              <span className="font-mono text-xs text-stone-400">03 / STRENGTH & MOVEMENT</span>
              <span className="text-[10px] bg-[#1A1A1A] text-white px-2 py-0.5 font-bold font-mono">03</span>
            </div>
            <div>
              <h4 className="font-serif italic text-xl text-[#1A1A1A]">Sports & Workout</h4>
              <p className="text-[10px] text-stone-500 font-sans mt-1">骨骼关节友好型律动表</p>
            </div>
          </button>

          {/* Tab 4: Health */}
          <button
            onClick={() => handleTabChange("health")}
            className={`text-left p-6 border transition-all cursor-pointer relative flex flex-col justify-between h-44 group rounded-none ${
              activeTab === "health"
                ? "bg-white border-[#1A1A1A] shadow-none"
                : "bg-white/80 border-stone-200 hover:border-[#1A1A1A]/60"
            }`}
            id="tab-btn-health"
          >
            {activeTab === "health" && (
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#D64545]"></div>
            )}
            <div className="flex justify-between items-start w-full">
              <span className="font-mono text-xs text-stone-400">04 / CULINARY NOURISH</span>
              <span className="text-[10px] bg-[#1A1A1A] text-white px-2 py-0.5 font-bold font-mono">04</span>
            </div>
            <div>
              <h4 className="font-serif italic text-xl text-[#1A1A1A]">Health & Recipes</h4>
              <p className="text-[10px] text-stone-500 font-sans mt-1">温和防炎身体活素食单</p>
            </div>
          </button>
        </div>
      </section>

      {/* Core Interactive Module Canvas */}
      <section id="module-container" className="max-w-7xl mx-auto px-4 md:px-8 mb-16 scroll-mt-6">
        <div className="p-1 md:p-3 border border-[#1A1A1A] bg-[#FAF9F6] rounded-none">
          <AnimatePresence mode="wait">
            {activeTab === "fashion" && (
              <motion.div
                key="fashion"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <FashionModule />
              </motion.div>
            )}

            {activeTab === "love" && (
              <motion.div
                key="love"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <LoveModule />
              </motion.div>
            )}

            {activeTab === "sports" && (
              <motion.div
                key="sports"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <SportsModule />
              </motion.div>
            )}

            {activeTab === "health" && (
              <motion.div
                key="health"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <HealthModule />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Curvy Community Empowerment Quote bar */}
      <section className="bg-[#1A1A1A] text-[#FAF9F6] py-16 px-4 md:px-8 text-center border-t border-b border-[#1A1A1A] rounded-none">
        <div className="max-w-4xl mx-auto space-y-6">
          <Layers className="w-8 h-8 mx-auto text-[#D64545] opacity-90" />
          <h3 className="font-serif italic text-3xl md:text-5xl font-light leading-snug">
            “Couture is about proportions, strength, and presence. Do not shrink yourself to fit the clothes; design your life to hold your curves.”
          </h3>
          <div className="flex justify-center items-center gap-3 text-stone-400 font-mono text-[10px] uppercase tracking-widest">
            <span>Curvy& Editorial manifesto</span>
            <span className="w-1 bg-[#FAF9F6]/20 h-3"></span>
            <span>Est. 2026</span>
          </div>
        </div>
      </section>

      {/* Elegant Editorial Footer */}
      <footer className="border-t border-[#1A1A1A] mt-16 pt-16 pb-12 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Left Brand block */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-serif italic font-bold tracking-widest text-3xl text-[#1A1A1A] uppercase">
              Curvy<span className="text-[#D64545] font-normal not-italic">&</span>
            </h4>
            <p className="text-stone-600 text-xs leading-relaxed font-sans max-w-sm">
              We stand at the intersection of haute-couture aesthetics and plus-size life engineering. Our mission is to supply modern digital toolkits that empower, validate, and nurture curvy women worldwide.
            </p>
            <div className="flex gap-4 pt-2 text-stone-600">
              <a href="#" className="hover:text-[#D64545] transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="mailto:contact@curvyand.com" className="hover:text-[#D64545] transition-colors" aria-label="Email">
                <Mail className="w-4 h-4" />
              </a>
              <a href="https://www.wooplus.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#D64545] transition-colors" title="WooPlus Partner Partner">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Center navigation links */}
          <div className="md:col-span-4 grid grid-cols-2 gap-8 font-mono text-[11px] uppercase tracking-wider text-stone-700">
            <div className="space-y-3">
              <h5 className="font-bold text-[#1A1A1A] mb-1">Modules</h5>
              <button onClick={() => handleTabChange("fashion")} className="block hover:text-[#D64545] cursor-pointer text-left">Fashion Atelier</button>
              <button onClick={() => handleTabChange("love")} className="block hover:text-[#D64545] cursor-pointer text-left">Love Storyteller</button>
              <button onClick={() => handleTabChange("sports")} className="block hover:text-[#1A1A1A] cursor-pointer text-left">Fitness Studio</button>
              <button onClick={() => handleTabChange("health")} className="block hover:text-[#D64545] cursor-pointer text-left">Nourish Kitchen</button>
            </div>
            <div className="space-y-3">
              <h5 className="font-bold text-[#1A1A1A] mb-1">Partners & Links</h5>
              <a href="https://www.wooplus.com" target="_blank" rel="noopener noreferrer" className="block hover:text-[#D64545]">WooPlus Dating</a>
              <a href="https://www.eloquii.com" target="_blank" rel="noopener noreferrer" className="block hover:text-[#D64545]">Eloquii Fashion</a>
              <a href="https://www.asos.com" target="_blank" rel="noopener noreferrer" className="block hover:text-[#D64545]">ASOS Curve</a>
              <a href="#" className="block hover:text-stone-500">Editorial Guidelines</a>
            </div>
          </div>

          {/* Right Newsletter signup block */}
          <div className="md:col-span-4 space-y-4">
            <h5 className="font-serif text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
              Subscribe to Curvy& Editorial
            </h5>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              Get weekly plus-size styling tips, body-proud dating strategies, low-impact exercise schedules, and cell-loving recipes directly from our Vogue editors.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="flex border border-[#1A1A1A] bg-white p-1">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="vogue-reader@email.com"
                  className="bg-transparent text-xs px-2.5 py-1.5 outline-none flex-1 font-sans text-[#1A1A1A]"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#1A1A1A] text-white hover:bg-[#D64545] text-xs px-4 py-1.5 font-serif uppercase tracking-wider transition-all cursor-pointer"
                >
                  Join
                </button>
              </div>
              {subscribed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] text-[#D64545] font-mono flex items-center gap-1"
                >
                  <span>✨ Thank you! Welcome to the editorial list.</span>
                </motion.div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-6 border-t border-[#1A1A1A]/10 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-stone-500 gap-4">
          <span>© 2026 Curvy& Digital Magazine. Beijing / London / New York. All Rights Reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
