export const SITE_ROLE = "AI Automation Engineer & Front-End Developer";

export const SITE_DESCRIPTION =
  "AI automation engineer building n8n workflows, AI agents and CRM automation, plus AI video, design and front-end for product brands. Based in Lagos, Nigeria.";

const SUPABASE_PUBLIC = `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""}/storage/v1/object/public`;

export const ABOUT_MEDIA = {
  intro: `${SUPABASE_PUBLIC}/site/about/intro.mp4`,
  introPoster: `${SUPABASE_PUBLIC}/site/about/intro-poster.jpg`,
  servicesBanner: `${SUPABASE_PUBLIC}/site/about/ai-automation-services.jpg`,
};

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
  instagram?: string;
  sells: string;
  facts?: string[];
  did: string[];
  caseStudyHref?: string;
}

export interface PipelineStep {
  label: string;
  title: string;
  detail: string;
}

export const TICKER_ITEMS = [
  "AI workflow automation",
  "n8n",
  "Make",
  "Zapier",
  "GoHighLevel",
  "Claude API",
  "OpenAI",
  "AI agents",
  "CRM & lead automation",
  "AI video",
  "Front-end",
];

export const SERVICES: Service[] = [
  {
    title: "AI Workflow Automation",
    problem:
      "Most workflows break the same way: someone manually moves data between systems that should talk to each other.",
    fix: "I connect your tools with n8n, Make and Zapier so the work runs on its own, with error handling and retry logic built in.",
    tools: ["n8n", "Make", "Zapier", "Webhooks"],
  },
  {
    title: "AI Agents & Chatbots",
    problem:
      "Leads and customers wait for answers because nobody is free to reply the moment they ask.",
    fix: "I build Claude and OpenAI agents for inbound support and lead qualification, with a human handoff when it matters.",
    tools: ["Claude API", "OpenAI", "RAG", "Voice agents"],
  },
  {
    title: "CRM & Lead Automation",
    problem:
      "Leads slip through the cracks when follow-up lives in people's heads and scattered spreadsheets.",
    fix: "I set up and run CRM pipelines with lead routing, follow-ups and reporting, so a sales team always knows who to contact next.",
    tools: ["HubSpot", "GoHighLevel", "Airtable"],
  },
  {
    title: "AI Video & Social Content",
    problem:
      "Traditional video shoots are slow and costly, so brands post far less than they should.",
    fix: "I turn product photos and ideas into polished AI videos, edit them for social, and set up pipelines that publish them automatically.",
    tools: ["AI video", "Video editing", "Publishing pipelines"],
  },
  {
    title: "Front-End Development",
    problem:
      "A slow or dated website quietly loses customers before they ever get in touch.",
    fix: "I build fast, responsive interfaces that work on every screen and make the next step obvious.",
    tools: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Graphic Design",
    problem: "Inconsistent visuals make a brand look smaller than it really is.",
    fix: "I design product graphics, social creatives and brand assets so everything looks like it comes from one company.",
    tools: ["CorelDRAW", "Adobe Photoshop"],
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

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    label: "Input",
    title: "Product + brief",
    detail: "A product image and brief are added to a Google Sheet.",
  },
  {
    label: "Script",
    title: "Claude",
    detail: "Writes the scene-by-scene prompts.",
  },
  {
    label: "Scenes",
    title: "Kie AI",
    detail: "Generates the scene images from those prompts.",
  },
  {
    label: "Approve",
    title: "Client review",
    detail: "Approve, or leave a note. Only flagged scenes regenerate.",
  },
  {
    label: "Produce",
    title: "Kie AI + Creatomate",
    detail: "Approved scenes become video, cut into the final ad.",
  },
  {
    label: "Publish",
    title: "Blotato",
    detail: "Posts to every platform automatically.",
  },
];

export const BRANDS: Brand[] = [
  {
    name: "Savvy Sox",
    url: "https://www.savvysox.com",
    instagram: "https://www.instagram.com/savvysox/",
    sells:
      "Black-owned California sock brand making full-colour, pop-culture “wearable art”, every pair designed, printed and shipped in-house.",
    facts: ["Since 2013", "500+ retail stores", "Made in the USA"],
    did: ["AI product videos", "Content creation", "Sales team support"],
  },
  {
    name: "WERNS",
    url: "https://www.hi-werns.com",
    instagram: "https://www.instagram.com/werns.official/",
    sells:
      "Award-winning German design brand behind the famous animal lamps, plus vases, wallpaper and décor. PETA-certified vegan.",
    facts: ["Founded 2021", "300K+ on Instagram", "Ships EU-wide"],
    did: ["Content creation", "Sales team management"],
  },
  {
    name: "Seraman",
    url: "https://seraman.com",
    sells:
      "Italian-run e-commerce brand for outdoor, tactical and logistics gear, from first-responder kits to field equipment.",
    facts: ["E-commerce", "Tactical & outdoor"],
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
