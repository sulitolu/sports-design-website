// All site copy lives here so it can be edited without touching components.
// EN = English copy, JP = short Japanese accent labels.

export const nav = {
  wordmark: "SPORTS DESIGN JAPAN",
  wordmarkJp: "スポーツ デザイン",
  shortmark: "SDJ",
  links: [
    { label: "Work", jp: "制作実績", href: "#work" },
    { label: "Services", jp: "サービス", href: "#services" },
    { label: "About", jp: "私たちについて", href: "#about" },
    { label: "Athletes", jp: "選手", href: "#athletes" },
    { label: "Contact", jp: "お問い合わせ", href: "#contact" },
  ],
  cta: { label: "Start a project", href: "#contact" },
};

export const hero = {
  eyebrow: "映像制作 / Yokohama, Japan",
  lines: { sports: "Sports", design: "Design", japan: "Japan" },
  lead: {
    pre: "Cinematic sports media & athlete branding, built from ",
    emphasis: "inside the game",
    post: " — not from the sidelines.",
  },
  ctas: {
    primary: { label: "View the work", href: "#work" },
    secondary: { label: "Get in touch", href: "#contact" },
  },
  media: {
    poster: "/images/hero-poster.jpg",
    rec: "REC",
    timecode: "00:01:24:08",
    kicker: "Latest film",
    title: "Match Day Cinematic",
    tab: "Sony Cinema · 4K",
  },
  branding: "アスリートブランディング",
  scrollLabel: "Scroll",
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
  media?: {
    video: string;
    poster: string;
  };
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
      media: {
        video: "/video/work-athlete-brand.mp4",
        poster: "/images/work-athlete-brand-poster.jpg",
      },
    },
    {
      title: "Season Hype Reel",
      client: "Japan Rugby League One",
      category: "Cinematic Film",
      year: "2023",
      timecode: "00:01:42:13",
      media: {
        video: "/video/work-season-hype.mp4",
        poster: "/images/work-season-hype-poster.jpg",
      },
    },
    {
      title: "Social Series — 30 Days of Training",
      client: "Personal Brand Project",
      category: "Social Content",
      year: "2023",
      timecode: "00:00:32:05",
      media: {
        video: "/video/work-social-training.mp4",
        poster: "/images/work-social-training-poster.jpg",
      },
    },
    {
      title: "Pre-Season Documentary",
      client: "NEC Green Rockets",
      category: "Cinematic Film",
      year: "2023",
      timecode: "00:04:11:00",
      media: {
        video: "/video/work-preseason-doc.mp4",
        poster: "/images/work-preseason-doc-poster.jpg",
      },
    },
    {
      title: "Brand Identity Launch",
      client: "Athlete Collective",
      category: "Athlete Branding",
      year: "2022",
      timecode: "00:01:05:17",
      media: {
        video: "/video/work-brand-identity.mp4",
        poster: "/images/work-brand-identity-poster.jpg",
      },
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
    {
      index: "04",
      title: "Personal Athlete Website",
      jp: "アスリート個人サイト",
      summary:
        "A custom website built around you — your story, your stats, your brand. Designed to impress scouts, sponsors, and fans.",
      details: [
        "Custom design & build",
        "Bio, stats & highlight reel",
        "Sponsor & media kit page",
        "Mobile-ready & fast",
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

export type Athlete = {
  name: string;
  position: string;
  photo: string;
};

export const athletes = {
  heading: { en: "Athletes", jp: "選手" },
  eyebrow: "NEC GREEN ROCKETS",
  intro:
    "Personal brand films and content built for players from NEC Green Rockets, Japan Rugby League One.",
  roster: [
    {
      name: "Riley Hohepa",
      position: "Fullback / First Five",
      photo: "/images/athletes/athlete-01.jpg",
    },
    {
      name: "Orbyn Leedger",
      position: "Second Five / Centre",
      photo: "/images/athletes/athlete-02.jpg",
    },
    {
      name: "Christian Lau'i",
      position: "Second Five / Centre",
      photo: "/images/athletes/athlete-03.jpg",
    },
    {
      name: "Ryoi Kamei",
      position: "Flanker / Number 8",
      photo: "/images/athletes/athlete-04.jpg",
    },
    {
      name: "Nick Phipps",
      position: "Halfback",
      photo: "/images/athletes/athlete-05.jpg",
    },
  ] satisfies Athlete[],
};

export const cta = {
  heading: { en: "LET'S CREATE", jp: "一緒に作りましょう" },
  body: "Have a project, a season, or a story worth telling? Let's talk.",
  email: "sportsdesignjp@gmail.com",
  instagram: {
    handle: "@sports_designjp",
    url: "https://instagram.com/sports_designjp",
  },
  backToTop: "BACK TO TOP",
};

export const site = {
  name: "Sports Design Japan",
  location: "Japan",
};
