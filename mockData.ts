import { FashionInput, FashionResult, LoveInput, LoveResult, SportsInput, SportsResult, HealthInput, HealthResult } from "./types";

// ==========================================
// FASHION MOCK GENERATOR
// ==========================================
export function generateMockFashion(input: FashionInput): FashionResult {
  const { bust, waist, hips, style, colors, season, occasion } = input;
  
  // Calculate a mock shape name based on real proportional ratios
  let shape = "Celestial Hourglass";
  let description = "Your proportions are beautifully balanced with a clearly defined waist, creating a timeless editorial silhouette that is celebrated across luxury couture.";
  let principles = [
    "Define the natural waistline with structured tailoring, wrap closures, or high-rise belts.",
    "Highlight the neckline with open décolletage, V-necks, or sweetheart cuts.",
    "Choose fluid, luxury fabrics like heavy silk, linen, or fine knits that drape elegantly."
  ];

  if (hips > bust + 8) {
    shape = "Vibrant Majestic Pear";
    description = "Your silhouette features a beautifully defined waist paired with rich, expressive hips, a shape celebrated in high-art portraiture and modern high fashion.";
    principles = [
      "Draw visual interest upward with structured shoulders, wide collars, or statement accessories.",
      "Opt for fluid A-line skirts or elegant wide-leg trousers that fall effortlessly from the hips.",
      "Play with high-contrast layering to create visual length and balanced editorial volume."
    ];
  } else if (bust > hips + 8) {
    shape = "Empowered Golden Apple";
    description = "Your shape boasts a magnificent bust and slender legs, carrying strength in your upper body—a silhouette that commands attention on the runway.";
    principles = [
      "Embrace fluid tunic cuts, empire lines, and structured column silhouettes.",
      "Showcase your phenomenal legs with tasteful slits, high-low hems, or tailored midi skirts.",
      "Choose soft, structured drapes like crepe-de-chine that contour without clinging."
    ];
  } else if (Math.abs(hips - bust) <= 6 && Math.abs(waist - hips) <= 10) {
    shape = "Royal Column Rectangle";
    description = "Your silhouette features a streamlined balance from shoulders to hips, creating a high-fashion architectural canvas that is ideal for structured tailoring and bold patterns.";
    principles = [
      "Create high-contrast focal points with asymmetric lines, statement ruffles, or layered outerwear.",
      "Experiment with waist-defining accessories, or lean into sophisticated slouchy-chic silhouettes.",
      "Leverage premium textured fabrics—tweed, brocade, or heavy satin—to add gorgeous dimension."
    ];
  }

  // Generate customized outfit based on selected style and colors
  const colorStr = colors.length > 0 ? colors.join(" & ") : "Monochromatic Charcoal";
  const outfitName = `${style.charAt(0).toUpperCase() + style.slice(1)} Editorial Look`;
  
  return {
    bodyShape: shape,
    shapeDescription: description,
    stylingPrinciples: principles,
    outfits: [
      {
        name: outfitName,
        formula: `A beautifully tailored, double-breasted duster coat in ${colorStr}, layered over a sleek high-waisted wrap skirt and a soft cream silk camisole.`,
        stylingTrick: `Pair this ensemble with premium knee-high leather boots. The long, continuous vertical line creates a striking Vogue presence, perfect for ${occasion}.`,
        colors: colorStr
      },
      {
        name: `${season.charAt(0).toUpperCase() + season.slice(1)} Sunset Lounge`,
        formula: `An open-collar oversized linen button-down tucked gently into premium high-rise flowing palazzo trousers in coordinating earthy ${colors[0] || "neutral"} tones.`,
        stylingTrick: "Push up the sleeves to the mid-forearm to show off the wrists and accessorize with stacked gold bangles for effortless elegance.",
        colors: colors.length > 1 ? `${colors[0]} & ${colors[1]}` : "Earthy Sand"
      },
      {
        name: "Couture Gala Statement",
        formula: `An exquisite asymmetric off-the-shoulder midaxi dress in rich satin, custom-cut to hug your curves at the ${waist}cm waistline and flow smoothly over your ${hips}cm hips.`,
        stylingTrick: "Opt for a statement chandelier earring on the open shoulder side and keep the neckline bare to celebrate your neck and collarbone.",
        colors: colors[1] || "Deep Merlot"
      }
    ],
    brands: [
      {
        name: "Eloquii",
        why: "Renowned for their runway-inspired designs and exceptional sizing expertise. They construct garments with specific curve adjustments, such as double bust-darts and flexible seam allowances, making them a staple for fashion-forward wardrobes.",
        priceRange: "$$"
      },
      {
        name: "ASOS Curve & Luxe",
        why: "Perfect for high-fashion, youthful silhouettes, dramatic sleeves, and gorgeous tailored outerwear. They translate high-street runway trends into impeccably fitting curvy designs with incredible size representation.",
        priceRange: "$$"
      },
      {
        name: "Marina Rinaldi",
        why: "A Max Mara Group brand. This is high-end Italian luxury tailoring specifically engineered for larger sizes. Unbelievable premium fabrics like cashmere, silk, and virgin wool crafted with flawless precision.",
        priceRange: "$$$$"
      }
    ],
    stylingAdvice: `Never shrink your presence. Your measurements (${bust}cm - ${waist}cm - ${hips}cm) represent strength, elegance, and beauty. Fashion is an interactive art gallery where your body is the main curator. Dress to express your internal power, play with bold volumes, and walk into every room in ${season} knowing that Curvy is not a size—it is a statement.`,
    isMock: true
  };
}

