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

  let logoUrl = "";
  try {
    const domain = new URL(b.siteUrl).hostname.replace(/^www\./, "");
    logoUrl = `https://logo.clearbit.com/${domain}`;
  } catch (e) {
    logoUrl = "";
  }

  // Predefined anchor votes, ratings, and rating counts for top brands to create an authentic leaderboard
  const anchors: Record<string, { votesUp: number; votesDown: number; rating: number; count: number }> = {
    "torrid": { votesUp: 2842, votesDown: 142, rating: 4.8, count: 3102 },
    "universal-standard": { votesUp: 2453, votesDown: 94, rating: 4.9, count: 2684 },
    "eloquii": { votesUp: 1982, votesDown: 218, rating: 4.7, count: 2150 },
    "lane-bryant": { votesUp: 1720, votesDown: 245, rating: 4.6, count: 1890 },
    "cacique": { votesUp: 1451, votesDown: 130, rating: 4.7, count: 1610 },
    "savage-x-fenty": { votesUp: 1635, votesDown: 341, rating: 4.5, count: 1845 },
    "h-and-m-plus": { votesUp: 820, votesDown: 652, rating: 3.8, count: 1140 },
    "asos-curve": { votesUp: 1295, votesDown: 742, rating: 4.1, count: 1560 },
    "target-ava-and-viv": { votesUp: 954, votesDown: 198, rating: 4.4, count: 1205 },
    "shein-curve": { votesUp: 412, votesDown: 1120, rating: 3.1, count: 1490 },
    "skims": { votesUp: 1512, votesDown: 280, rating: 4.6, count: 1730 },
    "good-american": { votesUp: 1355, votesDown: 148, rating: 4.7, count: 1520 },
  };

  const hasAnchor = anchors[b.id];
  let finalRating = 4.0;
  let finalRatingCount = 120;
  let finalVotesUp = 95;
  let finalVotesDown = 25;

  if (hasAnchor) {
    finalRating = hasAnchor.rating;
    finalRatingCount = hasAnchor.count;
    finalVotesUp = hasAnchor.votesUp;
    finalVotesDown = hasAnchor.votesDown;
  } else {
    const idHash = b.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // Large, realistic-looking spreads (from 32 to 850)
    finalVotesUp = 32 + (idHash * 23) % 820;
    finalRating = Math.round((3.5 + (idHash % 13) / 10) * 10) / 10;
    finalRatingCount = finalVotesUp + 80 + (idHash * 5) % 350;
    finalVotesDown = Math.round(finalVotesUp * ((5 - finalRating) / 2.5 + 0.1));
  }

  return {
    id: b.id,
    name: b.name,
    logo: logoUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200&h=200", // real brand logo URL from clearbit or placeholder
    category: b.category,
    rating: finalRating,
    ratingCount: finalRatingCount,
    votes: finalVotesUp - finalVotesDown,
    votesUp: finalVotesUp,
    votesDown: finalVotesDown,
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
  brand.coverImage = fashionCovers[brand.category] || fashionCovers.premium_plus;
});

