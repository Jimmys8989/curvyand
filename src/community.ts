import type { SupabaseClient } from "@supabase/supabase-js";
import type { Brand, BrandCategory, Comment } from "./types";
import { generateSizeChartForBrand } from "./data";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

export const isCommunityBackendConfigured = Boolean(
  supabaseUrl && supabasePublishableKey,
);

let supabasePromise: Promise<SupabaseClient | null> | null = null;

function getSupabase(): Promise<SupabaseClient | null> {
  if (!isCommunityBackendConfigured) return Promise.resolve(null);

  if (!supabasePromise) {
    supabasePromise = import("@supabase/supabase-js").then(({ createClient }) =>
      createClient(supabaseUrl!, supabasePublishableKey!, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }),
    );
  }

  return supabasePromise;
}

interface ReviewRow {
  id: string;
  brand_id: string;
  display_name: string;
  rating: number;
  fit_result: Comment["fitsRatio"];
  garment_type: Comment["garmentType"];
  user_size: string | null;
  review_text: string;
  created_at: string;
}

export type BrandScaleSystem =
  | "us_num"
  | "us_alpha"
  | "torrid"
  | "universal_standard"
  | "denim_waist"
  | "lingerie_bra";

export type BrandFitPreference = "generous" | "fitted" | "true_to_size";

interface CommunityBrandRow {
  id: string;
  slug: string;
  name: string;
  category: BrandCategory;
  scale_system: BrandScaleSystem;
  fit_preference: BrandFitPreference;
  price_tier: number;
  website_url: string | null;
  aesthetic_tags: string[];
  description: string | null;
}

export interface BrandSubmission {
  slug: string;
  name: string;
  category: BrandCategory;
  scaleSystem: BrandScaleSystem;
  fitPreference: BrandFitPreference;
  priceTier: number;
  websiteUrl?: string;
  aestheticTags: string[];
  description?: string;
}

export interface ReviewSubmission {
  brandId: string;
  author: string;
  text: string;
  rating: number;
  fitsRatio: Comment["fitsRatio"];
  userSize?: string;
  garmentType: NonNullable<Comment["garmentType"]>;
}

export interface VoteTotals {
  votesUp: number;
  votesDown: number;
}

const formatReviewDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

function getSizingRange(scaleSystem: BrandScaleSystem): string {
  switch (scaleSystem) {
    case "torrid":
      return "Torrid 00-6";
    case "universal_standard":
      return "Universal Standard 4XS-4XL";
    case "denim_waist":
      return "Waist sizes 30-50";
    case "lingerie_bra":
      return "Full-bust bra sizing";
    case "us_alpha":
      return "Plus-size alpha XS-4XL";
    default:
      return "Standard US sizes 10-40";
  }
}

function getFitNote(fitPreference: BrandFitPreference): string {
  if (fitPreference === "generous") {
    return "Community-submitted brand profile indicates a roomier, more relaxed cut. Verify the current retailer chart before ordering.";
  }
  if (fitPreference === "fitted") {
    return "Community-submitted brand profile indicates a closer, more contoured cut. Verify the current retailer chart before ordering.";
  }
  return "Community-submitted brand profile indicates a generally true-to-size cut. Verify the current retailer chart before ordering.";
}

function mapCommunityBrand(row: CommunityBrandRow): Brand {
  const websiteUrl = row.website_url || "https://www.google.com/search?q=" + encodeURIComponent(row.name);
  let logo = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200&h=200";

  try {
    const domain = new URL(websiteUrl).hostname.replace(/^www\./, "");
    if (row.website_url) logo = `https://logo.clearbit.com/${domain}`;
  } catch {
    // Keep the generic brand artwork when the optional website is unavailable.
  }

  const sizeChart = {
    tops_dresses: generateSizeChartForBrand(row.scale_system, "tops_dresses", row.fit_preference),
    pants_bottoms: generateSizeChartForBrand(row.scale_system, "pants_bottoms", row.fit_preference),
    intimates_lingerie: generateSizeChartForBrand(row.scale_system, "intimates_lingerie", row.fit_preference),
    swimwear: generateSizeChartForBrand(row.scale_system, "swimwear", row.fit_preference),
    default: generateSizeChartForBrand(row.scale_system, "tops_dresses", row.fit_preference),
  };

  return {
    id: row.slug,
    name: row.name,
    logo,
    coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=300&h=300",
    category: row.category,
    rating: 0,
    ratingCount: 0,
    votes: 0,
    votesUp: 0,
    votesDown: 0,
    sizingRange: getSizingRange(row.scale_system),
    priceTier: row.price_tier,
    aesthetic: row.aesthetic_tags,
    description:
      row.description ||
      `${row.name} was suggested by the Curvy& community and approved for the public brand directory.`,
    fitNotes: getFitNote(row.fit_preference),
    sizeChart,
    siteUrl: websiteUrl,
    isCustom: true,
  };
}

