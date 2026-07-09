export type GarmentType = "tops_dresses" | "pants_bottoms" | "intimates_lingerie" | "swimwear";

export type BrandCategory = "premium_plus" | "mainstream" | "activewear" | "denim" | "swimwear" | "lingerie";

export interface SizeRanges {
  bust: [number, number]; // min, max in inches
  waist: [number, number];
  hips: [number, number];
}

export interface SizeChart {
  [size: string]: SizeRanges;
}

export interface BrandSizeChart {
  tops_dresses?: SizeChart;
  pants_bottoms?: SizeChart;
  intimates_lingerie?: SizeChart;
  swimwear?: SizeChart;
  default: SizeChart;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  coverImage?: string; // High-fashion background banner image
  category: BrandCategory;
  rating: number;
  ratingCount: number;
  votes: number;
  votesUp: number;
  votesDown: number;
  sizingRange: string;
  priceTier: number; // 1 to 4 ($ to $$$$)
  aesthetic: string[];
  description: string;
  fitNotes: string;
  sizeChart: BrandSizeChart;
  siteUrl: string;
  isCustom?: boolean; // Flag for user-added brands
}

export interface Comment {
  id: string;
  brandId: string;
  author: string;
  avatar: string;
  text: string;
  rating: number;
  timestamp: string;
  fitsRatio: "runsSmall" | "trueToSize" | "runsLarge";
  userSize?: string;
  garmentType?: GarmentType;
  isLocal?: boolean;
}

export interface MeasurementProfile {
  bust: number;
  waist: number;
  hips: number;
  height: number;
  unit: "in" | "cm";
}