// ==========================================
// LOVE & DATING MOCK GENERATOR
// ==========================================
export function generateMockLove(input: LoveInput): LoveResult {
  const { age, location, intention, preferences } = input;
  
  const intentionLabel = intention === "serious" ? "深度的长期伴侣关系" : "自信、轻松、充满趣味的浪漫接触";
  
  return {
    introduction: `在这个以大码美学为傲的新时代，寻找爱是一场探索自我的华丽旅程。${age}岁的你立足于${location || "璀璨都市"}，正期待着一场${intentionLabel}。我们理解你的美丽值得被懂欣赏的人珍藏。`,
    whyWooPlus: `针对你的偏好，【WooPlus】是目前全球大码群体最认可、最具温度的约会空间。这里不仅汇集了真正热爱曲线美、懂得大码女性独特魅力的优质男性，更建立了一个无偏见、严禁身材羞辱的清爽互动环境。相比于其他大众软件，WooPlus 上的用户能让你无需任何隐瞒或解释，在第一秒就大方展现你完美的身材比例。`,
    profileTips: {
      tagline: `“有脑子有曲线，不惧任何镜头的摩登 ${age} 岁女孩。寻找懂得欣赏艺术与生命的温暖灵魂。”`,
      photoAdvice: "一定要放一张全景照！建议身穿能体现你傲人比例的经典包臀裙、或者是在明亮咖啡馆里自信大笑的抓拍。光线要自然温暖，眼神坚定直视镜头。拒绝过度的美颜滤镜，你的自然肤色和自信气场，才是让人心动的高级感。",
      icebreakers: [
        "“Hi! 如果要用一种美食或者艺术流派来形容我们俩即将开始的聊天，你觉得会是什么？”",
        "“我看你的资料也对旅行感兴趣！如果你可以立刻飞到世界上任何一个地方，但只能打包一件衣服，你会去哪，穿什么？”",
        "“比起无聊的‘在吗’，我想问：你最近听到过最能让你心跳加速的一首歌是什么？”"
      ]
    },
    dateIdeas: [
      {
        title: "法式复古小酒馆夜半微醺",
        description: "选择一家灯光昏暗、桌上点着香薰蜡烛的法式小酒馆。点一杯梅洛红酒和一盘精致的起司拼盘。在慵懒的爵士乐中，并肩坐在一处。这种极具包裹感的温暖环境能让你和对方都放松下来，最适合深度的灵魂沟通。",
        vibe: "浪漫、感性、亲密"
      },
      {
        title: "现代美术馆漫步与手作午后",
        description: "挑选一个阳光极好的下午，约在当代艺术馆。一起在抽象画作前逗留，分享彼此天马行空的解读。随后去附近的手作陶艺店，在泥土与旋转的指尖中，享受自然的肢体接触与欢笑，打破第一次见面的紧绷感。",
        vibe: "知性、轻松、富有创意"
      }
    ],
    empowermentQuote: "“爱从来不是因为你变得‘更完美、更纤细’才降临。爱你的人，会先爱上你走在街上时的自信，以及你拥抱世界时的饱满。你的曲线是爱的发生地，而不是阻碍。”",
    isMock: true
  };
}