// Deterministic generator to build 5 high-quality, authentic sizing reviews for each of our 56 brands
function generateAllBrandComments(): Comment[] {
  const reviewerPool = [
    { name: "Sarah Thompson", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100" },
    { name: "Rochelle Jenkins", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100" },
    { name: "Melissa Gomez", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=100&h=100" },
    { name: "Keisha Washington", avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=100&h=100" },
    { name: "Ashley Miller", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100" },
    { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=100&h=100" },
    { name: "Aria Takahashi", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100&h=100" },
    { name: "Chloe Dupont", avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&q=80&w=100&h=100" },
    { name: "Jessica Carter", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=100&h=100" },
    { name: "Natasha Vance", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100" },
    { name: "Imani Jackson", avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=100&h=100" },
    { name: "Sophia Martinez", avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=100&h=100" },
    { name: "Chloe Henderson", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=100&h=100" },
    { name: "Jasmine Woods", avatar: "https://images.unsplash.com/photo-1523350165414-082d792c9b7e?auto=format&fit=crop&q=80&w=100&h=100" },
    { name: "Yuki Tanaka", avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&q=80&w=100&h=100" },
    { name: "Tasha Davis", avatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=100&h=100" },
    { name: "Bianca Cruz", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100&h=100" },
    { name: "Gabriela Silva", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100" },
    { name: "Latoya Jenkins", avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=100&h=100" },
    { name: "Amara Okoye", avatar: "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?auto=format&fit=crop&q=80&w=100&h=100" }
  ];

  const datePool = [
    "July 6, 2026",
    "July 4, 2026",
    "July 1, 2026",
    "June 25, 2026",
    "June 18, 2026",
    "June 12, 2026",
    "June 5, 2026",
    "May 28, 2026",
    "May 15, 2026",
    "May 2, 2026"
  ];

  const generatedList: Comment[] = [];
  let globalIdCounter = 1;

  BRANDS.forEach((brand) => {
    // Determine the typical sizes for this brand from its default sizing chart
    const defaultChart = brand.sizeChart.default || brand.sizeChart.tops_dresses || {};
    const sizeKeys = Object.keys(defaultChart);
    const sizeCount = sizeKeys.length;

    // We generate 5 mixed-quality real-feeling reviews for each brand
    for (let i = 0; i < 5; i++) {
      // Deterministically pick reviewer, date, and size to avoid random fluttering
      const baseHash = brand.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) + i;
      const reviewer = reviewerPool[baseHash % reviewerPool.length];
      const date = datePool[(baseHash * 3) % datePool.length];
      const sizeIndex = Math.min(sizeCount - 1, Math.max(0, (baseHash * 2) % (sizeCount || 1)));
      const sizeStr = sizeKeys[sizeIndex] || "Standard Size";

      let text = "";
      let rating = 5;
      let fitsRatio: "runsSmall" | "trueToSize" | "runsLarge" = "trueToSize";
      let gType: "tops_dresses" | "pants_bottoms" | "swimwear" | "intimates_lingerie" = "tops_dresses";

      if (brand.category === "denim") {
        gType = "pants_bottoms";
        if (i === 0) {
          rating = 5;
          fitsRatio = "trueToSize";
          text = `Finally, jeans that don't gap in the back! I ordered my recommended ${sizeStr} in ${brand.name} and the mid-section hold is perfect. The wash is rich, and there is just enough stretch to hug my thighs without sagging by the end of the day. Absolute premium quality.`;
        } else if (i === 1) {
          rating = 4;
          fitsRatio = "runsLarge";
          text = `Super soft and extremely comfortable, but they definitely run a bit loose in the waist after a few hours of wear. I wear ${sizeStr} but I could have easily sized down for a tighter, more contoured fit. If you're in between sizes, consider sizing down!`;
        } else if (i === 2) {
          rating = 3;
          fitsRatio = "runsSmall";
          text = `The material feels incredibly luxurious and durable, but there is almost zero stretch in the waistband on this specific cut. The hips fit nicely, but I had to squeeze to button them up in my usual ${sizeStr}. Definitely recommend sizing up if you carry weight in your midsection.`;
        } else if (i === 3) {
          rating = 2;
          fitsRatio = "runsSmall";
          text = `Highly disappointed with the rigid fabric on this style. I ordered the ${sizeStr} and could barely pull them over my calves. Sizing seems much smaller than previous seasons. The hip room is way too narrow for hourglass figures.`;
        } else {
          rating = 5;
          fitsRatio = "trueToSize";
          text = `Obsessed! These ${brand.name} jeans are a game-changer. They shape my curves beautifully and the length is perfect for taller girls. Got so many compliments on the fit. True to size and worth every penny.`;
        }
      } else if (brand.category === "activewear") {
        if (i === 0) {
          rating = 5;
          fitsRatio = "trueToSize";
          gType = "pants_bottoms";
          text = `These leggings are completely squat-proof and buttery soft! I got the ${sizeStr} and the high waist stays put during my entire HIIT workout. Absolutely no rolling down, which is a miracle for full tummies.`;
        } else if (i === 1) {
          rating = 4;
          fitsRatio = "runsLarge";
          gType = "tops_dresses";
          text = `Amazing quality athletic wear, but the tops are quite long and generous in the chest area. My ${sizeStr} fits okay, but the underarm gaps a little bit. Sizing down would give better athletic support.`;
        } else if (i === 2) {
          rating = 3;
          fitsRatio = "runsSmall";
          gType = "pants_bottoms";
          text = `The compression in these leggings is intense! It really holds you in, but the waistband is so tight it digs in. I ordered my usual ${sizeStr} but I wish I had sized up for a more comfortable lounge fit.`;
        } else if (i === 3) {
          rating = 2;
          fitsRatio = "runsSmall";
          gType = "tops_dresses";
          text = `Very disappointed in the arm room for the active jacket. I am a standard ${sizeStr}, but the sleeves are so tight in the upper arms I can't layer a long-sleeve tee underneath. The fabric has very little give.`;
        } else {
          rating = 5;
          fitsRatio = "trueToSize";
          gType = "intimates_lingerie";
          text = `Excellent support! The sports bra in ${sizeStr} keeps everything secure without hurting my shoulders. ${brand.name} really understands plus-size active needs. Highly breathable fabric too.`;
        }
      } else if (brand.category === "swimwear") {
        gType = "swimwear";
        if (i === 0) {
          rating = 5;
          fitsRatio = "trueToSize";
          text = `Most flattering swimsuit I've ever owned! I got the ${sizeStr} to get extra coverage and it fits beautifully. The power-mesh lining holds everything in place without feeling restrictive at all.`;
        } else if (i === 1) {
          rating = 4;
          fitsRatio = "runsLarge";
          text = `Beautiful colors and thick, double-lined fabric. However, the bust cups run a bit large and have no underwire support. I ordered the ${sizeStr}, but if you have a smaller chest relative to your hips, consider sizing down.`;
        } else if (i === 2) {
          rating = 3;
          fitsRatio = "runsSmall";
          text = `Gorgeous design but the torso is extremely short. I ordered the ${sizeStr} and it digs into my shoulders quite a bit. Best suited for petite or shorter torsos. I'd recommend sizing up for height.`;
        } else if (i === 3) {
          rating = 2;
          fitsRatio = "runsSmall";
          text = `Hard to get on and the leg holes are cut way too high and tight. I ordered my recommended ${sizeStr} and it pinched my hips terribly. Not designed well for pear shapes. Definitely size up.`;
        } else {
          rating = 5;
          fitsRatio = "trueToSize";
          text = `Love the high waist bottom and top set! Holds up perfectly in the pool and ocean. Got the ${sizeStr} and it supports my full bust incredibly well. Will buy in more prints!`;
        }
      } else if (brand.category === "lingerie") {
        gType = "intimates_lingerie";
        if (i === 0) {
          rating = 5;
          fitsRatio = "trueToSize";
          text = `A masterpiece of comfort and support. The straps are wide and don't dig in, and the band has the perfect amount of structure. Ordered ${sizeStr} and it feels custom-made for my shape. Absolute romantic lace!`;
        } else if (i === 1) {
          rating = 4;
          fitsRatio = "runsLarge";
          text = `Beautiful, soft, and sexy. The cups run slightly roomy, so I have a tiny bit of gapping at the top of my ${sizeStr}. Sizing down one cup size would make it perfect, but the band fits comfortably snug.`;
        } else if (i === 2) {
          rating = 3;
          fitsRatio = "runsSmall";
          text = `The lace is stunning and feels very premium, but the underbust band runs very snug with little stretch. I ordered ${sizeStr} and had to use an extender on the first few wears. Consider sister-sizing up for band comfort.`;
        } else if (i === 3) {
          rating = 2;
          fitsRatio = "runsSmall";
          text = `Extremely tight cups. I usually wear ${sizeStr} but this spilled over completely at the sides and top. Sizing up is absolutely mandatory. The wire is also quite stiff and pokes.`;
        } else {
          rating = 5;
          fitsRatio = "trueToSize";
          text = `Absolutely gorgeous satin and lace bodysuit. It has amazing stretch through the torso, and fits a larger bust perfectly. My ${sizeStr} looks incredible and feels super empowering!`;
        }
      } else {
        // Premium plus & Mainstream
        if (i === 0) {
          rating = 5;
          fitsRatio = "trueToSize";
          gType = "tops_dresses";
          text = `This fits absolutely like a dream! I wore my recommended ${sizeStr} to an evening gala and received endless compliments. The drape is elegant, the fabric has excellent weight, and it flows beautifully over my curves.`;
        } else if (i === 1) {
          rating = 4;
          fitsRatio = "runsLarge";
          gType = "tops_dresses";
          text = `Incredibly cozy and chic, but the cut is definitely oversized and very generous. My usual ${sizeStr} is super roomy. I don't mind the slouchy look, but if you want a more tailored silhouette, order one size down.`;
        } else if (i === 2) {
          rating = 3;
          fitsRatio = "runsSmall";
          gType = "tops_dresses";
          text = `The pattern and color are stunning, but the waist seam has absolutely zero stretch. I ordered ${sizeStr} and it fits my bust nicely, but it's very tight around the ribcage. Definitely size up if you have an apple shape.`;
        } else if (i === 3) {
          rating = 2;
          fitsRatio = "runsSmall";
          gType = "tops_dresses";
          text = `Runs extremely narrow through the shoulders and arms. I could barely move my elbows in the ${sizeStr} jacket. The body fits fine, but the sleeve grading is completely off for standard plus-size arms.`;
        } else {
          rating = 5;
          fitsRatio = "trueToSize";
          gType = "tops_dresses";
          text = `Perfect wrap style top! It's so hard to find wrap tops that don't gap at the bust, but this one has a small snap button that holds everything in place perfectly. True to ${sizeStr} and beautifully made.`;
        }
      }

      generatedList.push({
        id: (globalIdCounter++).toString(),
        brandId: brand.id,
        author: reviewer.name,
        avatar: reviewer.avatar,
        text,
        rating,
        timestamp: date,
        fitsRatio,
        userSize: sizeStr,
        garmentType: gType
      });
    }
  });

  return generatedList;
}

export const INITIAL_COMMENTS: Comment[] = generateAllBrandComments();

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
