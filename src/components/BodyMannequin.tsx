import React from "react";

interface BodyMannequinProps {
  bust: number;
  waist: number;
  hips: number;
  height: number;
  unit: "in" | "cm";
  activeField?: "bust" | "waist" | "hips" | "height" | null;
  onSelectField?: (field: "bust" | "waist" | "hips" | "height" | null) => void;
}

export default function BodyMannequin({
  bust,
  waist,
  hips,
  height,
  unit,
  activeField = null,
  onSelectField,
}: BodyMannequinProps) {
  const isInch = unit === "in";
  
  // Calculate visual ratios for curve modeling (norm 0.0 to 1.0)
  const bustPercent = isInch ? (bust - 30) / 45 : (bust - 76) / 114;
  const waistPercent = isInch ? (waist - 22) / 48 : (waist - 55) / 123;
  const hipsPercent = isInch ? (hips - 34) / 51 : (hips - 86) / 130;

  // Horizontal radii scale based on measurements (adjusted to be beautifully curvy and plus-size inclusive)
  const bustRx = 32 + Math.max(0, Math.min(1, bustPercent)) * 26;
  const waistRx = 26 + Math.max(0, Math.min(1, waistPercent)) * 22;
  const hipsRx = 38 + Math.max(0, Math.min(1, hipsPercent)) * 28;

  // Dynamic body silhouette outline coordinates that scale beautifully with the measurements
  const leftShoulderX = 100 - (26 + bustRx * 0.15);
  const rightShoulderX = 100 + (26 + bustRx * 0.15);

  const leftBustX = 100 - bustRx;
  const rightBustX = 100 + bustRx;

  const leftWaistX = 100 - waistRx;
  const rightWaistX = 100 + waistRx;

  const leftHipsX = 100 - hipsRx;
  const rightHipsX = 100 + hipsRx;

  // Curvier legs & ankles that scale with hips for a healthy, beautifully proportioned plus-size curve model
  const leftLegThighX = 100 - (hipsRx * 0.82);
  const rightLegThighX = 100 + (hipsRx * 0.82);

  const leftAnkleX = 100 - (hipsRx * 0.52);
  const rightAnkleX = 100 + (hipsRx * 0.52);

  const leftInnerLegX = 100 - (hipsRx * 0.16);
  const rightInnerLegX = 100 + (hipsRx * 0.16);

  // Flattened perspective depth
  const bustRy = 7;
  const waistRy = 6;
  const hipsRy = 8;

  // Calculate height ratio (normalized 0.0 to 1.0)
  // height ranges from 55 to 80 inches (or 140 to 203 cm)
  const heightPercent = isInch ? (height - 55) / 25 : (height - 140) / 63;
  const heightClamped = Math.max(0, Math.min(1, heightPercent));

  // Heights on canvas coordinate Y dynamically adjusted by height slider
  const headTopY = 25;
  const neckY = headTopY + 10 * (0.8 + heightClamped * 0.4);
  const shoulderY = neckY + 13 * (0.8 + heightClamped * 0.4);
  const bustY = shoulderY + 37 * (0.85 + heightClamped * 0.3);
  const waistY = bustY + 40 * (0.85 + heightClamped * 0.3);
  const hipsY = waistY + 43 * (0.85 + heightClamped * 0.3);
  const crotchY = hipsY + 12 * (0.8 + heightClamped * 0.4);
  const ankleY = crotchY + 55 * (0.7 + heightClamped * 0.6);

  // Interactive focus handler
  const handleSelect = (field: "bust" | "waist" | "hips" | "height") => {
    if (onSelectField) {
      onSelectField(field === activeField ? null : field);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#FAF8F5] border border-neutral-200/60 rounded-3xl p-5 shadow-xs h-full relative overflow-hidden select-none">
      {/* High-fashion minimal tag */}
      <span className="absolute top-3 left-4 font-mono text-[9px] text-[#9E5A44] tracking-widest uppercase font-black">
        COUTURE DIAL
      </span>

      <svg
         viewBox="0 0 200 250"
         className="w-full max-w-[210px] h-auto drop-shadow-3xs transition-all duration-300"
      >
        <defs>
          <linearGradient id="mannequinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F5EFE7" />
            <stop offset="100%" stopColor="#EAD8CE" />
          </linearGradient>

          <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. BACK HALVES of 3D measuring tape rings (behind body) */}
        {/* Back Bust */}
        <path
          d={`M ${100 - bustRx} ${bustY} A ${bustRx} ${bustRy} 0 0 1 ${100 + bustRx} ${bustY}`}
          fill="none"
          stroke={activeField === "bust" ? "#EAD8CE" : "#E5DFD6"}
          strokeWidth="1.5"
          strokeDasharray="2.5 2.5"
          className="transition-all duration-300"
        />

        {/* Back Waist */}
        <path
          d={`M ${100 - waistRx} ${waistY} A ${waistRx} ${waistRy} 0 0 1 ${100 + waistRx} ${waistY}`}
          fill="none"
          stroke={activeField === "waist" ? "#EAD8CE" : "#E5DFD6"}
          strokeWidth="1.5"
          strokeDasharray="2.5 2.5"
          className="transition-all duration-300"
        />

        {/* Back Hips */}
        <path
          d={`M ${100 - hipsRx} ${hipsY} A ${hipsRx} ${hipsRy} 0 0 1 ${100 + hipsRx} ${hipsY}`}
          fill="none"
          stroke={activeField === "hips" ? "#EAD8CE" : "#E5DFD6"}
          strokeWidth="1.5"
          strokeDasharray="2.5 2.5"
          className="transition-all duration-300"
        />


        {/* 2. Main Silhouette Outline (Middle Layer - fully dynamic curvy outline) */}
        <path
          d={`M ${leftShoulderX} ${shoulderY} C ${leftShoulderX} ${shoulderY + 8}, ${leftBustX} ${bustY - 15}, ${leftBustX} ${bustY} C ${leftBustX} ${bustY + 15}, ${leftWaistX} ${waistY - 15}, ${leftWaistX} ${waistY} C ${leftWaistX} ${waistY + 10}, ${leftHipsX} ${hipsY - 18}, ${leftHipsX} ${hipsY} C ${leftHipsX} ${hipsY + 17}, ${leftLegThighX} ${ankleY - 25}, ${leftAnkleX} ${ankleY} L ${leftInnerLegX} ${ankleY} L 97 ${crotchY} L 100 ${crotchY} L 103 ${crotchY} L ${rightInnerLegX} ${ankleY} L ${rightAnkleX} ${ankleY} C ${rightLegThighX} ${ankleY - 25}, ${rightHipsX} ${hipsY + 17}, ${rightHipsX} ${hipsY} C ${rightHipsX} ${hipsY - 18}, ${rightWaistX} ${waistY + 10}, ${rightWaistX} ${waistY} C ${rightWaistX} ${waistY - 15}, ${rightBustX} ${bustY + 15}, ${rightBustX} ${bustY} C ${rightBustX} ${bustY - 15}, ${rightShoulderX} ${shoulderY + 8}, ${rightShoulderX} ${shoulderY} Q 100 ${neckY - 3}, ${leftShoulderX} ${shoulderY} Z`}
          fill="url(#mannequinGrad)"
          stroke="#DFB7B0"
          strokeWidth="1.2"
          className="transition-all duration-500 opacity-90"
        />


        {/* 3. FRONT HALVES of 3D measuring tape rings (wraps in front of body) */}
        {/* Front Bust */}
        <g 
          className="cursor-pointer group" 
          onClick={() => handleSelect("bust")}
        >
          {/* Invisible thicker path to make hovering/clicking easier */}
          <path
            d={`M ${100 - bustRx} ${bustY} A ${bustRx} ${bustRy} 0 0 0 ${100 + bustRx} ${bustY}`}
            fill="none"
            stroke="transparent"
            strokeWidth="10"
          />
          <path
            d={`M ${100 - bustRx} ${bustY} A ${bustRx} ${bustRy} 0 0 0 ${100 + bustRx} ${bustY}`}
            fill="none"
            stroke={activeField === "bust" ? "#9E5A44" : "#C7B3A3"}
            strokeWidth={activeField === "bust" ? "3" : "1.8"}
            className="transition-all duration-300"
            filter={activeField === "bust" ? "url(#subtleGlow)" : ""}
          />
          {/* Miniature tick marks on the tape measure ring front half */}
          <path
            d={`M ${100 - bustRx} ${bustY} A ${bustRx} ${bustRy} 0 0 0 ${100 + bustRx} ${bustY}`}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeDasharray="1 3"
            className="opacity-70"
          />
          <circle
            cx={100 + bustRx}
            cy={bustY}
            r={activeField === "bust" ? "5" : "3.5"}
            fill={activeField === "bust" ? "#9E5A44" : "#FFFFFF"}
            stroke="#9E5A44"
            strokeWidth="1.5"
            className="transition-all duration-300 shadow-sm"
          />
        </g>

        {/* Front Waist */}
        <g 
          className="cursor-pointer group" 
          onClick={() => handleSelect("waist")}
        >
          <path
            d={`M ${100 - waistRx} ${waistY} A ${waistRx} ${waistRy} 0 0 0 ${100 + waistRx} ${waistY}`}
            fill="none"
            stroke="transparent"
            strokeWidth="10"
          />
          <path
            d={`M ${100 - waistRx} ${waistY} A ${waistRx} ${waistRy} 0 0 0 ${100 + waistRx} ${waistY}`}
            fill="none"
            stroke={activeField === "waist" ? "#9E5A44" : "#C7B3A3"}
            strokeWidth={activeField === "waist" ? "3" : "1.8"}
            className="transition-all duration-300"
            filter={activeField === "waist" ? "url(#subtleGlow)" : ""}
          />
          <path
            d={`M ${100 - waistRx} ${waistY} A ${waistRx} ${waistRy} 0 0 0 ${100 + waistRx} ${waistY}`}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeDasharray="1 3"
            className="opacity-70"
          />
          <circle
            cx={100 + waistRx}
            cy={waistY}
            r={activeField === "waist" ? "5" : "3.5"}
            fill={activeField === "waist" ? "#9E5A44" : "#FFFFFF"}
            stroke="#9E5A44"
            strokeWidth="1.5"
            className="transition-all duration-300 shadow-sm"
          />
        </g>

        {/* Front Hips */}
        <g 
          className="cursor-pointer group" 
          onClick={() => handleSelect("hips")}
        >
          <path
            d={`M ${100 - hipsRx} ${hipsY} A ${hipsRx} ${hipsRy} 0 0 0 ${100 + hipsRx} ${hipsY}`}
            fill="none"
            stroke="transparent"
            strokeWidth="10"
          />
          <path
            d={`M ${100 - hipsRx} ${hipsY} A ${hipsRx} ${hipsRy} 0 0 0 ${100 + hipsRx} ${hipsY}`}
            fill="none"
            stroke={activeField === "hips" ? "#9E5A44" : "#C7B3A3"}
            strokeWidth={activeField === "hips" ? "3" : "1.8"}
            className="transition-all duration-300"
            filter={activeField === "hips" ? "url(#subtleGlow)" : ""}
          />
          <path
            d={`M ${100 - hipsRx} ${hipsY} A ${hipsRx} ${hipsRy} 0 0 0 ${100 + hipsRx} ${hipsY}`}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeDasharray="1 3"
            className="opacity-70"
          />
          <circle
            cx={100 + hipsRx}
            cy={hipsY}
            r={activeField === "hips" ? "5" : "3.5"}
            fill={activeField === "hips" ? "#9E5A44" : "#FFFFFF"}
            stroke="#9E5A44"
            strokeWidth="1.5"
            className="transition-all duration-300 shadow-sm"
          />
        </g>


        {/* 4. HEIGHT VERITCAL TAPE (Right edge) */}
        <g 
          className="cursor-pointer"
          onClick={() => handleSelect("height")}
        >
          {/* Invisible thick helper */}
          <line
            x1="185"
            y1="25"
            x2="185"
            y2="235"
            stroke="transparent"
            strokeWidth="10"
          />
          <line
            x1="185"
            y1="25"
            x2="185"
            y2="235"
            stroke={activeField === "height" ? "#9E5A44" : "#E5DFD6"}
            strokeWidth={activeField === "height" ? "2.5" : "1.5"}
            className="transition-all duration-300"
          />
          {/* Vertical minor ruler increments */}
          <path
            d="M 182 25 L 188 25 M 182 77.5 L 185 77.5 M 182 130 L 188 130 M 182 182.5 L 185 182.5 M 182 235 L 188 235"
            stroke="#9E5A44"
            strokeWidth="1"
            className="opacity-60"
          />
          <circle
            cx="185"
            cy={235 - heightClamped * 210}
            r={activeField === "height" ? "5" : "3.5"}
            fill={activeField === "height" ? "#9E5A44" : "#FFFFFF"}
            stroke="#9E5A44"
            strokeWidth="1.5"
            className="transition-all duration-300"
          />
        </g>
      </svg>

      {/* Mini clean legend */}
      <div className="flex justify-around w-full pt-3 text-[9px] font-mono text-neutral-400 font-bold border-t border-neutral-100">
        <button
          type="button"
          onClick={() => handleSelect("bust")}
          className={`flex items-center space-x-1 hover:text-[#9E5A44] transition-colors cursor-pointer ${
            activeField === "bust" ? "text-[#9E5A44] font-black" : ""
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full inline-block ${activeField === "bust" ? "bg-[#9E5A44]" : "bg-neutral-300"}`}></span>
          <span>B: {bust}{unit}</span>
        </button>
        <button
          type="button"
          onClick={() => handleSelect("waist")}
          className={`flex items-center space-x-1 hover:text-[#9E5A44] transition-colors cursor-pointer ${
            activeField === "waist" ? "text-[#9E5A44] font-black" : ""
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full inline-block ${activeField === "waist" ? "bg-[#9E5A44]" : "bg-neutral-300"}`}></span>
          <span>W: {waist}{unit}</span>
        </button>
        <button
          type="button"
          onClick={() => handleSelect("hips")}
          className={`flex items-center space-x-1 hover:text-[#9E5A44] transition-colors cursor-pointer ${
            activeField === "hips" ? "text-[#9E5A44] font-black" : ""
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full inline-block ${activeField === "hips" ? "bg-[#9E5A44]" : "bg-neutral-300"}`}></span>
          <span>H: {hips}{unit}</span>
        </button>
      </div>
    </div>
  );
}