// ==========================================
// SPORTS & WORKOUT MOCK GENERATOR
// ==========================================
export function generateMockSports(input: SportsInput): SportsResult {
  const { weeklyHours, preferredType, intensity } = input;
  
  const dailyMins = Math.round((weeklyHours * 60) / 3);
  
  // Custom workouts depending on preferredType
  let workouts = [
    {
      day: "周一 (Monday)",
      activity: "活力曲线律动 (Dynamic Rhythm Flow)",
      duration: `${dailyMins} 分钟`,
      instructions: "进行中低强度的节拍律动或有氧尊巴。这可以快速唤醒心肺，同时在欢快的音乐下释放多巴胺。动作核心是保护膝盖，落地时利用脚掌和脚后跟的起承转合吸收冲击力。"
    },
    {
      day: "周三 (Wednesday)",
      activity: "抗阻塑形与自重支撑 (Resilient Strength Sculpt)",
      duration: `${dailyMins} 分钟`,
      instructions: "针对大肌群（臀部、腿部、背部）的自重深蹲（后靠背椅子辅助）和哑铃划船。大码群体的肌肉蕴含着惊人的力量，通过抗阻训练可以激活关节支撑力，让身体更稳固、更富张力。"
    },
    {
      day: "周五 (Friday)",
      activity: "舒展与关节理疗瑜伽 (Nourishing Joint Yoga)",
      duration: `${dailyMins} 分钟`,
      instructions: "深度髋部拉伸、猫牛式以及垫上支撑。通过温和的瑜伽体式，充分释放下背部和膝部由于日常承重累积的张力。动作以呼吸为指引，注重拉长脊柱，不追求高难度折叠。"
    }
  ];

  if (preferredType.toLowerCase().includes("yoga") || preferredType.toLowerCase().includes("flexibility")) {
    workouts = [
      {
        day: "周一 (Monday)",
        activity: "流瑜伽与腹式呼吸 (Vinyasa Flow & Breathwork)",
        duration: `${dailyMins} 分钟`,
        instructions: "通过温柔连贯的流瑜伽动作，配合深沉的腹式呼吸。专注于动作之间的过渡，感受脚掌在垫子上的扎实抓地力，拉长每一根紧绷的肌纤维。"
      },
      {
        day: "周三 (Wednesday)",
        activity: "核心稳固与臀桥修复 (Core Stability & Glute Bridge)",
        duration: `${dailyMins} 分钟`,
        instructions: "利用臀桥和猫牛式变体，重点强化骨盆底肌和下背部核心。这能完美分担膝关节的承重压力，让你的走姿更挺拔、更优雅。"
      },
      {
        day: "周五 (Friday)",
        activity: "阴瑜伽深层肌膜释放 (Yin Yoga Fascia Release)",
        duration: `${dailyMins} 分钟`,
        instructions: "每个体式保持3-5分钟的温和阴瑜伽。使用抱枕或毯子垫在膝关节和髋部下方，给身体最温柔的物理支撑，深度滋养关节与韧带。"
      }
    ];
  } else if (preferredType.toLowerCase().includes("cardio") || preferredType.toLowerCase().includes("dance")) {
    workouts = [
      {
        day: "周一 (Monday)",
        activity: "爵士大码律动 (Curvy Jazz Groove)",
        duration: `${dailyMins} 分钟`,
        instructions: "跟着爵士或灵魂乐起舞，手臂大范围挥动配合胯部舒展。不要做硬跳跃，保持双脚始终有一只脚踩在地面，用身体的曲线美感演绎节奏。"
      },
      {
        day: "周三 (Wednesday)",
        activity: "低冲击尊巴派对 (Low-Impact Zumba Party)",
        duration: `${dailyMins} 分钟`,
        instructions: "高能量的南美桑巴节奏！侧步移动、扭胯和手臂伸展。通过这种富有律动的有氧锻炼，提升心肺活力，燃烧汗水的同时收获无尽快乐。"
      },
      {
        day: "周五 (Friday)",
        activity: "活力有氧踏步与拉伸 (Aerobic Step & Revival)",
        duration: `${dailyMins} 分钟`,
        instructions: "温和的前后迈步、侧向点地，配合最后的全身深度拉伸。保持心率在舒适区间（110-130），让身心完全舒展，能量满格。"
      }
    ];
  }

  return {
    philosophy: `每一次流汗，都是在赞美生命的厚度。我们不为了“缩水”而动，我们为了“绽放”而动。大码身体拥有天然的强悍力量和绝佳的重力稳定性，运动是为了保护我们的关节、释放压力、滋养我们的心脏。`,
    tips: [
      "【膝部防护】大码女性进行运动时，避免任何高强度的双脚离地跳跃（如波比跳、跳绳），使用原地高抬腿或侧向跨步代替，保护膝软骨。",
      "【核心锚定】在进行站姿抗阻或跳舞时，微微收腹、夹紧臀部，让整个骨盆作为受力底盘，能瞬间分担脊椎压力。",
      "【温柔支撑】运动时请务必穿着高强度支撑的运动内衣和缓震极佳的厚底跑鞋，这不仅保护乳腺，也给脚踝极强的缓冲。",
      "【倾听反馈】运动过程中，心肺微微喘气、肌肉有温热发酸感是完美的；一旦出现关节刺痛或胸闷，请立刻停下休息，喝温水。",
      "【呼吸律动】用力时呼气，还原时吸气。千万不要憋气，饱满的氧气输送能让饱满的身体充满能量。"
    ],
    weeklySchedule: workouts,
    affirmation: "“我的身体是一座神圣的殿堂，充满了力量和生命力。我运动，是因为我深爱着每一个细胞，我渴望感受关节的自由、肌肉的坚韧和呼吸的饱满。”",
    isMock: true
  };
}

