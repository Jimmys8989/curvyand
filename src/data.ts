import { Brand, Comment, BrandCategory, GarmentType, SizeChart, BrandSizeChart, SizeRanges } from "./types";

// Base helper to generate consistent body measurements for any US size index
export function getBaseUsSizeMeasurements(usSize: number): SizeRanges {
  // A clean, realistic sizing progression starting from US 10 up to US 40
  const baseBustMin = 36 + (usSize - 10) * 1.3;
  const baseWaistMin = 29 + (usSize - 10) * 1.35;
  const baseHipsMin = 39 + (usSize - 10) * 1.4;

  return {
    bust: [Math.round(baseBustMin), Math.round(baseBustMin + 2)],
    waist: [Math.round(baseWaistMin), Math.round(baseWaistMin + 2)],
    hips: [Math.round(baseHipsMin), Math.round(baseHipsMin + 2.5)],
  };
}

// Generates size charts for any brand dynamically based on its scale and garment category
export function generateSizeChartForBrand(
  scaleType: "us_num" | "us_alpha" | "torrid" | "universal_standard" | "denim_waist" | "lingerie_bra",
  garmentType: GarmentType,
  fitPreference: "generous" | "fitted" | "true_to_size" = "true_to_size"
): SizeChart {
  const chart: SizeChart = {};

  // Custom offset multiplier for "generous" or "fitted" profiles
  const sizeOffset = fitPreference === "generous" ? 1.5 : fitPreference === "fitted" ? -1.5 : 0;

  // Helper to adjust measurements based on garment type
  const adjustForGarment = (base: SizeRanges, type: GarmentType): SizeRanges => {
    const bust = [...base.bust] as [number, number];
    const waist = [...base.waist] as [number, number];
    const hips = [...base.hips] as [number, number];

    if (type === "tops_dresses") {
      // Tops focus heavily on bust and waist roominess
      bust[0] += sizeOffset; bust[1] += sizeOffset + 1;
      waist[0] += sizeOffset; waist[1] += sizeOffset + 1.5;
    } else if (type === "pants_bottoms") {
      // Pants focus on waist and hip structure
      waist[0] -= 0.5; waist[1] += 0.5;
      hips[0] += sizeOffset + 1; hips[1] += sizeOffset + 2;
    } else if (type === "swimwear") {
      // Swimwear has extreme stretch (+3/-3 tolerance)
      bust[0] -= 1; bust[1] += 2;
      waist[0] -= 1; waist[1] += 2;
      hips[0] -= 1; hips[1] += 2.5;
    } else if (type === "intimates_lingerie") {
      // Lingerie has tight chest fit, waist is highly flexible
      bust[0] -= 0.5; bust[1] += 0.5;
      waist[0] -= 2; waist[1] += 3;
    }

    return { bust: [bust[0], bust[1]], waist: [waist[0], waist[1]], hips: [hips[0], hips[1]] };
  };

  if (scaleType === "torrid") {
    const mapping = [
      { torrid: "00 (US 10)", us: 10 },
      { torrid: "0 (US 12)", us: 12 },
      { torrid: "1 (US 14-16)", us: 15 },
      { torrid: "2 (US 18-20)", us: 19 },
      { torrid: "3 (US 22-24)", us: 23 },
      { torrid: "4 (US 26)", us: 26 },
      { torrid: "5 (US 28)", us: 28 },
      { torrid: "6 (US 30)", us: 30 },
    ];
    for (const item of mapping) {
      chart[item.torrid] = adjustForGarment(getBaseUsSizeMeasurements(item.us), garmentType);
    }
  } else if (scaleType === "universal_standard") {
    const mapping = [
      { us: "4XS (US 00-0)", usNum: 0 },
      { us: "3XS (US 2-4)", usNum: 3 },
      { us: "2XS (US 6-8)", usNum: 7 },
      { us: "XS (US 10-12)", usNum: 11 },
      { us: "S (US 14-16)", usNum: 15 },
      { us: "M (US 18-20)", usNum: 19 },
      { us: "L (US 22-24)", usNum: 23 },
      { us: "XL (US 26-28)", usNum: 27 },
      { us: "2XL (US 30-32)", usNum: 31 },
      { us: "3XL (US 34-36)", usNum: 35 },
      { us: "4XL (US 38-40)", usNum: 39 },
    ];
    for (const item of mapping) {
      chart[item.us] = adjustForGarment(getBaseUsSizeMeasurements(item.usNum), garmentType);
    }
  } else if (scaleType === "us_alpha") {
    const mapping = [
      { alpha: "XS (US 10-12)", us: 11 },
      { alpha: "S (US 14-16)", us: 15 },
      { alpha: "M (US 18-20)", us: 19 },
      { alpha: "L (US 22-24)", us: 23 },
      { alpha: "XL (US 26-28)", us: 27 },
      { alpha: "2XL (US 30-32)", us: 31 },
      { alpha: "3XL (US 34-36)", us: 35 },
      { alpha: "4XL (US 38-40)", us: 39 },
    ];
    for (const item of mapping) {
      chart[item.alpha] = adjustForGarment(getBaseUsSizeMeasurements(item.us), garmentType);
    }
  } else if (scaleType === "denim_waist") {
    const waistSizes = ["30", "31", "32", "33", "34", "36", "38", "40", "42", "44", "46", "48", "50"];
    waistSizes.forEach((w, idx) => {
      const correspondingUs = 10 + idx * 2.5;
      chart[`Size ${w}`] = adjustForGarment(getBaseUsSizeMeasurements(correspondingUs), garmentType);
    });
  } else if (scaleType === "lingerie_bra") {
    const sizes = ["36D/DD", "38D/DD", "40DD/DDD", "42DD/F", "44F/G", "46G/H", "48H/I"];
    sizes.forEach((sz, idx) => {
      const correspondingUs = 12 + idx * 3;
      chart[sz] = adjustForGarment(getBaseUsSizeMeasurements(correspondingUs), garmentType);
    });
  } else {
    // Standard US Numeric (10 to 40, skip odd numbers)
    const sizes = ["10", "12", "14", "16", "18", "20", "22", "24", "26", "28", "30", "32", "34", "36", "38", "40"];
    sizes.forEach((sz) => {
      chart[sz] = adjustForGarment(getBaseUsSizeMeasurements(parseInt(sz)), garmentType);
    });
  }

  return chart;
}

