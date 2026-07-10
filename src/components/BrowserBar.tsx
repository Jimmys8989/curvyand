import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Lock, ShieldCheck } from "lucide-react";

interface BrowserBarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function BrowserBar({ currentPath, onNavigate }: BrowserBarProps) {
  const [canGoBack, setCanGoBack] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check if browser history has depth to enable back navigation
  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, [currentPath]);

  const handleBack = () => {
    window.history.back();
  };

  const handleForward = () => {
    window.history.forward();
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="w-full bg-[#1C1917] border-b border-neutral-800 px-4 py-2 flex items-center justify-between text-neutral-400 select-none font-sans text-xs">
      {/* Left: Traffic light window dots */}
      <div className="flex items-center space-x-1.5 w-1/4">
        <div className="h-3 w-3 rounded-full bg-[#FF5F56] opacity-90 hover:opacity-100 transition-opacity"></div>
        <div className="h-3 w-3 rounded-full bg-[#FFBD2E] opacity-90 hover:opacity-100 transition-opacity"></div>
        <div className="h-3 w-3 rounded-full bg-[#27C93F] opacity-90 hover:opacity-100 transition-opacity"></div>
        
        {/* Navigation Arrows */}
        <div className="hidden sm:flex items-center space-x-1 pl-4">
          <button 
            onClick={handleBack}
            className="p-1 rounded hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-neutral-400 hover:text-white" />
          </button>
          <button 
            onClick={handleForward}
            className="p-1 rounded hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
            title="Go Forward"
          >
            <ArrowRight className="h-3.5 w-3.5 text-neutral-400 hover:text-white" />
          </button>
          <button 
            onClick={handleRefresh}
            className={`p-1 rounded hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer ${isRefreshing ? 'animate-spin text-[#9E5A44]' : ''}`}
            title="Refresh Page"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Center: Beautiful domain & secure path address bar */}
      <div className="flex-1 max-w-xl">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1 flex items-center justify-between shadow-inner">
          <div className="flex items-center space-x-1.5 overflow-hidden w-full justify-center">
            <Lock className="h-3 w-3 text-emerald-500 shrink-0" />
            
            <div className="text-[11px] truncate select-all flex items-center tracking-tight font-mono">
              <span className="text-neutral-500 shrink-0">https://</span>
              <span className="text-neutral-200 font-medium shrink-0">www.curvyand.com</span>
              <span className="text-[#DFB7B0] font-semibold">{currentPath === "/" ? "" : currentPath}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 shrink-0 pl-2">
            <span className="hidden md:inline-flex items-center px-1 py-0.5 rounded text-[8px] font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-900/50">
              SECURE SSL
            </span>
          </div>
        </div>
      </div>

      {/* Right: Quick actions or indicator */}
      <div className="w-1/4 flex justify-end items-center space-x-2 text-[10px] font-mono tracking-wider">
        <div className="hidden md:flex items-center space-x-1 text-emerald-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>LIVE CLOUD</span>
        </div>
      </div>
    </div>
  );
}
