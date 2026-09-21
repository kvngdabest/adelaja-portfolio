export interface Service {
  title: string;
  problem: string;
  fix: string;
  tools: string[];
}

export interface ProcessStep {
  title: string;
  body: string;
}

export interface Brand {
  name: string;
  url: string | null;
  sells: string;
  did: string[];
  caseStudyHref?: string;
}

export const SERVICES: Service[] = [
  {
    title: "Front-End Development",
    problem:
      "A slow or dated website quietly loses customers before they ever get in touch.",
    fix: "I build fast, responsive interfaces that work on every screen and make the next step obvious.",
    tools: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "AI Video Content",
    problem:
      "Traditional video shoots are slow and costly, so brands post far less than they should.",
    fix: "I turn product photos and ideas into polished AI-generated videos, so content goes out consistently without a production crew.",
    tools: ["AI video tools", "Product videos", "Short-form ads"],
  },
  {
    title: "Video Editing",
    problem:
      "Raw footage doesn't sell. Uneven pacing and off-brand edits get scrolled straight past.",
    fix: "I cut, caption and polish footage for ads and social so every clip looks on-brand and holds attention.",
    tools: ["Social edits", "Captions", "Ad cutdowns"],
  },
  {
    title: "Graphic Design",
    problem: "Inconsistent visuals make a brand look smaller than it really is.",
    fix: "I design product graphics, social creatives and brand assets so everything looks like it comes from one company.",
    tools: ["CorelDRAW", "Adobe Photoshop"],
  },
  {
    title: "Sales Team & CRM Management",
    problem:
      "Leads slip through the cracks when follow-up lives in people's heads and scattered spreadsheets.",
    fix: "I set up and run CRM pipelines, follow-up routines and reporting, so a sales team always knows who to contact next.",
    tools: ["CRM setup", "Pipeline tracking", "Follow-up routines"],
  },
  {
    title: "Workflow Automation",
    problem:
      "Skilled people burn hours on copy-paste work that a system should be doing.",
    fix: "I build automations that handle repetitive sales and content tasks, and alert you the moment something breaks.",
    tools: ["n8n", "Claude API", "Webhooks"],
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    title: "Find the leak",
    body: "I start with where time, leads or attention are being lost, not with a favourite tool.",
  },
  {
    title: "Pick the simplest fix",
    body: "A page, a video workflow, a CRM pipeline or an automation, whichever removes the problem with the least complexity.",
  },
  {
    title: "Build it with you",
    body: "Clear milestones, tested on your real work, with progress shown early instead of a big reveal at the end.",
  },
  {
    title: "Hand over and keep it running",
    body: "I document it, walk the team through it, and stay on hand to tune it as the business grows.",
  },
];

export const BRANDS: Brand[] = [
  {
    name: "Savvy Sox",
    url: "https://www.savvysox.com",
    sells:
      "Print-on-demand novelty socks designed and shipped from California, across pop-culture, gamer and holiday collections.",
    did: ["AI product videos", "Content creation", "Sales team support"],
  },
  {
    name: "WERNS",
    url: "https://www.hi-werns.com",
    sells:
      "German design brand for statement lamps, velvet cushions and home décor.",
    did: ["Content creation", "Sales team management"],
  },
  {
    name: "Seraman",
    url: "https://seraman.com",
    sells: "E-commerce brand for outdoor, tactical and logistics gear.",
    did: [
      "AI product video pipeline",
      "Scene tracking & failure alerts",
      "Sales team support",
    ],
    caseStudyHref: "/projects",
  },
  {
    name: "And other product brands",
    url: null,
    sells:
      "Growing businesses that needed steadier content and a tidier sales process.",
    did: ["Content creation", "Sales team management"],
  },
];