// Complete Launch Brands Definition - 56 Brands correctly categorized
export const BRAND_DEFINITIONS_RAW: Array<{
  id: string;
  name: string;
  category: BrandCategory;
  scaleType: "us_num" | "us_alpha" | "torrid" | "universal_standard" | "denim_waist" | "lingerie_bra";
  fitPreference: "generous" | "fitted" | "true_to_size";
  priceTier: number;
  aesthetic: string[];
  description: string;
  fitNotes: string;
  siteUrl: string;
}> = [
  // 1. Premium Plus Size Brands
  {
    id: "torrid",
    name: "Torrid",
    category: "premium_plus",
    scaleType: "torrid",
    fitPreference: "generous",
    priceTier: 2,
    aesthetic: ["Trendy", "Boho", "Casual", "Sexy", "Goth"],
    description: "The ultimate destination for trendy plus-size fashion. Famous for unparalleled fit, high-quality denim, premium bras, and gorgeous dresses designed to flatter full figures.",
    fitNotes: "Torrid runs slightly generous in the hips and is very forgiving. If you have an hourglass or pear shape, your regular size is perfect. Many users size down in outerwear and stretchy knits.",
    siteUrl: "https://www.torrid.com",
  },
  {
    id: "lane-bryant",
    name: "Lane Bryant",
    category: "premium_plus",
    scaleType: "us_num",
    fitPreference: "true_to_size",
    priceTier: 2,
    aesthetic: ["Classic", "Office", "Intimates", "Casual"],
    description: "A historic pioneer in plus-size fashion. Renowned for its Cacique intimates collection, polished tailoring, office-ready workwear, and standard fit consistency.",
    fitNotes: "Lane Bryant has a classic fit tailored with a bit more structure. Known for roomy hip and thigh cuts. Best suited for rectangle, apple, or classic shapes.",
    siteUrl: "https://www.lanebryant.com",
  },
  {
    id: "eloquii",
    name: "ELOQUII",
    category: "premium_plus",
    scaleType: "us_num",
    fitPreference: "fitted",
    priceTier: 3,
    aesthetic: ["Editorial", "Chic", "Bold", "Glamorous"],
    description: "The fashion-insider choice for plus-size statement wear. Offers trend-driven high-fashion runway styles, couture-inspired tailoring, and vibrant colors without compromises.",
    fitNotes: "Eloquii features two distinct fit lines: Standard and 'Viola' (designed for those whose hips are 1-2 sizes larger than their bust). It has gorgeous, structured, non-stretch options that require precise measurements.",
    siteUrl: "https://www.eloquii.com",
  },
  {
    id: "universal-standard",
    name: "Universal Standard",
    category: "premium_plus",
    scaleType: "universal_standard",
    fitPreference: "generous",
    priceTier: 4,
    aesthetic: ["Minimalist", "Luxury", "Essentials", "Comfy"],
    description: "The gold standard for size-inclusive, ultra-premium basics. They revolutionized sizing by setting US 18/20 as the absolute Center of Style (Size Medium). Made with luxury materials like Peruvian cotton and raw silk.",
    fitNotes: "Highly forgiving and meticulously engineered. Note that an 'S' at Universal Standard represents US 14-16, and 'M' represents US 18-20. Check the conversion helper carefully!",
    siteUrl: "https://www.universalstandard.com",
  },
  {
    id: "ashley-stewart",
    name: "Ashley Stewart",
    category: "premium_plus",
    scaleType: "us_num",
    fitPreference: "generous",
    priceTier: 2,
    aesthetic: ["Vibrant", "Glamorous", "Trendy", "Daring"],
    description: "Daring and trend-focused fashion for curvy women. Specializing in high-energy colors, sexy designs, perfect denim, and statement office looks.",
    fitNotes: "Runs slightly large across the bust. Perfect for vibrant curves.",
    siteUrl: "https://www.ashleystewart.com",
  },
  {
    id: "city-chic",
    name: "City Chic",
    category: "premium_plus",
    scaleType: "us_num",
    fitPreference: "fitted",
    priceTier: 3,
    aesthetic: ["Romantic", "Glamorous", "Dresses", "Elegance"],
    description: "Global brand celebrating curves with glamorous cocktail dresses, casual weekend pieces, and exquisite outerwear.",
    fitNotes: "Fitted through the waist. Perfect hourglass tailoring.",
    siteUrl: "https://www.citychiccollective.com.au",
  },
  {
    id: "yours-clothing",
    name: "Yours Clothing",
    category: "premium_plus",
    scaleType: "us_alpha",
    fitPreference: "generous",
    priceTier: 1,
    aesthetic: ["Casual", "Boho", "Comfortable", "Everyday"],
    description: "A leading UK brand offering affordable, everyday wardrobe staples, pajamas, and casual dresses for plus size.",
    fitNotes: "Runs slightly large. Stretchy fabric bases make it highly comfortable.",
    siteUrl: "https://www.yoursclothing.co.uk",
  },
  {
    id: "evans",
    name: "Evans",
    category: "premium_plus",
    scaleType: "us_num",
    fitPreference: "true_to_size",
    priceTier: 2,
    aesthetic: ["Classic", "Comfortable", "Essentials"],
    description: "Classic styling for the sophisticated woman. Focused on structural comfort and breathable knitwear.",
    fitNotes: "Highly forgiving in the shoulders and waist.",
    siteUrl: "https://www.evans.co.uk",
  },
  {
    id: "simply-be",
    name: "Simply Be",
    category: "premium_plus",
    scaleType: "us_num",
    fitPreference: "true_to_size",
    priceTier: 2,
    aesthetic: ["Trendy", "Activewear", "Footwear", "Youthful"],
    description: "Empowering trend-driven styles from underwear to wide-fit shoes.",
    fitNotes: "Excellent hip and thigh rooms in jumpsuits and denim.",
    siteUrl: "https://www.simplybe.co.uk",
  },
  {
    id: "ulla-popken",
    name: "Ulla Popken",
    category: "premium_plus",
    scaleType: "us_num",
    fitPreference: "generous",
    priceTier: 3,
    aesthetic: ["Euro-Chic", "Sporty", "Premium", "Sustainable"],
    description: "German-engineered, high-quality fashion. Offering classic coats, premium knitwear, and modern European trends.",
    fitNotes: "Runs generous. Generous length in arms and legs, excellent for taller curvy buyers.",
    siteUrl: "https://www.ullapopken.com",
  },
  {
    id: "kiyonna",
    name: "Kiyonna",
    category: "premium_plus",
    scaleType: "us_alpha",
    fitPreference: "fitted",
    priceTier: 3,
    aesthetic: ["Vintage", "Lace", "Cocktail", "Bridal"],
    description: "USA-made boutique collection specializing in plus-size wedding dresses, lace cocktail apparel, and retro-chic wrap gowns.",
    fitNotes: "Structured lace wrap designs require selecting size based primarily on bust.",
    siteUrl: "https://www.kiyonna.com",
  },
  {
    id: "catherines",
    name: "Catherines",
    category: "premium_plus",
    scaleType: "us_alpha",
    fitPreference: "generous",
    priceTier: 1,
    aesthetic: ["Casual", "Loungewear", "Traditional"],
    description: "Classic and practical design for traditional taste, known for supreme fleece and cozy everyday tunics.",
    fitNotes: "Highly relaxed and generous. Sizing down one complete size is common.",
    siteUrl: "https://www.catherines.com",
  },
  {
    id: "bloomchic",
    name: "BloomChic",
    category: "premium_plus",
    scaleType: "us_num",
    fitPreference: "true_to_size",
    priceTier: 1,
    aesthetic: ["Floral", "Romantic", "Boho", "Playful"],
    description: "Empowering modern curves with playful floral prints, flowy midis, and highly stretchy romantic materials.",
    fitNotes: "Highly elastic smocked waistbands mean you can choose size purely by bust.",
    siteUrl: "https://bloomchic.com",
  },
  {
    id: "woman-within",
    name: "Woman Within",
    category: "premium_plus",
    scaleType: "us_alpha",
    fitPreference: "generous",
    priceTier: 1,
    aesthetic: ["Comfy", "Cotton", "Basic", "Colorful"],
    description: "Ultra-comfy, affordable colorful casuals with a focus on cotton knits, perfect tees, and loose fleece.",
    fitNotes: "Designed with maximum ease. Runs roughly one size larger than average.",
    siteUrl: "https://www.womanwithin.com",
  },
  {
    id: "roamans",
    name: "Roaman's",
    category: "premium_plus",
    scaleType: "us_num",
    fitPreference: "generous",
    priceTier: 2,
    aesthetic: ["Boho", "Feminine", "Office", "Elegant"],
    description: "Feminine silhouettes with touch of boho flare, featuring lace panels, gorgeous maxis, and tailored suit sets.",
    fitNotes: "Provides a relaxed but structured profile. Fits true to size with elegant ease.",
    siteUrl: "https://www.roamans.com",
  },
  {
    id: "jessica-london",
    name: "Jessica London",
    category: "premium_plus",
    scaleType: "us_num",
    fitPreference: "fitted",
    priceTier: 3,
    aesthetic: ["Sharp", "Tailored", "Corporate", "Sophisticated"],
    description: "Sleek, executive outerwear, tailored trousers, leather jackets, and pristine work dresses for professional curvy women.",
    fitNotes: "Crisp and tailored. Very little natural stretch, so measure carefully.",
    siteUrl: "https://www.jessicalondon.com",
  },
  {
    id: "onestopplus",
    name: "OneStopPlus",
    category: "premium_plus",
    scaleType: "us_num",
    fitPreference: "generous",
    priceTier: 2,
    aesthetic: ["Mall", "Variety", "Casual", "Outdoor"],
    description: "The ultimate aggregated multi-brand fashion mall dedicated exclusively to plus-size apparel.",
    fitNotes: "Since it hosts multiple brands, consult their universal guide, which leans generous.",
    siteUrl: "https://www.onestopplus.com",
  },
  {
    id: "avenue",
    name: "Avenue",
    category: "premium_plus",
    scaleType: "us_num",
    fitPreference: "true_to_size",
    priceTier: 1,
    aesthetic: ["Casual", "Boots", "Denim", "Athleisure"],
    description: "Comfortable, simple styling with an exceptional focus on wide-width footwear and premium stretch denim.",
    fitNotes: "Extremely reliable sizing. Truly true to size.",
    siteUrl: "https://www.avenue.com",
  },
  {
    id: "navabi",
    name: "Navabi",
    category: "premium_plus",
    scaleType: "us_num",
    fitPreference: "fitted",
    priceTier: 4,
    aesthetic: ["Luxury", "Avant-Garde", "Designer", "Minimalist"],
    description: "High-end global designer apparel and avant-garde styling curated for women with full figures.",
    fitNotes: "High fashion European cuts, fitted through waist and shoulders. Size up if unsure.",
    siteUrl: "https://www.navabi.co.uk",
  },

  // 2. Mainstream Brands
  {
    id: "asos-curve",
    name: "ASOS Curve",
    category: "mainstream",
    scaleType: "us_num",
    fitPreference: "fitted",
    priceTier: 2,
    aesthetic: ["Youthful", "Streetwear", "Clubwear", "Alternative"],
    description: "Trendy, youthful, and incredibly diverse. Offering the same high-energy runway-to-rack fashion as ASOS's main line.",
    fitNotes: "Typically runs true-to-UK conversion sizing. Woven, rigid materials have very little stretch. We recommend sizing up if in between.",
    siteUrl: "https://www.asos.com",
  },
  {
    id: "old-navy",
    name: "Old Navy",
    category: "mainstream",
    scaleType: "us_num",
    fitPreference: "generous",
    priceTier: 1,
    aesthetic: ["Casual", "Americana", "Family", "Bright"],
    description: "The democratic staple for size-inclusive denim, activewear, and simple family-friendly basics.",
    fitNotes: "Known to have vanity sizing. Often runs half a size larger than vintage standards.",
    siteUrl: "https://oldnavy.gap.com",
  },
  {
    id: "target-ava-viv",
    name: "Target (Ava & Viv)",
    category: "mainstream",
    scaleType: "us_num",
    fitPreference: "generous",
    priceTier: 1,
    aesthetic: ["Cute", "Casual", "Trendy", "Pastel"],
    description: "Target's signature brand for beautiful plus-size styles, colorful coordinates, and modern seasonal staples.",
    fitNotes: "Very generous waist room. Perfect for apple-shaped profiles.",
    siteUrl: "https://www.target.com",
  },
  {
    id: "walmart-terra-sky",
    name: "Walmart (Terra & Sky)",
    category: "mainstream",
    scaleType: "us_alpha",
    fitPreference: "generous",
    priceTier: 1,
    aesthetic: ["Cozy", "Basic", "Pajamas", "Workplace"],
    description: "Super-soft layering tees, stretchy denim, and ultra-affordable weekend apparel designed with comfort in mind.",
    fitNotes: "Highly forgiving knit fibers. Very spacious hips.",
    siteUrl: "https://www.walmart.com",
  },
  {
    id: "hm-plus",
    name: "H&M+",
    category: "mainstream",
    scaleType: "us_num",
    fitPreference: "fitted",
    priceTier: 1,
    aesthetic: ["Sleek", "Minimalist", "Trendy", "Euro-Chic"],
    description: "Modern minimalist fashion, neutral knit sets, tailored workwear, and affordable trends.",
    fitNotes: "European cut. Fits slightly snug in the bust and torso compared to US brands.",
    siteUrl: "https://www2.hm.com",
  },
  {
    id: "forever-21-plus",
    name: "Forever 21 Plus",
    category: "mainstream",
    scaleType: "us_alpha",
    fitPreference: "fitted",
    priceTier: 1,
    aesthetic: ["Y2K", "Clubwear", "Trendy", "Alternative"],
    description: "Affordable fast-fashion staples, high-contrast crop tops, clubwear, and modern Y2K street style.",
    fitNotes: "Sizing leans junior-plus, which runs about a size smaller than standard women's plus.",
    siteUrl: "https://www.forever21.com",
  },
  {
    id: "prettylittlething-plus",
    name: "PrettyLittleThing Plus",
    category: "mainstream",
    scaleType: "us_num",
    fitPreference: "fitted",
    priceTier: 1,
    aesthetic: ["Sexy", "Glamorous", "Clubwear", "Contouring"],
    description: "Show-stopping hourglass bodycon dresses, faux-leather separates, and high-glam streetwear.",
    fitNotes: "Designed for a highly snatched, bodycon silhouette. Snug fits, size up for comfort.",
    siteUrl: "https://www.prettylittlething.com",
  },
  {
    id: "boohoo-plus",
    name: "Boohoo Plus",
    category: "mainstream",
    scaleType: "us_num",
    fitPreference: "fitted",
    priceTier: 1,
    aesthetic: ["Youthful", "Trendy", "Casual", "Sexy"],
    description: "Quick-to-market fashion representing the highest-trending social media aesthetics at entry price.",
    fitNotes: "Fits slightly small. We suggest sizing up in outerwear and tailored pants.",
    siteUrl: "https://us.boohoo.com",
  },
  {
    id: "fashion-nova-curve",
    name: "Fashion Nova Curve",
    category: "mainstream",
    scaleType: "us_alpha",
    fitPreference: "fitted",
    priceTier: 1,
    aesthetic: ["Sexy", "Snatched", "Hourglass", "Ultra-Stretch"],
    description: "The internet-breaker for high-rise ultra-stretch jeans, hourglass bodysuits, and dramatic matching sets.",
    fitNotes: "Engineered specifically for extreme hourglass ratios (narrow waist, highly generous hips).",
    siteUrl: "https://www.fashionnova.com",
  },
  {
    id: "shein-curve",
    name: "SHEIN Curve",
    category: "mainstream",
    scaleType: "us_alpha",
    fitPreference: "true_to_size",
    priceTier: 1,
    aesthetic: ["Trendy", "Playful", "Everyday", "Diverse"],
    description: "Vast catalog of super affordable trendy outfits, activewear, swim, and accessories.",
    fitNotes: "Review individual item material list; high polyester blends have little natural stretch.",
    siteUrl: "https://www.shein.com",
  },
  {
    id: "mango",
    name: "Mango",
    category: "mainstream",
    scaleType: "us_num",
    fitPreference: "fitted",
    priceTier: 3,
    aesthetic: ["Sleek", "Neutral", "European", "Linen"],
    description: "Gorgeous Euro-style modern chic, linen dresses, tailored trenches, and beautiful earth tones.",
    fitNotes: "European styling, snug around bust. Highly recommended to check shoulder dimensions.",
    siteUrl: "https://shop.mango.com",
  },
  {
    id: "cider",
    name: "Cider",
    category: "mainstream",
    scaleType: "us_num",
    fitPreference: "true_to_size",
    priceTier: 1,
    aesthetic: ["Retro", "Cute", "Colorful", "90s"],
    description: "Whimsical retro knit tops, pattern midis, and statement cardigans with high internet fame.",
    fitNotes: "Excellent elasticity in knits. Ribbed coordinates fit beautifully.",
    siteUrl: "https://www.shopcider.com",
  },
  {
    id: "zara",
    name: "Zara",
    category: "mainstream",
    scaleType: "us_alpha",
    fitPreference: "fitted",
    priceTier: 3,
    aesthetic: ["Structured", "Minimalist", "High-Fashion"],
    description: "Sleek tailored coats, avant-garde jumpsuits, and sharp urban runway-inspired styling.",
    fitNotes: "Zara's sizing is historically narrow. Plus sizing is limited, size up for any structured items.",
    siteUrl: "https://www.zara.com",
  },
  {
    id: "gap",
    name: "Gap",
    category: "mainstream",
    scaleType: "us_num",
    fitPreference: "true_to_size",
    priceTier: 2,
    aesthetic: ["Casual", "Denim", "Khaki", "Traditional"],
    description: "The classic American uniform of beautiful denim, crisp linens, and cozy cotton sweaters.",
    fitNotes: "Reliable, classic standard fit. Moderate give in all fabrics.",
    siteUrl: "https://www.gap.com",
  },
  {
    id: "american-eagle",
    name: "American Eagle",
    category: "mainstream",
    scaleType: "us_num",
    fitPreference: "generous",
    priceTier: 2,
    aesthetic: ["Boho", "Denim", "Cozy", "Youthful"],
    description: "The crowd champion for comfy curvy denim, soft flannel check shirts, and warm lounge layers.",
    fitNotes: "Denim is incredibly stretchy and soft. High comfort index.",
    siteUrl: "https://www.ae.com",
  },
  {
    id: "abercrombie-fitch",
    name: "Abercrombie & Fitch",
    category: "mainstream",
    scaleType: "us_num",
    fitPreference: "fitted",
    priceTier: 3,
    aesthetic: ["Classic-Chic", "Preppy", "Polished", "Sleek"],
    description: "Vastly improved inclusive sizing. Their Curve Love denim line is specifically engineered for curvy shapes.",
    fitNotes: "Curve Love denim adds an extra 2 inches of room through the hips and thighs.",
    siteUrl: "https://www.abercrombie.com",
  },

  // 3. Activewear
  {
    id: "nike",
    name: "Nike",
    category: "activewear",
    scaleType: "us_alpha",
    fitPreference: "true_to_size",
    priceTier: 3,
    aesthetic: ["Athletic", "Sporty", "Sleek", "Performance"],
    description: "High-performance plus size athletic leggings, sports bras, windbreakers, and running gear.",
    fitNotes: "Compression leggings fit tightly but support beautifully. Highly supportive athletic chest cuts.",
    siteUrl: "https://www.nike.com",
  },
  {
    id: "adidas",
    name: "Adidas",
    category: "activewear",
    scaleType: "us_alpha",
    fitPreference: "true_to_size",
    priceTier: 3,
    aesthetic: ["Sporty", "Streetwear", "Retro-Athletic"],
    description: "Classic tracksuits, iconic three-stripe active wear, and breathable gym sets.",
    fitNotes: "Track jackets can fit snugly in the upper arms; we advise sizing up for layering.",
    siteUrl: "https://www.adidas.com",
  },
  {
    id: "lululemon",
    name: "Lululemon",
    category: "activewear",
    scaleType: "us_num",
    fitPreference: "fitted",
    priceTier: 4,
    aesthetic: ["Luxury", "Yoga", "Sleek", "Athleisure"],
    description: "Ultra-premium buttery-soft yoga leggings, aligned tank tops, and lightweight running jackets.",
    fitNotes: "Leggings stretch nicely but the Align tanks run snug across broad shoulders.",
    siteUrl: "https://shop.lululemon.com",
  },
  {
    id: "athleta",
    name: "Athleta",
    category: "activewear",
    scaleType: "us_num",
    fitPreference: "generous",
    priceTier: 3,
    aesthetic: ["Athleisure", "Travel", "Sustainable", "Comfy"],
    description: "Empowering activewear made from recycled sustainable fabrics, designed with amazing travel utility.",
    fitNotes: "Very generous sizing with highly forgiving, moisture-wicking materials.",
    siteUrl: "https://athleta.gap.com",
  },
  {
    id: "girlfriend-collective",
    name: "Girlfriend Collective",
    category: "activewear",
    scaleType: "us_alpha",
    fitPreference: "fitted",
    priceTier: 3,
    aesthetic: ["Minimalist", "Earthy", "Eco-Friendly", "Matte"],
    description: "Ethical, eco-friendly compressive activewear made from recycled water bottles in minimalist earth tones.",
    fitNotes: "Compression style is quite intense. Size up if you prefer a lighter, loungier fit.",
    siteUrl: "https://girlfriend.com",
  },
  {
    id: "superfit-hero",
    name: "Superfit Hero",
    category: "activewear",
    scaleType: "universal_standard",
    fitPreference: "generous",
    priceTier: 3,
    aesthetic: ["Bold", "Inclusive", "Performance", "Bright"],
    description: "A premium, proudly fat-positive brand designing high-performance activewear specifically for plus-size bodies.",
    fitNotes: "Superfit sizing is completely engineered around plus-size geometry (no simple grading up).",
    siteUrl: "https://superfithero.com",
  },
  {
    id: "fabletics",
    name: "Fabletics",
    category: "activewear",
    scaleType: "us_alpha",
    fitPreference: "true_to_size",
    priceTier: 2,
    aesthetic: ["Trendy", "Colorful", "Activewear", "Cozy"],
    description: "Fashion-forward matching activewear sets, famous for high-waisted power-hold tech.",
    fitNotes: "High compression holds curves beautifully. Sports bras have excellent band stretch.",
    siteUrl: "https://www.fabletics.com",
  },
  {
    id: "sweaty-betty",
    name: "Sweaty Betty",
    category: "activewear",
    scaleType: "us_alpha",
    fitPreference: "fitted",
    priceTier: 4,
    aesthetic: ["Luxury", "Sculpting", "Athletic", "Modern"],
    description: "Premium UK sculpting workout wear, famous for Bum-Sculpting leggings and technical apparel.",
    fitNotes: "Fitted styling. Leggings have amazing waist compression that does not roll down.",
    siteUrl: "https://www.sweatybetty.com",
  },

  // 4. Denim
  {
    id: "good-american",
    name: "Good American",
    category: "denim",
    scaleType: "us_num",
    fitPreference: "generous",
    priceTier: 4,
    aesthetic: ["Sexy", "Premium-Denim", "Snatched", "Contour"],
    description: "Co-founded by Khloé Kardashian, pioneering premium, gap-free stretch jeans designed for ultimate curves.",
    fitNotes: "Features unique contour waistbands that completely prevent gaps in the back. Highly stretchy.",
    siteUrl: "https://www.goodamerican.com",
  },
  {
    id: "levis",
    name: "Levi's",
    category: "denim",
    scaleType: "denim_waist",
    fitPreference: "true_to_size",
    priceTier: 2,
    aesthetic: ["Classic-Denim", "Heritage", "Cool", "Rugged"],
    description: "The global heritage king of structured denim, featuring timeless plus-size 311 shaping skinny and 501 original jeans.",
    fitNotes: "Shaping lines (300 series) have amazing stretch, whereas original 100% cotton lines have zero stretch.",
    siteUrl: "https://www.levi.com",
  },
  {
    id: "madewell",
    name: "Madewell",
    category: "denim",
    scaleType: "denim_waist",
    fitPreference: "generous",
    priceTier: 3,
    aesthetic: ["Indie", "Relaxed", "Classic-Chic", "Leather"],
    description: "Artisanal-quality relaxed denim, cozy knit cardigans, and perfect leather accessories.",
    fitNotes: "Denim runs slightly large. Features Magic Pocket technology for tummy contouring.",
    siteUrl: "https://www.madewell.com",
  },
  {
    id: "warp-weft",
    name: "Warp + Weft",
    category: "denim",
    scaleType: "denim_waist",
    fitPreference: "true_to_size",
    priceTier: 2,
    aesthetic: ["Modern", "Eco-Friendly", "Sleek", "Minimalist"],
    description: "Family-owned, sustainable denim powerhouse weaving their own fabric to fit full hips comfortably.",
    fitNotes: "Very soft, highly breathy organic denim. True to waist size.",
    siteUrl: "https://warpweftdenim.com",
  },
  {
    id: "democracy",
    name: "Democracy",
    category: "denim",
    scaleType: "us_num",
    fitPreference: "generous",
    priceTier: 2,
    aesthetic: ["Boho", "Casual", "Comfort-Denim"],
    description: "Famous for 'Ab'solution denim technology integrating hidden inner elastic bands for absolute comfort.",
    fitNotes: "Extremely forgiving. Hidden elastic expands up to 2 inches at the waist.",
    siteUrl: "https://democracyclothing.com",
  },

  // 5. Swimwear
  {
    id: "swimsuits-for-all",
    name: "Swimsuits For All",
    category: "swimwear",
    scaleType: "us_num",
    fitPreference: "generous",
    priceTier: 2,
    aesthetic: ["Colorful", "Glamorous", "Vacation", "Sexy"],
    description: "The absolute pioneer in body-positive designer swimwear, beach cover-ups, and flattering supportive shapewear.",
    fitNotes: "Excellent cup-sizing and built-in underwire. Power-mesh lining holds shape comfortably.",
    siteUrl: "https://www.swimsuitsforall.com",
  },
  {
    id: "summersalt",
    name: "Summersalt",
    category: "swimwear",
    scaleType: "us_num",
    fitPreference: "fitted",
    priceTier: 3,
    aesthetic: ["Colorblock", "Clean", "Playful", "Modern"],
    description: "Famous for the 'Sidestroke' colorblock swimsuit, designed with compression fabric to hold everything securely.",
    fitNotes: "High-grade compression. If you are tall or carry weight in your torso, we suggest sizing up.",
    siteUrl: "https://www.summersalt.com",
  },
  {
    id: "andie-swim",
    name: "Andie Swim",
    category: "swimwear",
    scaleType: "us_alpha",
    fitPreference: "true_to_size",
    priceTier: 3,
    aesthetic: ["Elegant", "Classy", "Minimalist", "Timeless"],
    description: "Beautifully classic, premium swimsuits focusing on customizable torso lengths, adjustable straps, and classic colors.",
    fitNotes: "Offers long-torso fits specifically for taller full-figured women.",
    siteUrl: "https://andieswim.com",
  },
  {
    id: "nomads-swimwear",
    name: "Nomads Swimwear",
    category: "swimwear",
    scaleType: "us_alpha",
    fitPreference: "true_to_size",
    priceTier: 3,
    aesthetic: ["Luxury", "Bold-Prints", "Chic"],
    description: "Luxury size-inclusive swimwear with custom destination-inspired prints and modern cutout silhouettes.",
    fitNotes: "Fits very clean and does not dig into shoulders or hips.",
    siteUrl: "https://nomadsswimwear.com",
  },

  // 6. Lingerie
  {
    id: "elomi",
    name: "Elomi",
    category: "lingerie",
    scaleType: "lingerie_bra",
    fitPreference: "true_to_size",
    priceTier: 3,
    aesthetic: ["Romantic", "Supportive", "Lace", "Intricate"],
    description: "The gold standard for full-figure, high-support gorgeous bras and intricate coordinates.",
    fitNotes: "UK cup sizing. Back bands are highly structured and don't stretch out over time.",
    siteUrl: "https://www.elomilingerie.com",
  },
  {
    id: "curvy-kate",
    name: "Curvy Kate",
    category: "lingerie",
    scaleType: "lingerie_bra",
    fitPreference: "fitted",
    priceTier: 3,
    aesthetic: ["Playful", "Sexy", "Bright", "Daring"],
    description: "Flirty, vibrant, and daring full-bust lingerie designed specifically to support and uplift larger chests.",
    fitNotes: "Runs slightly snug in the underbust band. Consider sister sizing up in band length.",
    siteUrl: "https://www.curvykate.com",
  },
  {
    id: "cacique",
    name: "Cacique",
    category: "lingerie",
    scaleType: "us_num",
    fitPreference: "generous",
    priceTier: 2,
    aesthetic: ["Classic", "Seductive", "Everyday-Luxe"],
    description: "Lane Bryant's legendary intimates brand, renowned for back-smoothing technology and beautiful designs.",
    fitNotes: "Extremely comfortable with high-density foam straps. Highly forgiving fit.",
    siteUrl: "https://www.lanebryant.com/cacique-intimates",
  },
  {
    id: "savage-x-fenty",
    name: "Savage X Fenty",
    category: "lingerie",
    scaleType: "us_alpha",
    fitPreference: "fitted",
    priceTier: 2,
    aesthetic: ["Sexy", "Modern", "Bold", "Edgy"],
    description: "Rihanna's ground-breaking size-inclusive brand celebrating fearlessness and confidence with edgy underwear.",
    fitNotes: "Snug, fitted styles designed to snatch and sculpt curves.",
    siteUrl: "https://www.savagex.com",
  },
];

