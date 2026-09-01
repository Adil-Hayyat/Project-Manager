/* ==========================================================================
   All site content lives here. Edit this file, not the components.
   ========================================================================== */

export const profile = {
  name: "Adil Hayat",
  fullName: "Adil Hayat",
  first: "Adil",
  title: "AI Automation and GoHighLevel Expert",
  role: "AI Automation and GoHighLevel Expert",
  // Drop your photo in public/ and set the path here (e.g. "/profile.png").
  // Leave empty to show the default user icon instead.
  photo: "/profile.jpeg",
  years: "GoHighLevel",
  yearsLabel: ["CRM & WORKFLOW", "AUTOMATION"],
  signature: "“Turning ideas into production-ready AI systems.”",
};

/* ===== HEADER / NAV ===================================================== */
export const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

/* ===== HERO ============================================================= */
export const hero = {
  badge: "AI Automation and GoHighLevel Expert",
  // Headline in the reference's three parts: solid / dimmed / mono chip.
  titleLead: "Adil",
  titleDim: "Hayat.",
  titleMono: "CRM + automation",
  // Kept for any older markup that still reads these.
  titleAccent: "GoHighLevel & AI Automation.",
  // Rendered with `descBold` emphasised, per the reference's lede treatment.
  desc: "I build workflow automation and CRM systems — form-to-lead capture, email/SMS sequencing, tagging and pipeline tracking — that ",
  descBold: "take manual steps off your team's plate",
  descTail:
    ", using GoHighLevel, n8n, and API/webhook integrations.",
  // Spaces must be encoded for the static file to resolve.
  resume: "/Adil%20Hayyat%20CV.pdf",
  // First tag renders outlined, the rest neutral (per the reference).
  tech: ["GoHighLevel", "n8n", "Make", "LangChain", "AI Agents", "Integrations"],
  // Capability rail — deliberately non-numeric: no invented metrics.
  highlights: [
    { value: "n8n · Make", label: "Workflow automation" },
    { value: "GoHighLevel", label: "CRM & lead pipelines" },
    { value: "AI Agents", label: "LLM integrations" },
  ],
  // Live-pipeline panel. Node positions map to the 560x330 SVG canvas.
  panel: {
    title: "pipeline: lead-intake",
    status: "Live",
    nodes: [
      { kind: "Trigger", value: "Form webhook", x: 20, y: 36 },
      { kind: "Source", value: "CRM export", x: 20, y: 242 },
      { kind: "Agent", value: "AI · qualify", x: 228, y: 126, hot: true },
      { kind: "Action", value: "Auto-followup", x: 432, y: 44 },
      { kind: "Escalate", value: "Human review", x: 432, y: 220 },
    ],
    log: [
      { ok: true, text: "run #1,204 · 38 leads qualified · 0 errors · 22s" },
      { ok: true, text: "email sequence dispatched · CRM updated" },
    ],
    cursor: "agent: routing edge case to human review",
  },
};

/* ===== ABOUT ============================================================ */
export const about = {
  kicker: "Get to Know",
  titleSolid: "ABOUT",
  titleOutline: "ME",
  paragraphs: [
    {
      lead: "Hi, I'm ",
      strong: "Adil Hayat",
      rest:
        ", an AI Automation and GoHighLevel Expert. I build workflow automation " +
        "and CRM systems — lead capture, email/SMS sequencing, tagging, and " +
        "pipeline tracking — using GoHighLevel, n8n, Make, and API integrations, " +
        "taking each build from concept to working implementation.",
    },
  ],
  whatIDo: [
    { icon: "robot", label: "GoHighLevel CRM & Automation" },
    { icon: "code", label: "Workflow & API Automation" },
    { icon: "server", label: "Backend & API Development" },
    { icon: "laptop", label: "Full-Stack Web Apps" },
    { icon: "plug", label: "Third-party Integrations" },
    { icon: "cloud", label: "AI & Automation Tools" },
  ],
};

/* ===== SKILLS =========================================================== */
export const skills = {
  label: "Skills",
  titleSolid: "WHAT I",
  titleOutline: "WORK WITH",
  subtitle: "A modern toolkit for building automation and AI applications.",
  cards: [
    {
      icon: "wand",
      title: "AI & Automation",
      desc:
        "I design intelligent automation workflows that connect GoHighLevel, " +
        "business apps, and AI services into systems that run unattended.",
      stack: [
        "n8n",
        "Make",
        "Zapier",
        "GoHighLevel",
        "LangChain",
        "AI Agents",
        "RAG",
        "Prompt Engineering",
        "LLM Integration",
        "MCP",
        "Webhook Integrations",
      ],
    },
    {
      icon: "code",
      title: "Backend Development",
      desc:
        "I build robust backends and APIs with modern frameworks, " +
        "ensuring high performance and maintainability.",
      stack: [
        "Python",
        "FastAPI",
        "Flask",
        "Django",
        "Node.js",
        "REST APIs",
        "Backend Architecture",
        "Webhooks",
      ],
    },
    {
      icon: "laptop",
      title: "Frontend Development",
      desc:
        "I create responsive and interactive user interfaces using modern " +
        "frontend technologies and best practices.",
      stack: [
        "React.js",
        "Next.js",
        "TypeScript",
        "HTML5",
        "CSS3",
        "TailwindCSS",
      ],
    },
    {
      icon: "database",
      title: "Databases & APIs",
      desc:
        "I design robust databases and integrate third-party APIs and services " +
        "for scalable applications.",
      stack: [
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "SQLite",
        "Supabase",
        "REST APIs",
        "Twilio",
        "Google Workspace APIs",
      ],
    },
  ],
};

