import React from "react";

interface BodyMannequinProps {
  bust: number;
  waist: number;
  hips: number;
  height: number;
  unit: "in" | "cm";
  activeField?: "bust" | "waist" | "hips" | "height" | null;
}

export default function BodyMannequin({
  bust,
  waist,
  hips,
  height,
  unit,
  activeField = null,
}: BodyMannequinProps) {
  // Normalize values for visual scale feedback (e.g. tape width)
  const isInch = unit === "in";
  
  // Reference scales to determine how "curvy" or wide the highlights should be
  const bustPercent = isInch ? (bust - 30) / 45 : (bust - 76) / 114;
  const waistPercent = isInch ? (waist - 22) / 48 : (waist - 55) / 123;
  const hipsPercent = isInch ? (hips - 34) / 51 : (hips - 86) / 130;

  // Render horizontal tape measures
  return (
    <div className="flex flex-col items-center justify-center bg-white border border-[#E7E2D8] rounded-2xl p-4 shadow-3xs h-full relative overflow-hidden select-none">
      {/* Editorial aesthetic watermark background */}
      <span className="absolute top-2 left-3 font-mono text-[9px] text-[#9E5A44]/35 tracking-wider uppercase font-bold">
        DIAGRAMMATIC COUTURE MEASURE
      </span>

      <svg
        viewBox="0 0 200 250"
        className="w-full max-w-[210px] h-auto drop-shadow-3xs transition-all duration-500"
      >
        <defs>
          {/* Subtle glow filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          {/* Linear gradient for silhouette */}
          <linearGradient id="mannequinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDFBF7" />
            <stop offset="50%" stopColor="#F3EDE2" />
            <stop offset="100%" stopColor="#EEDCD2" />
          </linearGradient>
        </defs>

        {/* 1. Curvy Silhouette drawing */}
        <path
          d="M 100 25 C 96 25, 96 35, 96 35 C 86 37, 72 42, 72 48 C 72 56, 68 70, 68 85 C 68 100, 77 110, 77 120 C 77 130, 65 145, 65 165 C 65 185, 73 210, 78 235 L 94 235 L 97 180 L 100 180 L 103 180 L 106 235 L 122 235 C 127 210, 135 185, 135 165 C 135 145, 123 130, 123 120 C 123 110, 132 100, 132 85 C 132 70, 128 56, 128 48 C 128 42, 114 37, 104 35 C 104 35, 104 25, 100 25 Z"
          fill="url(#mannequinGrad)"
          stroke="#DFB7B0"
          strokeWidth="1.5"
          className="transition-all duration-300"
        />

        {/* 2. Tape Measure Lines & Nodes */}
        
        {/* BUST LINE (Y=85) */}
        <g className="transition-opacity duration-250">
          <line
            x1="20"
            y1="85"
            x2="180"
            y2="85"
            stroke={activeField === "bust" ? "#9E5A44" : "#E7E2D8"}
            strokeWidth={activeField === "bust" ? "2" : "1"}
            strokeDasharray="3 3"
          />
          {/* Highlight path tracing around contour */}
          <path
            d="M 68 85 L 132 85"
            stroke="#9E5A44"
            strokeWidth={activeField === "bust" ? "3" : "1.5"}
            strokeLinecap="round"
            className="opacity-70"
          />
          {/* Left indicator circle */}
          <circle
            cx="20"
            cy="85"
            r="12"
            fill={activeField === "bust" ? "#9E5A44" : "#FAF7F2"}
            stroke="#9E5A44"
            strokeWidth="1.5"
            className="cursor-help"
          />
          <text
            x="20"
            y="88"
            textAnchor="middle"
            className={`font-mono text-[8px] font-bold ${
              activeField === "bust" ? "fill-white" : "fill-[#9E5A44]"
            }`}
          >
            B
          </text>
          {/* Right Label/Value Box */}
          <rect
            x="138"
            y="75"
            width="42"
            height="20"
            rx="4"
            fill="#9E5A44"
            className={`transition-all duration-300 ${
              activeField === "bust" ? "fill-[#9E5A44] scale-105" : "fill-[#9E5A44]/90"
            }`}
          />
          <text
            x="159"
            y="88"
            textAnchor="middle"
            fill="#FAF7F2"
            className="font-mono text-[9px] font-bold"
          >
            {bust}
            {unit}
          </text>
        </g>

        {/* WAIST LINE (Y=120) */}
        <g className="transition-opacity duration-250">
          <line
            x1="20"
            y1="120"
            x2="180"
            y2="120"
            stroke={activeField === "waist" ? "#9E5A44" : "#E7E2D8"}
            strokeWidth={activeField === "waist" ? "2" : "1"}
            strokeDasharray="3 3"
          />
          <path
            d="M 77 120 L 123 120"
            stroke="#9E5A44"
            strokeWidth={activeField === "waist" ? "3" : "1.5"}
            strokeLinecap="round"
            className="opacity-70"
          />
          <circle
            cx="20"
            cy="120"
            r="12"
            fill={activeField === "waist" ? "#9E5A44" : "#FAF7F2"}
            stroke="#9E5A44"
            strokeWidth="1.5"
          />
          <text
            x="20"
            y="123"
            textAnchor="middle"
            className={`font-mono text-[8px] font-bold ${
              activeField === "waist" ? "fill-white" : "fill-[#9E5A44]"
            }`}
          >
            W
          </text>
          {/* Right Label/Value Box */}
          <rect
            x="138"
            y="110"
            width="42"
            height="20"
            rx="4"
            fill="#9E5A44"
            className={`transition-all duration-300 ${
              activeField === "waist" ? "fill-[#9E5A44] scale-105" : "fill-[#9E5A44]/90"
            }`}
          />
          <text
            x="159"
            y="123"
            textAnchor="middle"
            fill="#FAF7F2"
            className="font-mono text-[9px] font-bold"
          >
            {waist}
            {unit}
          </text>
        </g>

        {/* HIPS LINE (Y=165) */}
        <g className="transition-opacity duration-250">
          <line
            x1="20"
            y1="165"
            x2="180"
            y2="165"
            stroke={activeField === "hips" ? "#9E5A44" : "#E7E2D8"}
            strokeWidth={activeField === "hips" ? "2" : "1"}
            strokeDasharray="3 3"
          />
          <path
            d="M 65 165 L 135 165"
            stroke="#9E5A44"
            strokeWidth={activeField === "hips" ? "3" : "1.5"}
            strokeLinecap="round"
            className="opacity-70"
          />
          <circle
            cx="20"
            cy="165"
            r="12"
            fill={activeField === "hips" ? "#9E5A44" : "#FAF7F2"}
            stroke="#9E5A44"
            strokeWidth="1.5"
          />
          <text
            x="20"
            y="168"
            textAnchor="middle"
            className={`font-mono text-[8px] font-bold ${
              activeField === "hips" ? "fill-white" : "fill-[#9E5A44]"
            }`}
          >
            H
          </text>
          {/* Right Label/Value Box */}
          <rect
            x="138"
            y="155"
            width="42"
            height="20"
            rx="4"
            fill="#9E5A44"
            className={`transition-all duration-300 ${
              activeField === "hips" ? "fill-[#9E5A44] scale-105" : "fill-[#9E5A44]/90"
            }`}
          />
          <text
            x="159"
            y="168"
            textAnchor="middle"
            fill="#FAF7F2"
            className="font-mono text-[9px] font-bold"
          >
            {hips}
            {unit}
          </text>
        </g>

        {/* HEIGHT MEASURE BAR (VERTICAL ALONG LEFT EDGE) */}
        <g className="transition-opacity duration-250">
          <line
            x1="190"
            y1="25"
            x2="190"
            y2="235"
            stroke="#E7E2D8"
            strokeWidth="2"
          />
          <line
            x1="185"
            y1="25"
            x2="195"
            y2="25"
            stroke="#9E5A44"
            strokeWidth="1.5"
          />
          <line
            x1="185"
            y1="235"
            x2="195"
            y2="235"
            stroke="#9E5A44"
            strokeWidth="1.5"
          />
          {/* Marker indicator for vertical height */}
          <circle
            cx="190"
            cy={235 - Math.max(10, Math.min(200, (height / 203) * 200))}
            r="4"
            fill="#9E5A44"
          />
        </g>
      </svg>

      {/* Mini legend representing metrics in very minimal clean font */}
      <div className="flex justify-around w-full pt-3 text-[9px] font-sans text-neutral-500 font-bold border-t border-neutral-100">
        <span className="flex items-center space-x-1">
          <span className="h-1.5 w-1.5 bg-[#9E5A44] rounded-full inline-block"></span>
          <span>B: BUST</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="h-1.5 w-1.5 bg-[#9E5A44] rounded-full inline-block"></span>
          <span>W: WAIST</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="h-1.5 w-1.5 bg-[#9E5A44] rounded-full inline-block"></span>
          <span>H: HIPS</span>
        </span>
      </div>
    </div>
  );
}