// Fully inflated launch brand list
export const BRANDS: Brand[] = BRAND_DEFINITIONS_RAW.map((b) => {
  // We generate size charts for all 4 garment types + default
  const sizeChart: BrandSizeChart = {
    tops_dresses: generateSizeChartForBrand(b.scaleType, "tops_dresses", b.fitPreference),
    pants_bottoms: generateSizeChartForBrand(b.scaleType, "pants_bottoms", b.fitPreference),
    intimates_lingerie: generateSizeChartForBrand(b.scaleType, "intimates_lingerie", b.fitPreference),
    swimwear: generateSizeChartForBrand(b.scaleType, "swimwear", b.fitPreference),
    default: generateSizeChartForBrand(b.scaleType, "tops_dresses", b.fitPreference),
  };

  return {
    id: b.id,
    name: b.name,
    logo: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200&h=200", // clean generic fashion cover
    category: b.category,
    rating: 4.5 + Math.round(Math.random() * 5) / 10,
    ratingCount: 150 + Math.floor(Math.random() * 850),
    votes: 80 + Math.floor(Math.random() * 150),
    sizingRange: b.scaleType === "torrid" ? "Torrid 00 - 6 (US 10-30)" : b.scaleType === "universal_standard" ? "US 00 - 40" : "US 10 - 30",
    priceTier: b.priceTier,
    aesthetic: b.aesthetic,
    description: b.description,
    fitNotes: b.fitNotes,
    sizeChart,
    siteUrl: b.siteUrl,
  };
});

