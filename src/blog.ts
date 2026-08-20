export interface BlogSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  ranking?: BlogRankingEntry[];
}

export interface BlogRankingEntry {
  rank: number;
  brand: string;
  brandSlug: string;
  score: string;
  confidence: "High" | "Moderate" | "Low";
  verdict: string;
  watchFor: string;
}

export interface BlogResearchSource {
  label: string;
  url: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  author: string;
  publishedAt: string;
  readTime: string;
  featured?: boolean;
  sections: BlogSection[];
  researchNote?: string;
  researchSources?: BlogResearchSource[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "why-plus-size-charts-still-get-fit-wrong",
    title: "Why the size chart still gets it wrong—and what to check next",
    eyebrow: "Community-Led Fit Guide",
    summary:
      "Plus-size shoppers repeatedly describe the same contradiction: measurements are essential, yet following a chart can still produce the wrong fit. The solution is not to abandon the chart, but to read it in layers.",
    author: "Curvy& Editorial",
    publishedAt: "August 20, 2026",
    readTime: "8 min read",
    featured: true,
    sections: [
      {
        heading: "The community is not divided between people who measure and people who guess",
        paragraphs: [
          "In public plus-size fashion discussions, many shoppers say they begin with current body measurements because a familiar label can change dramatically between brands, countries, and clothing categories. Others describe following a chart carefully and still receiving an item that is much too large or too small. Both experiences can be true.",
          "The problem is that a chart is often treated as a complete prediction when it is only one piece of information. It may describe the body a brand designed for, the finished garment itself, or a broad range used across many products. It rarely explains every difference in stretch, ease, rise, length, cut, and manufacturing variation.",
        ],
      },
      {
        heading: "First, identify what the numbers actually describe",
        paragraphs: [
          "A body size chart tells you which body measurements a brand assigns to a label. A finished-garment chart tells you the dimensions of the clothing. These are not interchangeable. A pair of pants designed for a 46-inch hip might measure more than 46 inches when laid out, while a stretch garment may measure less and expand when worn.",
          "Product-specific measurements are usually more useful than one chart applied to an entire brand. Shoppers in one public discussion specifically valued listings that provide a different chart for each garment because fabric, construction, and design intent can change the fit even when the label stays the same.",
        ],
      },
      {
        heading: "Use a five-layer fit check",
        paragraphs: [
          "Instead of asking a single chart to make the whole decision, move through these five layers. Each one answers a different question.",
        ],
        bullets: [
          "Your current body measurements: measure without compressing the tape and note when the measurements were taken.",
          "The chart type: confirm whether it shows body measurements, finished-garment measurements, or both.",
          "A comparison garment: measure a similar item you already like, including waist, hip, rise, inseam, bust, or length as relevant.",
          "Construction: check fiber content, stretch, lining, closures, seam placement, and whether the intended fit is relaxed or close to the body.",
          "Review patterns: look for repeated comments about a specific area—such as a tight waist, short torso, narrow sleeve, or generous hip—not only an overall 'runs small' verdict.",
        ],
      },
      {
        heading: "When your measurements point to three different sizes",
        paragraphs: [
          "Many bodies do not sit neatly in one chart column. A shopper may match one size at the bust, another at the waist, and a third at the hip. This is not evidence that the body is wrong; it means a two-dimensional chart cannot fully describe proportion.",
          "Let the least forgiving part of the garment lead. For rigid pants, compare both waist and hip while considering rise and waistband construction. For a fitted woven dress, the bust or hip may determine whether the garment can close and hang correctly. For an open cardigan or a very stretchy top, personal preference may matter more than an exact column match.",
        ],
      },
      {
        heading: "Treat reviews as fit evidence, not a popularity vote",
        paragraphs: [
          "A useful review explains where an item felt tight or loose, whether the fabric stretched, what size was chosen, and how the reviewer preferred the garment to fit. A star rating without that context cannot reliably predict your result.",
          "Look for clusters rather than one confident opinion. If several people mention the same low rise or narrow upper arm, that pattern is worth considering. If reports conflict, differences in body shape, height, batch, or fit preference may be the explanation rather than dishonesty or a useless chart.",
        ],
      },
      {
        heading: "The practical checkout decision",
        paragraphs: [
          "Before ordering, record the size you selected and why. Save the product measurements, fabric composition, and return terms because listings can change. If uncertainty remains high, the return policy is part of the fit decision—not an administrative detail after purchase.",
          "A reliable method will not eliminate every return. It should reduce blind guessing, help you understand why a garment failed, and make the next comparison more informed. That is more useful than trying to discover one permanent 'true size' across every brand.",
        ],
      },
    ],
    researchNote:
      "These insights are informed by real conversations among plus-size shoppers about size charts, body measurements, and finding a more reliable fit.",
    researchSources: [
      {
        label: "Sizing: your ‘true size’ vs. the sizing guide?",
        url: "https://www.reddit.com/r/PlusSizeFashion/comments/1ptif7k/",
      },
      {
        label: "Brands with accurate size charts?",
        url: "https://www.reddit.com/r/PlusSizeFashion/comments/1lkt3bn/",
      },
      {
        label: "Very confused about sizing—can anyone help?",
        url: "https://www.reddit.com/r/PlusSizeFashion/comments/1cr380w/",
      },
    ],
  },
  {
    slug: "what-plus-size-clothing-is-worth-the-investment",
    title: "What is worth investing in when plus-size fit is hard to replace?",
    eyebrow: "Quality & Value",
    summary:
      "Community conversations about a worthwhile splurge point to a practical definition of luxury: dependable fit, daily comfort, durable construction, and a piece you can realistically wear again and again.",
    author: "Curvy& Editorial",
    publishedAt: "August 20, 2026",
    readTime: "8 min read",
    sections: [
      {
        heading: "A higher price is not the same as higher value",
        paragraphs: [
          "When plus-size shoppers discuss purchases they would happily make again, the answers often focus less on status and more on repeatable comfort. Supportive bras, well-made shoes, outerwear, dependable pants, sleepwear, and activewear appear because they solve frequent, fit-sensitive needs.",
          "The opposite is also visible in community feedback: an expensive fiber can pill, a familiar size can change between garments, and a final-sale bargain can become costly when it cannot be worn or returned. Price is evidence of cost, not proof of quality.",
        ],
      },
      {
        heading: "Think in terms of a fit-adjusted cost per wear",
        paragraphs: [
          "Traditional cost per wear divides the price by the number of times an item is used. For hard-to-replace sizes, add two more costs: the effort required to find a workable fit and the risk that the item cannot be returned, repaired, or altered.",
          "A moderately expensive coat worn for several winters may offer better value than three cheaper coats with weak closures or poor sleeve mobility. But a special-event garment with no likely second use may deserve a stricter budget, even if it looks exceptional once.",
        ],
      },
      {
        heading: "The categories that often earn a larger budget",
        paragraphs: [
          "The best category depends on your life, climate, body, and wardrobe—not on a universal luxury checklist. These are useful starting points because fit and comfort affect how often the item can be worn.",
        ],
        bullets: [
          "Bras and foundation garments: support, band stability, strap placement, and all-day comfort can justify specialist fitting and careful construction.",
          "Shoes and boots: width, calf room, cushioning, repairable soles, and durable uppers matter more than a visible logo.",
          "Coats and jackets: enough room to layer and move, reliable hardware, useful pockets, and climate-appropriate fabric increase repeat use.",
          "Core pants or jeans: a stable waistband, suitable rise, good recovery, and an alterable hem can make one pair a wardrobe anchor.",
          "Sleepwear and activewear: pieces used every week can deliver more everyday value than an occasional statement purchase.",
        ],
      },
      {
        heading: "Inspect construction before you inspect the brand name",
        paragraphs: [
          "Fiber content matters, but it is not a complete quality score. Look at fabric weight and opacity, seam finishing, stress-point reinforcement, pattern alignment, zipper movement, button attachment, stretch recovery, lining, and care requirements. Natural fibers can be poorly made; synthetics can be technically appropriate and durable.",
          "For online purchases, zoom into product photographs and compare the written description with the care label and reviews. Search within reviews for pilling, seam failure, shrinkage, stretching out, broken hardware, and color loss. These details say more about long-term value than a general compliment about appearance.",
        ],
      },
      {
        heading: "A sale only helps if the risk stays reasonable",
        paragraphs: [
          "Community discussions often recommend waiting for sales, but markdowns can come with final-sale restrictions or limited size exchanges. Before buying, calculate the full risk: shipping, return postage, alteration cost, care cost, and the chance that a replacement size will be unavailable.",
          "Secondhand shopping can make high-quality garments more accessible, especially when you already understand a brand's fit. Ask for garment measurements and condition details rather than relying on the label alone.",
        ],
      },
      {
        heading: "Six questions before a plus-size splurge",
        paragraphs: [
          "A worthwhile investment should survive more than the excitement of checkout. Use these questions to slow the decision without removing the pleasure from it.",
        ],
        bullets: [
          "Does it solve a recurring wardrobe need or create several outfits I genuinely want to wear?",
          "Can I compare its measurements with a garment that already fits me well?",
          "Do the fabric, seams, closures, and care instructions suit how often I plan to use it?",
          "Is the comfort improvement noticeable enough to change how often I reach for it?",
          "Can it be returned, repaired, resoled, or altered if the first fit is not perfect?",
          "Would I still choose this item without the logo, scarcity message, or sale countdown?",
        ],
      },
    ],
    researchNote:
      "This guide is informed by real conversations among plus-size shoppers about quality, comfort, and the purchases they would happily make again.",
    researchSources: [
      {
        label: "Plus-size splurge: what would you buy again?",
        url: "https://www.reddit.com/r/PlusSizeFashion/comments/1vqeivx/",
      },
      {
        label: "Which plus-size fashion sites do full-figured women shop from?",
        url: "https://www.reddit.com/r/PlusSizeFashion/comments/1t8ll9c/",
      },
      {
        label: "Experiences investing in quality basics",
        url: "https://www.reddit.com/r/PlusSizeFashion/comments/11bguw8/",
      },
    ],
  },
  {
    slug: "why-a-bigger-size-range-is-not-real-choice",
    title: "A bigger size range is not the same as real choice",
    eyebrow: "Size Inclusion",
    summary:
      "A brand can advertise extended sizing and still leave shoppers with few usable options. Real access depends on measurements, proportion, style variety, product information, and where the clothes are actually available.",
    author: "Curvy& Editorial",
    publishedAt: "August 20, 2026",
    readTime: "9 min read",
    sections: [
      {
        heading: "The size ceiling is only the first question",
        paragraphs: [
          "A label such as 4X or size 28 does not reveal the maximum bust, waist, or hip measurement a garment is designed to accommodate. Public plus-size fashion discussions repeatedly describe the disappointment of browsing a brand described as inclusive, only to discover that its highest label measures like a much smaller size elsewhere.",
          "A usable range therefore begins with transparent measurements. It should also be clear whether those measurements apply to the body, the finished garment, one category, or the entire brand.",
        ],
      },
      {
        heading: "Availability without style parity is a narrow kind of access",
        paragraphs: [
          "Shoppers are not asking only for more units of basic clothing. Discussions about limited plus-size fashion describe wanting the same freedom to explore silhouettes, colors, necklines, tailoring, subcultures, occasionwear, and current trends that smaller shoppers can access.",
          "A technically broad range can still feel restrictive when the extended sizes are offered in fewer designs, safer colors, or a separate collection built around hiding the body. Size inclusion should expand personal style rather than prescribe it.",
        ],
      },
      {
        heading: "Scaling a pattern does not solve proportion",
        paragraphs: [
          "Bodies with the same bust, waist, or hip measurement can distribute volume differently. Height, torso length, bust projection, upper-arm circumference, belly shape, thigh room, rise preference, and mobility all affect whether a garment works.",
          "Community members describe tops becoming unintentionally cropped, pants being too long, sleeves or armholes remaining narrow, and garments fitting one area while overwhelming another. These are proportion problems, not simply requests for a larger label.",
        ],
      },
      {
        heading: "Online-only sizing transfers work and risk to the shopper",
        paragraphs: [
          "A range is less accessible when its extended sizes exist online but cannot be tried on locally. Shoppers may need to order several sizes, wait for refunds, pay return postage, or commit money they cannot comfortably leave tied up. The cost is financial, practical, and emotional.",
          "Recent discussions also show how store-level inventory varies. A chain may be recommended for in-person shopping while an individual location carries only a small selection. Store-specific stock information is therefore more useful than a general statement that a retailer offers plus sizes.",
        ],
      },
      {
        heading: "A six-part test for meaningful size inclusion",
        paragraphs: [
          "When evaluating a brand, separate the marketing claim from the shopping experience. A genuinely useful range performs across several dimensions.",
        ],
        bullets: [
          "Reach: the maximum body and garment measurements, not only the highest label.",
          "Continuity: whether the range is stable across seasons instead of appearing in a short collaboration or selected products.",
          "Style parity: whether extended sizes receive comparable design choice, fabric, color, and occasion coverage.",
          "Proportion: whether the brand provides petite, tall, different inseams, useful garment dimensions, or fit notes beyond basic circumference.",
          "Availability: whether shoppers can see location-level stock, try pieces in person, or access reliable and affordable returns.",
          "Information quality: product-specific measurements, model context, fabric and stretch details, and moderated fit feedback.",
        ],
      },
      {
        heading: "How to shop the range that exists today",
        paragraphs: [
          "Begin by filtering brands by actual measurements and category rather than by a claimed size label. Check whether the particular product reaches your measurements, then evaluate length, rise, stretch, and return terms. For resale listings, request garment measurements and a clear photo of the size and care labels.",
          "Keep a short record of brands and specific categories that worked, but do not assume every future item will fit identically. The goal is not loyalty to one label. It is a personal reference system that makes a fragmented market easier to navigate while the industry catches up.",
        ],
      },
    ],
    researchNote:
      "These ideas are informed by real conversations among plus-size shoppers about style choice, extended sizing, proportions, and access to clothing in store.",
    researchSources: [
      {
        label: "A guide to the largest measurements offered by plus-size brands",
        url: "https://www.reddit.com/r/PlusSizeFashion/comments/nwprxi/",
      },
      {
        label: "Where can I find UK sizes 26–28 with real variety?",
        url: "https://www.reddit.com/r/PlusSizeFashion/comments/1vpeffu/",
      },
      {
        label: "Where can shoppers still find plus sizes in store?",
        url: "https://www.reddit.com/r/PlusSizeFashion/comments/1vk309a/",
      },
      {
        label: "What trends and styles should plus-size retail offer more often?",
        url: "https://www.reddit.com/r/PlusSizeFashion/comments/1ccx9g6/",
      },
    ],
  },
  {
    slug: "plus-size-brand-sizing-accuracy-ranking",
    title: "10 popular plus-size brands ranked for size accuracy",
    eyebrow: "2026 Brand Ranking",
    summary:
      "Which size charts are easiest to trust? Curvy& ranks 10 widely shopped brands by fit predictability, chart clarity, and recurring feedback from plus-size shoppers.",
    author: "Curvy& Editorial",
    publishedAt: "August 20, 2026",
    readTime: "11 min read",
    sections: [
      {
        heading: "What ‘size accuracy’ means in this ranking",
        paragraphs: [
          "A brand is not more accurate because its 2X happens to match another retailer's 2X. There is no universal women's sizing standard that makes one label objectively correct. For this ranking, accuracy means predictability: if a shopper uses the information a brand provides, how likely is that information to point toward a workable first size?",
          "The ranking compares ten widely shopped brands already included in the Curvy& directory. It evaluates the clarity of each public size guide, whether product or category differences are explained, and recurring patterns in public plus-size community discussions. It does not rank clothing quality, ethics, price, style, or the breadth of the size range.",
        ],
      },
      {
        heading: "How Curvy& scored the brands",
        paragraphs: [
          "Each score is an editorial rating as of August 20, 2026—not a controlled laboratory result. Recent community reports were given more weight when a brand appears to have changed its fit, sourcing, or product mix.",
        ],
        bullets: [
          "Chart clarity: Are body measurements easy to find and understand? Does the brand explain its own numbering system?",
          "Fit predictability: Do shoppers repeatedly describe the chart as a useful starting point across multiple purchases?",
          "Product context: Are garment measurements, stretch, model information, inseams, or category-specific guidance available?",
          "Consistency warnings: How often do shoppers report large differences between categories, washes, fabrics, or nominally identical products?",
          "The score estimates the chance of choosing a useful first size. It is not a guarantee that the garment will suit every body shape or fit preference.",
        ],
      },
      {
        heading: "The 2026 size-accuracy ranking",
        paragraphs: [
          "Scores are most useful as a shopping strategy. A high-ranked brand may still require adjustments for a specific category, while a lower-ranked brand can work well when detailed product measurements and reviews are available.",
        ],
        ranking: [
          {
            rank: 1,
            brand: "Universal Standard",
            brandSlug: "universal-standard",
            score: "8.5",
            confidence: "High",
            verdict:
              "Universal Standard earns the top position because its measurement-led system and wide size range make the chart a strong starting point. Community discussions repeatedly single out its denim and core pieces as unusually consistent, even when shoppers disagree about style or quality.",
            watchFor:
              "Its letter scale is intentionally different from conventional sizing—an M represents a much larger numerical size than at most brands. Ignore your familiar letter, read the measurements, and check whether a relaxed cut is meant to look oversized.",
          },
          {
            rank: 2,
            brand: "Torrid",
            brandSlug: "torrid",
            score: "8.0",
            confidence: "Moderate",
            verdict:
              "Torrid's 00–6 system is easy to learn, and many shoppers use its chart as a personal reference when comparing unfamiliar brands. Community feedback often describes the published measurements as accurate when fabric and intended fit are considered.",
            watchFor:
              "Stretchy knits, structured pieces, upper-arm room, bra styles, and denim washes can shift the result. Reports of different fits between similar or even matching jeans mean product reviews still matter.",
          },
          {
            rank: 3,
            brand: "BloomChic",
            brandSlug: "bloomchic",
            score: "7.5",
            confidence: "Moderate",
            verdict:
              "Recent discussion is more positive about BloomChic sizing than its variable product quality might suggest. Multiple shoppers report that their usual size or the listed measurements produced a workable fit, particularly in dresses and longer tops.",
            watchFor:
              "Feedback is not unanimous, and one general measurement set cannot predict every silhouette. Length can overwhelm petite shoppers, non-stretch bust areas may feel snug, and stretch styles may feel generous.",
          },
          {
            rank: 4,
            brand: "ELOQUII",
            brandSlug: "eloquii",
            score: "7.0",
            confidence: "Moderate",
            verdict:
              "ELOQUII provides a detailed chart that includes bust, waist, hip, and biceps—useful information that many competitors omit. Shoppers often report good results when they follow the measurements for structured dresses, tailoring, and occasionwear.",
            watchFor:
              "The brand's close-fitting and woven styles leave less margin for error. Fuller busts, bodysuits, bodycon pieces, and unforgiving fabrics may require sizing up, and older discussions report more cross-item variation.",
          },
          {
            rank: 5,
            brand: "ASOS Curve",
            brandSlug: "asos-curve",
            score: "6.8",
            confidence: "Moderate",
            verdict:
              "ASOS Curve's own-label sizing is reasonably predictable once shoppers learn that many tops and dresses are cut generously. Pants are more often described as closer to the listed size, and model-size information can help interpret the silhouette.",
            watchFor:
              "ASOS is also a marketplace. The ASOS Curve chart should not be applied automatically to every third-party brand sold on the site. Separate the own-label range from outside labels before comparing reviews.",
          },
          {
            rank: 6,
            brand: "Lane Bryant",
            brandSlug: "lane-bryant",
            score: "6.5",
            confidence: "Moderate",
            verdict:
              "Lane Bryant's core body chart and long history in plus-specific fit make it a useful starting point, and some shoppers report true-to-size results across its main apparel. Different inseams and body-focused denim cuts can improve predictability.",
            watchFor:
              "Community reports repeatedly separate categories: structured pants, swimwear, some intimates, and band sizing may feel small while dresses or button-downs can feel generous. Treat each category as its own fit system.",
          },
          {
            rank: 7,
            brand: "SHEIN Curve",
            brandSlug: "shein-curve",
            score: "6.2",
            confidence: "Moderate",
            verdict:
              "SHEIN's label is difficult to compare with other brands, but product-level garment measurements, fabric details, and customer photos can make an individual listing more predictable than the headline size suggests.",
            watchFor:
              "Never order from the 1X–4X label alone. Different suppliers and fabrics create large item-to-item variation, so recheck the product measurements and recent photo reviews for every garment—even after one successful order.",
          },
          {
            rank: 8,
            brand: "Madewell",
            brandSlug: "madewell",
            score: "6.0",
            confidence: "Moderate",
            verdict:
              "Madewell publishes a comparatively detailed chart and clearly distinguishes straight numerical sizes from W sizing. That makes measurement-based comparison possible, especially for shoppers who understand which pattern block they are buying.",
            watchFor:
              "Denim cut, wash, and stretch can change the fit, and a 14 is not equivalent to a 14W. Community feedback recommends comparing inches rather than assuming the same waist label or wash will behave identically.",
          },
          {
            rank: 9,
            brand: "Good American",
            brandSlug: "good-american",
            score: "5.5",
            confidence: "Low",
            verdict:
              "Good American offers many distinct denim fits and useful details such as rise and inseam, but the number of fabric technologies and silhouettes makes one brand-wide size difficult to predict. A successful fit in one line may not transfer to another.",
            watchFor:
              "Always Fits spans several numerical sizes by design and can feel loose in the crotch or waist for some proportions. Stretch recovery, waist-to-hip shape, and intended looseness should lead the decision—not the name of the fit family.",
          },
          {
            rank: 10,
            brand: "Old Navy",
            brandSlug: "old-navy",
            score: "4.5",
            confidence: "Low",
            verdict:
              "Old Navy provides an accessible chart and many fit, length, and stretch options, but current community feedback contains the strongest repeated warnings about inconsistency across categories and between garments carrying the same nominal size.",
            watchFor:
              "Try on when possible, or order only with a workable return plan. Pants and jeans receive the most inconsistency reports, including differences between colors, washes, and apparently identical products.",
          },
        ],
      },
      {
        heading: "How to use the ranking without letting it choose for you",
        paragraphs: [
          "Start with the score, then read the warning that belongs to the garment category you are buying. At Universal Standard or Torrid, the published chart may be a strong first step, but fabric and silhouette still matter. At SHEIN Curve, Good American, or Old Navy, product-level information and an easy return path carry more of the decision.",
          "If your bust, waist, and hip fall into different sizes, a brand's ranking cannot decide which part of the body you should prioritize. Choose according to the least flexible area of the garment and your preferred ease. A technically accurate chart can still describe a pattern block that does not suit your proportions.",
        ],
      },
      {
        heading: "Why this ranking will change",
        paragraphs: [
          "Brands change designers, factories, fabrics, fit models, and product categories. Community reports also become more useful as more shoppers describe exact garments and measurements. Curvy& will treat this as a dated editorial snapshot rather than a permanent verdict.",
          "The most valuable future evidence will come from product-specific fit notes: the size selected, the relevant body or comparison-garment measurements, where the item fit differently than expected, and whether the fabric changed after wear. That kind of detail can eventually make category-level ratings more useful than one score for an entire brand.",
        ],
      },
    ],
    researchNote:
      "This ranking is informed by real conversations among plus-size shoppers and cross-checked against the brands' publicly available sizing information. Individual fit experiences vary by garment, fabric, body proportions, and fit preference.",
    researchSources: [
      {
        label: "Community comparison of consistency across Universal Standard, Torrid, and Lane Bryant",
        url: "https://www.reddit.com/r/PlusSizeFashion/comments/1njctge/",
      },
      {
        label: "Torrid sizing and chart experiences",
        url: "https://www.reddit.com/r/PlusSizeFashion/comments/166q45w/",
      },
      {
        label: "BloomChic sizing experiences",
        url: "https://www.reddit.com/r/PlusSizeFashion/comments/1pqlq49/",
      },
      {
        label: "ELOQUII measurement and occasionwear sizing discussion",
        url: "https://www.reddit.com/r/PlusSize/comments/1vlx3dz/",
      },
      {
        label: "ASOS Curve fit experiences",
        url: "https://www.reddit.com/r/PlusSize/comments/dtpgh3/",
      },
      {
        label: "Lane Bryant category and sizing experiences",
        url: "https://www.reddit.com/r/PlusSize/comments/1cnjw34/",
      },
      {
        label: "SHEIN Curve product-measurement experiences",
        url: "https://www.reddit.com/r/PlusSizeFashion/comments/zlvfnx/",
      },
      {
        label: "Madewell W sizing and denim-wash differences",
        url: "https://www.reddit.com/r/PlusSizeFashion/comments/14qtx1n/",
      },
      {
        label: "Good American denim consistency discussion",
        url: "https://www.reddit.com/r/UninfluencedReviews/comments/1r5u54h/",
      },
      {
        label: "Old Navy cross-category and same-size inconsistency discussion",
        url: "https://www.reddit.com/r/PlusSizeFashion/comments/1ptfq01/",
      },
    ],
  },
];

export const getBlogPost = (slug: string) =>
  BLOG_POSTS.find((post) => post.slug === slug);
