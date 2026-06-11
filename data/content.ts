// All site copy lives here so it can be edited without touching components.
// EN = English copy, JP = short Japanese accent labels.

export const nav = {
  wordmark: "SPORTS DESIGN JAPAN",
  shortmark: "SDJ",
  links: [
    { label: "Work", jp: "制作実績", href: "#work" },
    { label: "Services", jp: "サービス", href: "#services" },
    { label: "About", jp: "私たちについて", href: "#about" },
    { label: "Contact", jp: "お問い合わせ", href: "#contact" },
  ],
};

export const hero = {
  lines: ["SPORTS", "DESIGN", "JAPAN"],
  tagline: {
    en: "Cinematic sports media & athlete branding, built from inside the game.",
    jp: "映像制作 / アスリートブランディング",
  },
  scrollLabel: "SCROLL",
  videoNote:
    "Drop a looping, muted .mp4 (match day / training footage) at /public/video/hero-loop.mp4",
};

export const marquee = {
  items: [
    "ATHLETE BRANDING",
    "CINEMATIC FILM",
    "SOCIAL CONTENT",
    "映像制作",
  ],
};

export type WorkProject = {
  title: string;
  client: string;
  category: string;
  year: string;
  timecode: string;
};

export const work = {
  heading: { en: "Selected Work", jp: "制作実績" },
  intro:
    "A look at recent films, brand systems, and content series produced for teams and athletes across Japan.",
  projects: [
    {
      title: "Match Day Cinematic",
      client: "NEC Green Rockets",
      category: "Cinematic Film",
      year: "2024",
      timecode: "00:01:24:08",
    },
    {
      title: "Athlete Brand Film",
      client: "Personal Brand Project",
      category: "Athlete Branding",
      year: "2024",
      timecode: "00:00:58:21",
    },
    {
      title: "Season Hype Reel",
      client: "Japan Rugby League One",
      category: "Cinematic Film",
      year: "2023",
      timecode: "00:01:42:13",
    },
    {
      title: "Social Series — 30 Days of Training",
      client: "Personal Brand Project",
      category: "Social Content",
      year: "2023",
      timecode: "00:00:32:05",
    },
    {
      title: "Pre-Season Documentary",
      client: "NEC Green Rockets",
      category: "Cinematic Film",
      year: "2023",
      timecode: "00:04:11:00",
    },
    {
      title: "Brand Identity Launch",
      client: "Athlete Collective",
      category: "Athlete Branding",
      year: "2022",
      timecode: "00:01:05:17",
    },
  ] satisfies WorkProject[],
};

export type Service = {
  index: string;
  title: string;
  jp: string;
  summary: string;
  details: string[];
};

export const services = {
  heading: { en: "Services", jp: "サービス" },
  items: [
    {
      index: "01",
      title: "Cinematic Film",
      jp: "映像制作",
      summary:
        "Match day films, hype reels, and brand films shot on Sony cinema gear and cut for impact.",
      details: [
        "Match day cinematics",
        "Season hype reels",
        "Brand & sponsor films",
        "Documentary & behind-the-scenes",
      ],
    },
    {
      index: "02",
      title: "Athlete Branding",
      jp: "アスリートブランディング",
      summary:
        "Personal brand strategy, content systems, and visual identity for athletes who want to own their story.",
      details: [
        "Personal brand strategy",
        "Visual identity & content systems",
        "Social profile design",
        "Sponsor-ready media kits",
      ],
    },
    {
      index: "03",
      title: "Social Content",
      jp: "ソーシャルコンテンツ",
      summary:
        "Short-form vertical video and season-long content packages built for the algorithm and the fanbase.",
      details: [
        "Short-form vertical video",
        "Season-long content packages",
        "Training & lifestyle series",
        "Cutdowns for every platform",
      ],
    },
  ] satisfies Service[],
};

export const about = {
  heading: { en: "About", jp: "私たちについて" },
  eyebrow: "FOUNDER STORY",
  body: [
    "Sports Design Japan was founded by a professional rugby player who builds media from inside the game — not from the sidelines.",
    "That access changes everything: the trust to shoot in the locker room, the timing to catch a season's defining moment, and the understanding of what athletes and teams actually need from their content.",
    "We pair that perspective with cinema-grade production — Sony cinema cameras, Adobe Premiere and After Effects — to deliver work that feels like it belongs on a broadcast, not a feed.",
  ],
  stats: [
    { value: 8, suffix: "+", label: "Years in Pro Rugby" },
    { value: 150, suffix: "+", label: "Videos Delivered" },
    { value: 12, suffix: "M+", label: "Total Views" },
    { value: 20, suffix: "+", label: "Athletes & Teams" },
  ],
};

export const cta = {
  heading: { en: "LET'S CREATE", jp: "一緒に作りましょう" },
  body: "Have a project, a season, or a story worth telling? Let's talk.",
  email: "hello@sportsdesignjapan.com",
  instagram: {
    handle: "@sportsdesignjapan",
    url: "https://instagram.com/sportsdesignjapan",
  },
  backToTop: "BACK TO TOP",
};

export const site = {
  name: "Sports Design Japan",
  location: "Japan",
};