// Dynamic Unsplash covers to make listing look pristine and customized
const fashionCovers: Record<BrandCategory, string> = {
  premium_plus: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=300&h=300",
  mainstream: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=300&h=300",
  activewear: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=300&h=300",
  denim: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=300&h=300",
  swimwear: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=300&h=300",
  lingerie: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=300&h=300",
};

BRANDS.forEach((brand) => {
  brand.logo = fashionCovers[brand.category] || fashionCovers.premium_plus;
});

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: "1",
    brandId: "torrid",
    author: "Ashley Thompson",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100",
    text: "I was super nervous buying my wedding guest dress from Torrid. I am a 50\" bust and 44\" waist. Based on the sizing chart, Torrid Size 2 fits absolutely like a dream! Lots of stretch in the lace and very breathable.",
    rating: 5,
    timestamp: "July 2, 2026",
    fitsRatio: "trueToSize",
    userSize: "Size 2 (US 18-20)",
    garmentType: "tops_dresses"
  },
  {
    id: "2",
    brandId: "eloquii",
    author: "Rochelle Jenkins",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100",
    text: "Eloquii statement jackets are unmatched but beware of their rigid fabrics! I bought their blazer in US 16, which runs a bit small in the upper arms. I'd definitely recommend sizing up if you are broad-shouldered.",
    rating: 4,
    timestamp: "June 28, 2026",
    fitsRatio: "runsSmall",
    userSize: "US 16",
    garmentType: "tops_dresses"
  },
  {
    id: "3",
    brandId: "universal-standard",
    author: "Melissa Gomez",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=100&h=100",
    text: "Universal Standard is a holy grail! Remember, a Size 'S' is a US 14-16. I wear a US 16 elsewhere but their S fits generously with beautiful movement. Highly suggest their denim too, it won't stretch out over the day.",
    rating: 5,
    timestamp: "June 25, 2026",
    fitsRatio: "runsLarge",
    userSize: "S (US 14-16)",
    garmentType: "pants_bottoms"
  },
];