// ==========================================
// HEALTH & CULINARY MOCK GENERATOR
// ==========================================
export function generateMockHealth(input: HealthInput): HealthResult {
  const { dislikes, allergies, dietaryPreference } = input;
  
  const dislikeStr = dislikes.length > 0 ? dislikes.join("、") : "无特定忌口";
  const allergyStr = allergies.length > 0 ? allergies.join("、") : "无过敏原";
  
  return {
    approach: `抛弃对食物的焦虑和负罪感！大码身体的维持和运转需要充足且高质量的营养支持。我们的食谱致力于提供饱腹、高纤维、优质脂肪和优质蛋白质的美味大餐，滋养你的肌肤、支持你的荷尔蒙、提供持久的生命活力。已为你避开忌口（${dislikeStr}）及过敏原（${allergyStr}），选择【${dietaryPreference}】风格。`,
    mealPlan: {
      breakfast: {
        title: "黄金牛油果波奇蛋法式吐司",
        ingredients: [
          "1片 厚切全麦酸种面包 (Sourdough)",
          "1/2个 熟透的牛油果 (压泥并用柠檬汁、海盐调味)",
          "1-2个 散养波奇蛋 (水潽蛋)",
          "适量 烟熏三文鱼或熟圣女果 (避开忌口)",
          "1茶匙 奇亚籽与黑芝麻碎"
        ],
        instructions: "将全麦酸种面包烤至金黄酥脆。抹上厚厚一层柠檬牛油果泥，放上滑嫩的波奇蛋。一刀切开，蛋黄如熔岩般流出。奇亚籽提供Omega-3，牛油果和鸡蛋带来饱满的健康油脂，给一整天注入饱满能量。",
        vibe: "奢华、丰盛、唤醒感官"
      },
      lunch: {
        title: "香烤坚果地中海暖沙拉暖盘",
        ingredients: [
          "150克 嫩烤鸡胸肉或煎厚豆腐 (满足膳食风格)",
          "100克 软糯的烤南瓜与红薯丁",
          "1大碗 羽衣甘蓝与芝麻菜基底 (用橄榄油和红酒醋拌匀)",
          "1汤匙 熟核桃碎与南瓜子",
          "50克 鹰嘴豆或藜麦 (提供优质慢碳水)"
        ],
        instructions: "温热的烤南瓜、红薯和蛋白质与清脆的绿叶菜完美融合。淋上自制的无糖希腊酸奶芝麻酱，撒上香脆坚果。这道午餐含有丰富的膳食纤维，能维持血糖平稳，让你整个下午思维敏捷、精力充沛，绝不产生虚假饥饿感。",
        vibe: "温暖、高纤维、生机盎然"
      },
      dinner: {
        title: "慢炖迷迭香柠檬嫩烤鳕鱼/牛柳配时蔬",
        instructions: "将鳕鱼排或厚切豆腐裹上迷迭香、柠檬片、蒜末与特级初榨橄榄油。放入烤箱200度烘烤18分钟，至肉质鲜嫩多汁。搭配一盘海盐烤西兰花、芦笋和香菇。橄榄油中的单不饱和脂肪酸能深度滋养皮肤屏障，让你的面容容光焕发。",
        ingredients: [
          "180克 银鳕鱼排、三文鱼或高纤维植物蛋白",
          "1大盘 烤西兰花、芦笋与香菇",
          "1/2个 烤柠檬 (挤汁调味)",
          "1茶匙 迷迭香与初榨橄榄油"
        ],
        vibe: "滋润、解压、深度修复"
      }
    },
    snackIdea: "75% 以上的黑巧克力2块，配上一小把生杏仁和一杯热洋甘菊茶。满足你对甜食的所有优雅幻想，同时提供丰富的抗氧化成分和镁元素，帮助夜间深度睡眠。",
    nourishmentFocus: "本次食谱重点在于【细胞抗炎与荷尔蒙平稳】。高含量的优质油脂（牛油果、橄榄油、鱼油）可以深度滋养皮肤和黏膜，充足的蛋白质支撑核心骨骼力量，大量的微量元素和高纤维让肠道顺畅、精神饱满。爱身体，从每一口真正的食物开始。"
  };
}