/* ===== PROJECTS ========================================================= */
export const projects = {
  label: "Projects",
  titleSolid: "SELECTED",
  titleOutline: "WORK",
  subtitle: "Real automation systems I've built to solve real problems.",
  items: [
    {
      tag: "AI Automation",
      title: "Recruite-AI",
      desc:
        "AI-Powered recruitment screening platform for automated candidate screening " +
        "and job-fit assessment. Integrated OpenAI to compare candidate CVs against " +
        "job requirements and generate structured recommendations.",
      meta: ["React", "TypeScript", "Supabase", "OpenAI", "n8n"],
      outcome: "Automated recruitment screening",
      href: "https://recruite-ai.vercel.app",
    },
    {
      tag: "CRM Automation",
      title: "Voice AI Receptionist",
      desc:
        "AI-powered voice receptionist to handle inbound customer calls, FAQs, and lead interactions. " +
        "Automated customer information collection, lead qualification, appointment scheduling, and follow-ups. " +
        "Integrated Voice AI with GoHighLevel CRM for workflow automation.",
      meta: ["GoHighLevel", "Voice AI", "CRM", "Workflow Automation"],
      outcome: "Reduced missed calls and improved appointment conversion",
      href: "#",
    },
    {
      tag: "Full-Stack",
      title: "Task Management System",
      desc:
        "Full-stack project platform for centralized task and team management. " +
        "Implemented authentication, role-based access, attendance, timesheet tracking, " +
        "leave management, notifications, and admin dashboard features.",
      meta: ["FastAPI", "React", "PostgreSQL", "Pydantic"],
      outcome: "Centralized project and team management",
      href: "#",
    },
    {
      tag: "AI Voice Automation",
      title: "AI Outbound Calling & Lead Qualification",
      desc:
        "End-to-end outbound sales workflow that pulls leads from Google Sheets, " +
        "places AI-powered calls to capture decision-maker status and intent, then " +
        "processes results via webhook — sending qualified leads a personalized " +
        "pricing email and writing call outcomes back to the sheet.",
      meta: ["n8n", "Retell AI", "Google Sheets", "Webhooks"],
      outcome: "Automated lead qualification and follow-up",
      href: "#",
    },
  ],
};

/* ===== EXPERIENCE ======================================================= */
export const experience = {
  label: "Where I've Worked",
  titleSolid: "EXPERI",
  titleOutline: "ENCE",
  subtitle:
    "Professional experience building Python services, APIs, and automation-focused integrations.",
  items: [
    {
      icon: "code",
      date: "June 2025 — Aug 2025",
      title: "Python Developer Intern",
      org: "Enigmatix",
      desc:
        "Developed backend services and REST APIs using Python, Django, FastAPI, and PostgreSQL. " +
        "Designed database schemas and optimized queries for scalable backend performance. " +
        "Tested and documented production APIs using Postman and automated test suites. " +
        "Built RAG chatbot features using LangChain, vector databases, and prompt engineering.",
    },
  ],
};

/* ===== EDUCATION ======================================================== */
export const education = {
  label: "WHERE I STUDIED",
  titleSolid: "EDUCA",
  titleOutline: "TION",
  subtitle:
    "A formal grounding in machine learning, NLP, and generative AI, alongside " +
    "the self-directed project work that turned it into production experience.",
  items: [
    {
      icon: "cap",
      date: "2021 - 2025",
      title: "Bachelor of Science in Artificial Intelligence",
      location: "The Islamia University of Bahawalpur",
      desc:
        "Specialized in machine learning, NLP, generative AI, and intelligent system development. " +
        "Developed a JARVIS desktop assistant for voice-controlled Windows task automation. " +
        "Built AI projects using Python, REST APIs, workflow automation, and LLM integrations.",
    },
    {
      icon: "book",
      date: "2018 - 2020",
      title: "Intermediate in Science",
      location: "Punjab College, Bahawalpur Campus",
      desc:
        "Pre-Engineering focus with a strong foundation in Mathematics and Physics.",
    },
  ],
};

/* ===== CONTACT ========================================================== */
export const contact = {
  label: "Get in Touch",
  title: "Let's Work Together",
  subtitle:
    "Have a process that should be automated? Let's discuss your idea and " +
    "build something smart.",
  panelTitle: "Contact Information",
  panelDesc:
    "I'm always open to discussing new projects, creative ideas, or " +
    "opportunities to be part of your vision.",
};

export const reach = {
  email: "adilhayat.ai@gmail.com",
  whatsappDisplay: "+92 312 7196480",
  whatsappLink: "https://wa.me/923127196480",
  location: "Lahore, Pakistan · Remote-friendly",
};

export const contactItems = [
  { icon: "mail", label: "Email Me", value: reach.email, href: `mailto:${reach.email}` },
  { icon: "whatsapp", label: "WhatsApp", value: reach.whatsappDisplay, href: reach.whatsappLink },
  { icon: "pin", label: "Location", value: reach.location, href: null },
];

/* ===== FOOTER =========================================================== */
export const socials = [
  { name: "GitHub", href: "https://github.com/Adil-Hayyat" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/106-adil-hayyat/" },
  { name: "X", href: "https://x.com/Adilhayat106" },
  { name: "Facebook", href: "https://www.facebook.com/adil.hayat.334839" },
];

export const footerBlurb =
  "AI Automation and GoHighLevel Expert building workflow automations, " +
  "CRM solutions, and production-ready applications.";

export const footerNav = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];
