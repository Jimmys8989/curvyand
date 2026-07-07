export interface FashionInput {
  bust: number;
  waist: number;
  hips: number;
  style: string;
  colors: string[];
  season: string;
  occasion: string;
}

export interface FashionResult {
  bodyShape: string;
  shapeDescription: string;
  stylingPrinciples: string[];
  outfits: {
    name: string;
    formula: string;
    stylingTrick: string;
    colors: string;
  }[];
  brands: {
    name: string;
    why: string;
    priceRange: string;
  }[];
  stylingAdvice: string;
  isMock?: boolean;
}

export interface LoveInput {
  age: number;
  location: string;
  intention: "serious" | "casual";
  preferences: string;
}

export interface LoveResult {
  introduction: string;
  whyWooPlus: string;
  profileTips: {
    tagline: string;
    photoAdvice: string;
    icebreakers: string[];
  };
  dateIdeas: {
    title: string;
    description: string;
    vibe: string;
  }[];
  empowermentQuote: string;
  isMock?: boolean;
}

export interface SportsInput {
  weeklyHours: number;
  preferredType: string;
  intensity: "low" | "medium" | "high";
}

export interface SportsResult {
  philosophy: string;
  tips: string[];
  weeklySchedule: {
    day: string;
    activity: string;
    duration: string;
    instructions: string;
  }[];
  affirmation: string;
  isMock?: boolean;
}

export interface HealthInput {
  dislikes: string[];
  allergies: string[];
  dietaryPreference: string;
}

export interface MealDetail {
  title: string;
  ingredients: string[];
  instructions: string;
  vibe: string;
}

export interface HealthResult {
  approach: string;
  mealPlan: {
    breakfast: MealDetail;
    lunch: MealDetail;
    dinner: MealDetail;
  };
  snackIdea: string;
  nourishmentFocus: string;
  isMock?: boolean;
}