// Helper to convert category IDs to readable titles
export function getCategoryTitle(cat: BrandCategory): string {
  switch (cat) {
    case "premium_plus":
      return "Premium Plus Size Brands";
    case "mainstream":
      return "Mainstream Brands";
    case "activewear":
      return "Activewear";
    case "denim":
      return "Denim";
    case "swimwear":
      return "Swimwear";
    case "lingerie":
      return "Lingerie";
    default:
      return "Plus Size Brands";
  }
}

// Highly robust Multi-Category and Garment-Type Sizing conversion helper
export function convertMeasurementsToSize(
  bust: number,
  waist: number,
  hips: number,
  unit: "in" | "cm",
  brand: Brand,
  garmentType: GarmentType = "tops_dresses"
): { bestSize: string; confidence: number; fitScore: { bust: string; waist: string; hips: string } } {
  // Normalize parameters to inches
  const b = unit === "cm" ? bust / 2.54 : bust;
  const w = unit === "cm" ? waist / 2.54 : waist;
  const h = unit === "cm" ? hips / 2.54 : hips;

  // Select the specific size chart based on garment type
  const chart: SizeChart = brand.sizeChart[garmentType] || brand.sizeChart.default || brand.sizeChart.tops_dresses || {};

  let bestSize = "";
  let lowestPenalty = Infinity;
  let matches: Array<{ size: string; penalty: number }> = [];

  for (const [sizeName, ranges] of Object.entries(chart)) {
    // Penalty calculations based on the garment type priority
    const bDist = b < ranges.bust[0] ? ranges.bust[0] - b : b > ranges.bust[1] ? b - ranges.bust[1] : 0;
    const wDist = w < ranges.waist[0] ? ranges.waist[0] - w : w > ranges.waist[1] ? w - ranges.waist[1] : 0;
    const hDist = h < ranges.hips[0] ? ranges.hips[0] - h : h > ranges.hips[1] ? h - ranges.hips[1] : 0;

    let penalty = 0;
    // Set custom parameter weight ratios according to standard couture draping rules
    if (garmentType === "tops_dresses") {
      penalty = bDist * 1.8 + wDist * 1.2 + hDist * 0.4;
    } else if (garmentType === "pants_bottoms") {
      penalty = bDist * 0.0 + wDist * 1.4 + hDist * 1.8;
    } else if (garmentType === "swimwear") {
      penalty = bDist * 1.0 + wDist * 1.0 + hDist * 1.0;
    } else {
      penalty = bDist * 1.6 + wDist * 0.6 + hDist * 0.8;
    }

    matches.push({ size: sizeName, penalty });
  }

  // Sort by penalty
  matches.sort((a, b) => a.penalty - b.penalty);
  const bestMatch = matches[0] || { size: "Standard Plus", penalty: 0 };
  bestSize = bestMatch.size;

  const penaltyFactor = bestMatch.penalty;
  const confidence = Math.max(55, Math.min(100, Math.round(100 - penaltyFactor * 4)));

  const ranges = chart[bestSize] || { bust: [30, 80], waist: [20, 70], hips: [30, 90] };
  const fitScore = {
    bust: b < ranges.bust[0] ? "Slightly Loose" : b > ranges.bust[1] ? "Slightly Tight" : "Perfect",
    waist: w < ranges.waist[0] ? "Slightly Loose" : w > ranges.waist[1] ? "Slightly Tight" : "Perfect",
    hips: h < ranges.hips[0] ? "Slightly Loose" : h > ranges.hips[1] ? "Slightly Tight" : "Perfect",
  };

  return {
    bestSize,
    confidence,
    fitScore,
  };
}