export async function fetchPublishedCommunityBrands(): Promise<Brand[]> {
  const supabase = await getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("community_brands")
    .select(
      "id,slug,name,category,scale_system,fit_preference,price_tier,website_url,aesthetic_tags,description",
    )
    .eq("status", "published")
    .order("name", { ascending: true })
    .limit(500);

  if (error) throw error;
  return ((data ?? []) as CommunityBrandRow[]).map(mapCommunityBrand);
}

export async function submitBrandForModeration(
  brand: BrandSubmission,
): Promise<void> {
  const supabase = await getSupabase();
  if (!supabase) {
    throw new Error("Community brand submissions are not configured yet.");
  }

  const lastSubmission = Number(
    localStorage.getItem("curvy_last_brand_submission") || "0",
  );
  if (Date.now() - lastSubmission < 5 * 60_000) {
    throw new Error("Please wait five minutes before suggesting another brand.");
  }

  const { error } = await supabase.from("community_brands").insert({
    slug: brand.slug,
    name: brand.name.trim(),
    category: brand.category,
    scale_system: brand.scaleSystem,
    fit_preference: brand.fitPreference,
    price_tier: brand.priceTier,
    website_url: brand.websiteUrl?.trim() || null,
    aesthetic_tags: brand.aestheticTags,
    description: brand.description?.trim() || null,
  });

  if (error) throw error;
  localStorage.setItem("curvy_last_brand_submission", Date.now().toString());
}

export async function fetchPublishedReviews(): Promise<Comment[]> {
  const supabase = await getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id,brand_id,display_name,rating,fit_result,garment_type,user_size,review_text,created_at",
    )
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) throw error;

  return ((data ?? []) as ReviewRow[]).map((row) => ({
    id: row.id,
    brandId: row.brand_id,
    author: row.display_name,
    text: row.review_text,
    rating: row.rating,
    fitsRatio: row.fit_result,
    garmentType: row.garment_type,
    userSize: row.user_size || undefined,
    timestamp: formatReviewDate(row.created_at),
  }));
}

export async function submitReviewForModeration(
  review: ReviewSubmission,
): Promise<void> {
  const supabase = await getSupabase();
  if (!supabase) {
    throw new Error("Community reviews are not configured yet.");
  }

  const lastSubmission = Number(
    localStorage.getItem("curvy_last_review_submission") || "0",
  );
  if (Date.now() - lastSubmission < 60_000) {
    throw new Error("Please wait one minute before submitting another review.");
  }

  const { error } = await supabase.from("reviews").insert({
    brand_id: review.brandId,
    display_name: review.author.trim(),
    rating: review.rating,
    fit_result: review.fitsRatio,
    garment_type: review.garmentType,
    user_size: review.userSize?.trim() || null,
    review_text: review.text.trim(),
  });

  if (error) throw error;
  localStorage.setItem("curvy_last_review_submission", Date.now().toString());
}

export async function fetchVoteTotals(): Promise<Record<string, VoteTotals>> {
  const supabase = await getSupabase();
  if (!supabase) return {};

  const { data, error } = await supabase.rpc("get_brand_vote_totals");
  if (error) throw error;

  return Object.fromEntries(
    ((data ?? []) as Array<{
      brand_id: string;
      votes_up: number | string;
      votes_down: number | string;
    }>).map((row) => [
      row.brand_id,
      {
        votesUp: Number(row.votes_up),
        votesDown: Number(row.votes_down),
      },
    ]),
  );
}

function getVisitorId(): string {
  const storageKey = "curvy_community_visitor_id";
  const existing = localStorage.getItem(storageKey);
  if (existing) return existing;

  const visitorId = crypto.randomUUID();
  localStorage.setItem(storageKey, visitorId);
  return visitorId;
}

export async function submitBrandVote(
  brandId: string,
  voteType: "up" | "down" | null,
): Promise<void> {
  const supabase = await getSupabase();
  if (!supabase) {
    throw new Error("Community voting is not configured yet.");
  }

  const { error } = await supabase.rpc("submit_brand_vote", {
    p_brand_id: brandId,
    p_visitor_id: getVisitorId(),
    p_vote_type: voteType,
  });

  if (error) throw error;
}
