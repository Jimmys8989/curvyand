export interface ExternalReviewSummary {
  id: string;
  brandId: string;
  sourceName: string;
  sourceCommunity: string;
  sourceUrl: string;
  sourceDate: string;
  topic: string;
  summary: string;
  fitSignal: "mixed" | "runsSmall" | "runsLarge" | "trueToSize";
}

// Curated paraphrases of public discussions. These are deliberately stored
// separately from first-party Curvy& reviews and always link to the source.
export const EXTERNAL_REVIEW_SUMMARIES: ExternalReviewSummary[] = [
  {
    id: "reddit-torrid-sizing-doysde",
    brandId: "torrid",
    sourceName: "Reddit",
    sourceCommunity: "r/PlusSize",
    sourceUrl: "https://www.reddit.com/r/PlusSize/comments/doysde/",
    sourceDate: "October 2019",
    topic: "Cross-brand sizing",
    summary:
      "Several shoppers comparing Torrid with Lane Bryant described Torrid's numbered scale as more predictable. A commonly suggested comparison was Lane Bryant 20 to Torrid 2, with strong advice to still check reviews for the individual garment.",
    fitSignal: "trueToSize",
  },
  {
    id: "reddit-lane-bryant-sizing-1cnjw34",
    brandId: "lane-bryant",
    sourceName: "Reddit",
    sourceCommunity: "r/PlusSize",
    sourceUrl: "https://www.reddit.com/r/PlusSize/comments/1cnjw34/",
    sourceDate: "May 2024",
    topic: "Pants and category consistency",
    summary:
      "Shoppers in this discussion frequently found Lane Bryant pants, jeans, and some sleepwear smaller than their usual sizes. Others noted that structured fabrics may explain part of the difference, but experiences still varied by category.",
    fitSignal: "runsSmall",
  },
  {
    id: "reddit-universal-standard-1ivc17v",
    brandId: "universal-standard",
    sourceName: "Reddit",
    sourceCommunity: "r/PlusSizeFashion",
    sourceUrl: "https://www.reddit.com/r/PlusSizeFashion/comments/1ivc17v/",
    sourceDate: "February 2025",
    topic: "Consistency and favorite pieces",
    summary:
      "Longtime shoppers shared mixed experiences. Some praised consistent sizing, comfort, pockets, and durability, while others said results depend heavily on the specific style and body shape. Denim, tees, and selected dresses received the most specific praise.",
    fitSignal: "mixed",
  },
  {
    id: "reddit-eloquii-m124px",
    brandId: "eloquii",
    sourceName: "Reddit",
    sourceCommunity: "r/PlusSize",
    sourceUrl: "https://www.reddit.com/r/PlusSize/comments/m124px/",
    sourceDate: "March 2021",
    topic: "First-order fit",
    summary:
      "Several shoppers described ELOQUII sizing as style-dependent and often snug in tops, while bottoms and leggings were more successful. Petite shoppers also called out extra garment length, making measurements and item details especially important.",
    fitSignal: "runsSmall",
  },
  {
    id: "reddit-good-american-tf0p3e",
    brandId: "good-american",
    sourceName: "Reddit",
    sourceCommunity: "r/PlusSizeFashion",
    sourceUrl: "https://www.reddit.com/r/PlusSizeFashion/comments/tf0p3e/",
    sourceDate: "March 2022",
    topic: "Denim durability and try-on advice",
    summary:
      "A plus-size shopper praised the jeans for keeping their shape and lasting well, but recommended trying several nearby sizes and cuts because the right fit could not be predicted from the label alone.",
    fitSignal: "mixed",
  },
  {
    id: "reddit-old-navy-csha8c",
    brandId: "old-navy",
    sourceName: "Reddit",
    sourceCommunity: "r/PlusSize",
    sourceUrl: "https://www.reddit.com/r/PlusSize/comments/csha8c/",
    sourceDate: "August 2019",
    topic: "Regular versus plus sizing",
    summary:
      "Responses were mixed: one shopper found plus bottoms roomy while tops depended on bust fit; another needed a larger size in the plus range even though XXL from the regular range fit. The discussion supports checking measurements by category.",
    fitSignal: "mixed",
  },
  {
    id: "reddit-asos-curve-dtpgh3",
    brandId: "asos-curve",
    sourceName: "Reddit",
    sourceCommunity: "r/PlusSize",
    sourceUrl: "https://www.reddit.com/r/PlusSize/comments/dtpgh3/",
    sourceDate: "November 2019",
    topic: "Curve collection sizing",
    summary:
      "Several shoppers found ASOS Curve dresses and tops generous enough to sometimes size down, while pants were closer to true to size and bras were less predictable. Model sizing, try-on videos, and easy returns were repeatedly mentioned as useful checks.",
    fitSignal: "runsLarge",
  },
  {
    id: "reddit-savage-x-fenty-13r0j5r",
    brandId: "savage-x-fenty",
    sourceName: "Reddit",
    sourceCommunity: "r/PlusSize",
    sourceUrl: "https://www.reddit.com/r/PlusSize/comments/13r0j5r/",
    sourceDate: "May 2023",
    topic: "Lingerie size variation",
    summary:
      "Fit reports varied considerably by fabric and style. Some shoppers found bras close to true to size, while bottoms, bralettes, and clothing could run small or large even when ordered from the chart. Measurements alone did not guarantee consistency.",
    fitSignal: "mixed",
  },
  {
    id: "reddit-cacique-1h6s3re",
    brandId: "cacique",
    sourceName: "Reddit",
    sourceCommunity: "r/PlusSize",
    sourceUrl: "https://www.reddit.com/r/PlusSize/comments/1h6s3re/",
    sourceDate: "December 2024",
    topic: "Bra comfort and construction",
    summary:
      "Shoppers praised the full coverage and comfortable wire placement, but several reported hooks pulling out on newer bras and suspected reduced reinforcement. The fit could feel comfortable even when long-term construction was the concern.",
    fitSignal: "mixed",
  },
  {
    id: "reddit-nike-endm5k",
    brandId: "nike",
    sourceName: "Reddit",
    sourceCommunity: "r/PlusSize",
    sourceUrl: "https://www.reddit.com/r/PlusSize/comments/endm5k/",
    sourceDate: "January 2020",
    topic: "Plus-size activewear fit",
    summary:
      "Multiple shoppers described Nike plus activewear as true to size, comfortable, and effective for moisture management. One useful caveat was that Nike Pro pieces are compression layers and may appear more sheer when worn alone.",
    fitSignal: "trueToSize",
  },
];

export function getExternalReviewsForBrand(brandId: string) {
  return EXTERNAL_REVIEW_SUMMARIES.filter((review) => review.brandId === brandId);
}