// Convert from one brand size to another under the correct garment types
export function convertSizeToBrandSize(
  sourceBrandId: string,
  sourceSizeName: string,
  targetBrandId: string,
  garmentType: GarmentType = "tops_dresses",
  allBrands: Brand[] = BRANDS
): { targetSize: string; explanation: string; confidence: number } {
  const sBrand = allBrands.find((b) => b.id === sourceBrandId);
  const tBrand = allBrands.find((b) => b.id === targetBrandId);

  if (!sBrand || !tBrand) {
    return { targetSize: "N/A", explanation: "Unknown brands", confidence: 50 };
  }

  const sChart = sBrand.sizeChart[garmentType] || sBrand.sizeChart.default || {};
  const sourceRanges = sChart[sourceSizeName];
  
  if (!sourceRanges) {
    const tChart = tBrand.sizeChart[garmentType] || tBrand.sizeChart.default || {};
    const firstSize = Object.keys(tChart)[0] || "N/A";
    return { targetSize: firstSize, explanation: "Standard mapping used due to custom parameters", confidence: 70 };
  }

  // Convert using midpoints
  const avgBust = (sourceRanges.bust[0] + sourceRanges.bust[1]) / 2;
  const avgWaist = (sourceRanges.waist[0] + sourceRanges.waist[1]) / 2;
  const avgHips = (sourceRanges.hips[0] + sourceRanges.hips[1]) / 2;

  const conversion = convertMeasurementsToSize(avgBust, avgWaist, avgHips, "in", tBrand, garmentType);

  let explanation = `A ${sBrand.name} ${sourceSizeName} accommodates approx. `;
  if (garmentType === "tops_dresses") {
    explanation += `Bust ${sourceRanges.bust[0]}-${sourceRanges.bust[1]}" and Waist ${sourceRanges.waist[0]}-${sourceRanges.waist[1]}". `;
  } else if (garmentType === "pants_bottoms") {
    explanation += `Waist ${sourceRanges.waist[0]}-${sourceRanges.waist[1]}" and Hips ${sourceRanges.hips[0]}-${sourceRanges.hips[1]}". `;
  } else {
    explanation += `Bust ${sourceRanges.bust[0]}-${sourceRanges.bust[1]}" and Hips ${sourceRanges.hips[0]}-${sourceRanges.hips[1]}". `;
  }
  explanation += `In comparison, ${tBrand.name} ${conversion.bestSize} matches these measurements perfectly for ${garmentType.replace("_", " ")} garments with a confidence index of ${conversion.confidence}%.`;

  return {
    targetSize: conversion.bestSize,
    explanation,
    confidence: conversion.confidence,
  };
}
