import { site } from "@/lib/site";
import type {
  ActivityEvent,
  CaseStudy,
  ComparisonItem,
  FaqItem,
  PortfolioProject,
  ServiceItem,
  SiteSettings,
  Statistic,
  Testimonial,
} from "@/lib/validation/schemas";

export const SEED_AT = "2026-03-01T09:00:00.000Z";

export const defaultSettings: SiteSettings = {
  studioName: site.name,
  email: "paschalaguero007@gmail.com",
  whatsapp: "2348087900285",
  heroHeadline: site.headline,
  heroDescription: site.lede,
  adminPin: "forge",
};

type ProjectInput = Omit<
  PortfolioProject,
  "createdAt" | "updatedAt" | "published" | "kind" | "clientLabel" | "mediaId" | "videoId" | "year" | "featured"
> &
  Partial<Pick<PortfolioProject, "featured" | "year">>;

function project(input: ProjectInput): PortfolioProject {
  return {
    published: true,
    kind: "concept",
    clientLabel: "",
    mediaId: "",
    videoId: "",
    year: "2026",
    featured: false,
    createdAt: SEED_AT,
    updatedAt: SEED_AT,
    ...input,
  };
}

export const seedProjects: PortfolioProject[] = [
  project({
    id: "prj_quiet_compound",
    slug: "the-quiet-compound",
    title: "The Quiet Compound",
    category: "Finance",
    summary: "A concept long-form finance video that explains compounding without hype, fake portfolios, or borrowed authority.",
    description:
      "This concept is built as a patient finance essay. The open asks one question, a worked example carries the middle, and the close refuses a fake promise. Packaging, chapters, and the thumbnail are planned as one system. It is a demonstration of the studio’s format, not a record of a client channel.",
    format: "Long-form",
    duration: "18:40",
    motif: "copper",
    featured: true,
    services: ["Niche Research", "Video Scriptwriting", "Long-form Video Editing", "Thumbnail Design", "YouTube SEO"],
  }),
  project({
    id: "prj_cities",
    slug: "cities-after-midnight",
    title: "Cities After Midnight",
    category: "Luxury & lifestyle",
    summary: "A night-walk essay format for a luxury city series, paced like a film rather than a list of places.",
    description:
      "The concept treats a city at night as a single route: arrival, a quiet interior, a public room, and the walk home. Graphics stay spare so the grade and the narration do the work. No hotel, brand, or creator is attached.",
    format: "Long-form",
    duration: "21:15",
    motif: "night",
    services: ["Content Strategy", "Video Scriptwriting", "Professional Voiceovers", "Long-form Video Editing", "Thumbnail Design"],
  }),
  project({
    id: "prj_signal",
    slug: "signal-and-silence",
    title: "Signal and Silence",
    category: "Technology",
    summary: "A concept technology film about attention, notification design, and the cost of constant signal.",
    description:
      "The piece is structured as a faceless technology essay with a clear claim, a short history, and a practical close. Motion is limited to diagrams that match the spoken line. It does not review a product and it does not cite a sponsor.",
    format: "Long-form",
    duration: "16:05",
    motif: "signal",
    services: ["Niche Research", "Video Scriptwriting", "Long-form Video Editing", "YouTube SEO"],
  }),
  project({
    id: "prj_cartographer",
    slug: "the-last-cartographer",
    title: "The Last Cartographer",
    category: "Faceless documentary",
    summary: "A concept documentary about how maps became instruments of power, told without a presenter.",
    description:
      "Archive-style frames, a measured voice, and chapters a viewer can scrub. The concept shows how the studio would build a faceless history-adjacent documentary: research notes, script, edit plan, and thumbnail. No archive license is claimed and no network is attached.",
    format: "Faceless documentary",
    duration: "28:40",
    motif: "atlas",
    featured: true,
    services: ["Niche Research", "Competitor Research", "Video Scriptwriting", "Professional Voiceovers", "Long-form Video Editing", "Thumbnail Design"],
  }),
  project({
    id: "prj_founders",
    slug: "founders-at-the-table",
    title: "Founders at the Table",
    category: "Business documentary",
    summary: "A concept business documentary about a difficult operating decision, staged as a conversation rather than a pitch.",
    description:
      "The format follows one decision from the memo to the meeting to the morning after. It is written so a company could later substitute real interviews. In this catalog it remains a concept, with no company named and no outcome claimed.",
    format: "Documentary",
    duration: "24:10",
    motif: "ledger",
    services: ["Content Strategy", "Video Scriptwriting", "Long-form Video Editing", "Thumbnail Design", "YouTube SEO"],
  }),
  project({
    id: "prj_classroom",
    slug: "classroom-orbit",
    title: "Classroom Orbit",
    category: "Educational",
    summary: "A concept lesson video that teaches one scientific idea with a board, a diagram, and a short recap.",
    description:
      "Educational packaging for a single idea: a cold open, a diagram that builds in layers, a check question, and a recap. The concept is designed for clarity on a phone and a laptop. It is not a course and it has no enrollment claim.",
    format: "Long-form",
    duration: "12:32",
    motif: "classroom",
    services: ["Video Scriptwriting", "Long-form Video Editing", "Thumbnail Design", "YouTube SEO"],
  }),
  project({
    id: "prj_attention",
    slug: "thirty-seconds-on-attention",
    title: "Thirty Seconds on Attention",
    category: "YouTube Shorts",
    summary: "A concept short with one idea, a fast open, and a cover frame that can be read without sound.",
    description:
      "The short is cut to a single sentence and a visual change at the midpoint. Captions are part of the design, not an afterthought. It is a format sample for a faceless shorts system.",
    format: "Short",
    duration: "0:38",
    motif: "forge",
    services: ["Video Scriptwriting", "YouTube Shorts Editing", "Thumbnail Design"],
  }),
  project({
    id: "prj_market_short",
    slug: "the-one-minute-market",
    title: "The One-Minute Market",
    category: "YouTube Shorts",
    summary: "A one-minute concept that explains a market open without pretending to give financial advice.",
    description:
      "Vertical framing, a numbered sequence, and an end card that points back to a long-form companion. The concept is explicit that it is not advice and not a record of trading results.",
    format: "Short",
    duration: "0:54",
    motif: "market",
    services: ["Niche Research", "YouTube Shorts Editing", "Thumbnail Design", "YouTube SEO"],
  }),
  project({
    id: "prj_atlas_titles",
    slug: "atlas-title-system",
    title: "Atlas Title System",
    category: "Motion graphics",
    summary: "A concept title toolkit: opener, lower thirds, chapter cards, and an end board for a documentary series.",
    description:
      "The system is designed so an editor can reuse type, color, and timing across a season. This catalog entry shows the key frames. It is not a shipped broadcast package for a named show.",
    format: "Motion package",
    duration: "",
    motif: "atlas",
    services: ["Content Strategy", "Long-form Video Editing", "Thumbnail Design"],
  }),
  project({
    id: "prj_copper_ink",
    slug: "copper-and-ink",
    title: "Copper and Ink",
    category: "Thumbnail design",
    summary: "A concept thumbnail set built around one material, one idea, and type that survives a small size.",
    description:
      "Three frames explore the same title with different focal points. The study is about hierarchy and grade, not about a measured click-through rate. Use it to see how the studio would present options.",
    format: "Thumbnail set",
    duration: "",
    motif: "copper",
    featured: true,
    services: ["Thumbnail Design", "YouTube SEO"],
  }),
  project({
    id: "prj_harbor",
    slug: "harbor-ledger",
    title: "Harbor Ledger",
    category: "Finance",
    summary: "A concept finance documentary that uses a port as a metaphor for cash moving through a business.",
    description:
      "The script keeps the metaphor disciplined: arrivals, storage, and departure stand in for revenue, inventory, and cost. Chapters make the analogy easy to leave and re-enter. No company accounts are shown.",
    format: "Long-form",
    duration: "19:22",
    motif: "harbor",
    services: ["Niche Research", "Video Scriptwriting", "Professional Voiceovers", "Long-form Video Editing", "YouTube SEO"],
  }),
  project({
    id: "prj_glass",
    slug: "glass-houses",
    title: "Glass Houses",
    category: "Luxury & lifestyle",
    summary: "A concept architecture film about glass houses, daylight, and the editing rhythm of a quiet luxury channel.",
    description:
      "The piece is planned as a sequence of stills and slow moves, with type kept off the architecture until the chapter card. It demonstrates taste and pacing. It is not a commission from an architect or a brand.",
    format: "Long-form",
    duration: "14:48",
    motif: "glass",
    services: ["Content Strategy", "Video Scriptwriting", "Long-form Video Editing", "Thumbnail Design"],
  }),
  project({
    id: "prj_machines",
    slug: "machines-that-remember",
    title: "Machines That Remember",
    category: "Technology",
    summary: "A concept documentary on storage, memory, and the machines people trust with a record.",
    description:
      "Research notes, a spoken essay, and diagram inserts. The concept avoids product placement and avoids claiming a scientific discovery. It shows how a technology documentary can stay specific without a presenter.",
    format: "Documentary",
    duration: "26:05",
    motif: "circuit",
    services: ["Competitor Research", "Video Scriptwriting", "Long-form Video Editing", "Thumbnail Design", "YouTube SEO"],
  }),
  project({
    id: "prj_salt",
    slug: "the-salt-road",
    title: "The Salt Road",
    category: "History",
    summary: "A concept history documentary that follows salt as trade, tax, and daily life.",
    description:
      "The structure is geographic: three stops, three centuries, one commodity. The edit plan calls for maps, restrained lower thirds, and a narration that names uncertainty instead of filling gaps. No viewership is claimed.",
    format: "Faceless documentary",
    duration: "31:12",
    motif: "salt",
    featured: true,
    services: ["Niche Research", "Video Scriptwriting", "Professional Voiceovers", "Long-form Video Editing", "Thumbnail Design", "YouTube SEO"],
  }),
  project({
    id: "prj_workshop",
    slug: "workshop-notes",
    title: "Workshop Notes",
    category: "Educational",
    summary: "A concept series of short lessons filmed like notes on a bench: one tool, one mistake, one correction.",
    description:
      "Each episode is planned under twelve minutes with the same open and the same end card. The catalog piece shows the pilot. It is a teaching format, not a record of a published course.",
    format: "Long-form",
    duration: "11:18",
    motif: "archive",
    services: ["Content Strategy", "Video Scriptwriting", "Long-form Video Editing", "Publishing and Scheduling"],
  }),
  project({
    id: "prj_cold_open",
    slug: "cut-the-cold-open",
    title: "Cut the Cold Open",
    category: "YouTube Shorts",
    summary: "A concept short about the first three seconds of a video, cut as a demonstration of its own advice.",
    description:
      "The short shows a weak open and a rebuilt open back to back. It is a teaching clip for editors and channel owners. No account growth is implied.",
    format: "Short",
    duration: "0:33",
    motif: "dunes",
    services: ["YouTube Shorts Editing", "Video Scriptwriting", "Thumbnail Design"],
  }),
  project({
    id: "prj_lower_thirds",
    slug: "forge-lower-thirds",
    title: "Forge Lower Thirds",
    category: "Motion graphics",
    summary: "A concept lower-third and chapter system with a hot-metal palette and strict timing.",
    description:
      "Names, roles, locations, and chapter cards share one grid. The concept is a toolkit a series could adopt. It is shown here as key art, not as a template store listing.",
    format: "Motion package",
    duration: "",
    motif: "forge",
    services: ["Long-form Video Editing", "Thumbnail Design"],
  }),
  project({
    id: "prj_night_market",
    slug: "night-market-boards",
    title: "Night Market Boards",
    category: "Thumbnail design",
    summary: "A concept thumbnail series using stall light, short type, and one object per frame.",
    description:
      "The set explores how a repeating world can still make each video distinct. Frames are designed for the browse page, not for a poster on a wall. No test results are attached.",
    format: "Thumbnail set",
    duration: "",
    motif: "market",
    services: ["Thumbnail Design", "Competitor Research", "YouTube SEO"],
  }),
  project({
    id: "prj_field_notes",
    slug: "field-notes",
    title: "Field Notes",
    category: "Long-form",
    summary: "A concept series plan for a weekly long-form channel, from the topic bank to the publishing checklist.",
    description:
      "This entry is the operating system around a show: series rules, a topic bank, a thumbnail grammar, and a publishing pass. The pilot film is planned, not presented as a released episode.",
    format: "Series plan",
    duration: "22:05",
    motif: "dunes",
    services: ["YouTube Automation", "Content Strategy", "Channel Management", "Publishing and Scheduling", "YouTube SEO"],
  }),
  project({
    id: "prj_objects",
    slug: "ordinary-objects",
    title: "Ordinary Objects",
    category: "Faceless documentary",
    summary: "A concept documentary that tells a larger story through one household object at a time.",
    description:
      "Each chapter is an object, a date, and a consequence. The visual system is archival and quiet. The project shows how a faceless series can stay human without a host and without invented interviews.",
    format: "Faceless documentary",
    duration: "17:44",
    motif: "archive",
    services: ["Niche Research", "Video Scriptwriting", "Professional Voiceovers", "Long-form Video Editing", "Thumbnail Design"],
  }),
];

function service(
  input: Omit<ServiceItem, "createdAt" | "updatedAt" | "published">,
): ServiceItem {
  return { published: true, createdAt: SEED_AT, updatedAt: SEED_AT, ...input };
}

export const seedServices: ServiceItem[] = [
  service({
    id: "srv_automation",
    slug: "youtube-automation",
    title: "YouTube Automation",
    description: "A full production system for a channel: research, scripts, edits, thumbnails, packaging, and a publishing rhythm.",
    deliverables: ["Channel operating outline", "Production calendar", "Asset checklist", "Handoff notes"],
    icon: "Clapperboard",
    order: 1,
  }),
  service({
    id: "srv_niche",
    slug: "niche-research",
    title: "Niche Research",
    description: "Audience, demand, and content gaps mapped before a format is chosen.",
    deliverables: ["Niche brief", "Audience notes", "Opportunity map", "Risk notes"],
    icon: "Compass",
    order: 2,
  }),
  service({
    id: "srv_competitor",
    slug: "competitor-research",
    title: "Competitor Research",
    description: "A structured read of channels in the same territory: formats, titles, thumbnails, and cadence.",
    deliverables: ["Competitor matrix", "Format notes", "Thumbnail observations", "Differentiation angles"],
    icon: "Binoculars",
    order: 3,
  }),
  service({
    id: "srv_scripts",
    slug: "video-scriptwriting",
    title: "Video Scriptwriting",
    description: "Scripts with a clear open, retention beats, and a spoken rhythm a narrator can actually say.",
    deliverables: ["Hook options", "Full script", "Chapter markers", "Source notes"],
    icon: "ScrollText",
    order: 4,
  }),
  service({
    id: "srv_voice",
    slug: "professional-voiceovers",
    title: "Professional Voiceovers",
    description: "Casting direction and a recorded narration prepared for the edit, with alternates where a line is fragile.",
    deliverables: ["Voice direction", "Recorded read", "Alternate lines", "Pronunciation list"],
    icon: "Mic",
    order: 5,
  }),
  service({
    id: "srv_longform",
    slug: "long-form-editing",
    title: "Long-form Video Editing",
    description: "A paced edit with story structure, graphics, captions, and a clean mix.",
    deliverables: ["Picture cut", "Captions", "Chaptered export", "Project notes"],
    icon: "Film",
    order: 6,
  }),
  service({
    id: "srv_shorts",
    slug: "youtube-shorts-editing",
    title: "YouTube Shorts Editing",
    description: "Vertical cuts built for a fast open, one idea, and a cover frame that works without sound.",
    deliverables: ["Vertical master", "Cover frame", "Captioned export", "Title options"],
    icon: "Smartphone",
    order: 7,
  }),
  service({
    id: "srv_thumbs",
    slug: "thumbnail-design",
    title: "Thumbnail Design",
    description: "Key art with a readable idea at a small size, designed with the title rather than after it.",
    deliverables: ["Thumbnail concepts", "Final frames", "Export set", "Type notes"],
    icon: "Image",
    order: 8,
  }),
  service({
    id: "srv_seo",
    slug: "youtube-seo",
    title: "YouTube SEO",
    description: "Titles, descriptions, and packaging written for search and for the browse page.",
    deliverables: ["Title options", "Description", "Tag guidance", "Chapter text"],
    icon: "Search",
    order: 9,
  }),
  service({
    id: "srv_channel",
    slug: "channel-management",
    title: "Channel Management",
    description: "Day-to-day channel care: uploads, a maintained backlog, and a record of what shipped.",
    deliverables: ["Upload checklist", "Backlog board", "Monthly status note", "Asset index"],
    icon: "LayoutDashboard",
    order: 10,
  }),
  service({
    id: "srv_strategy",
    slug: "content-strategy",
    title: "Content Strategy",
    description: "A series plan that connects topics, formats, and a publishing pace a team can keep.",
    deliverables: ["Series map", "Topic bank", "Format rules", "90-day outline"],
    icon: "Map",
    order: 11,
  }),
  service({
    id: "srv_publish",
    slug: "publishing-and-scheduling",
    title: "Publishing and Scheduling",
    description: "Files prepared, metadata checked, and uploads queued after a quality pass.",
    deliverables: ["Scheduled drafts", "Metadata sheet", "End screen notes", "Publish log"],
    icon: "CalendarClock",
    order: 12,
  }),
];

function quote(input: Omit<Testimonial, "createdAt" | "updatedAt" | "published" | "placeholder" | "mediaId" | "rating"> & Partial<Pick<Testimonial, "rating">>): Testimonial {
  return {
    published: true,
    placeholder: true,
    mediaId: "",
    rating: input.rating ?? 0,
    createdAt: SEED_AT,
    updatedAt: SEED_AT,
    ...input,
  };
}

export const seedTestimonials: Testimonial[] = [
  quote({
    id: "tst_a",
    quote: "Placeholder copy for the carousel layout. This is not a customer review and it does not describe a real engagement.",
    name: "Placeholder reviewer",
    projectType: "Long-form concept",
    order: 1,
  }),
  quote({
    id: "tst_b",
    quote: "Replace this slide with a review you have permission to publish. Until then it is only here so the layout can be judged.",
    name: "Placeholder reviewer",
    projectType: "Thumbnail study",
    order: 2,
  }),
  quote({
    id: "tst_c",
    quote: "Sample text for a future client note. Do not read it as praise, a rating, or proof of results.",
    name: "Placeholder reviewer",
    projectType: "Channel system",
    order: 3,
  }),
];

function faq(input: Omit<FaqItem, "createdAt" | "updatedAt" | "published">): FaqItem {
  return { published: true, createdAt: SEED_AT, updatedAt: SEED_AT, ...input };
}

export const seedFaqs: FaqItem[] = [
  faq({
    id: "faq_what",
    order: 1,
    question: "What does TubeForgeStudio do?",
    answer:
      "The studio builds YouTube content systems: niche and competitor research, scripts, voiceover, long-form and shorts editing, thumbnails, SEO packaging, and publishing operations. A project can be one of those services or the full chain.",
  }),
  faq({
    id: "faq_concept",
    order: 2,
    question: "What is a concept project?",
    answer:
      "A concept project is work made to show craft and process. It is not a commissioned client job, and it is not evidence of views, revenue, or a business relationship. Commissioned work is labelled separately when a real engagement is added.",
  }),
  faq({
    id: "faq_single",
    order: 3,
    question: "Can a single service be booked on its own?",
    answer:
      "Yes. Scriptwriting, editing, thumbnails, research, and publishing can be scoped alone. The inquiry form asks which service you need so the brief stays specific.",
  }),
  faq({
    id: "faq_process",
    order: 4,
    question: "How does a production move?",
    answer:
      "The usual path is niche research, topic research and scripting, voiceover, editing, thumbnail and SEO, then a quality check before publishing. The order can tighten when you already have footage or a script.",
  }),
  faq({
    id: "faq_results",
    order: 5,
    question: "Do you publish results or analytics?",
    answer:
      "Only figures a client has agreed to share, or studio records the desk has marked as verified. Sample statistics on this site are labelled as samples. This portfolio does not invent view counts.",
  }),
  faq({
    id: "faq_inquiry",
    order: 6,
    question: "What happens when I submit the inquiry form?",
    answer:
      "The inquiry is saved in this browser. No email is sent, because the site has no mail service connected. Email paschalaguero007@gmail.com, call or WhatsApp +2348087900285, and keep a copy of your note.",
  }),
  faq({
    id: "faq_existing",
    order: 7,
    question: "Can you work with a channel that already exists?",
    answer:
      "Yes. An existing channel can start with a packaging pass, a series plan, or a single edit. You do not have to hand over the whole channel to begin.",
  }),
  faq({
    id: "faq_prepare",
    order: 8,
    question: "What should I prepare before starting?",
    answer:
      "A channel or business name, the service you need, a budget range, the outcome you want, and any footage, brand rules, or references you already trust. A preferred date helps, even if it can move.",
  }),
];

function study(input: Omit<CaseStudy, "createdAt" | "updatedAt" | "published" | "kind">): CaseStudy {
  return { published: true, kind: "concept", createdAt: SEED_AT, updatedAt: SEED_AT, ...input };
}

const resultsNote =
  "No performance results are published. This case study describes a concept production. It is not a record of a commissioned video, a client relationship, or a measured outcome.";

export const seedCaseStudies: CaseStudy[] = [
  study({
    id: "case_quiet",
    slug: "the-quiet-compound",
    title: "The Quiet Compound",
    industry: "Personal finance education",
    brief:
      "Design a long-form finance video that explains compounding without hype, fake portfolios, or a borrowed celebrity. The piece had to be specific enough to teach and calm enough to finish.",
    challenge:
      "Finance videos often race to a tip. This concept needed a slower structure that still earns the next minute: a cold open, a worked example, and a chaptered close a viewer can scrub.",
    strategy:
      "Write the script in plain language, keep one number sequence that can be checked, and design a copper-and-ink thumbnail with a single idea. Package the title, chapters, and description together.",
    process: [
      "Define the viewer as a beginner who has heard the word compounding and wants the mechanism.",
      "Outline chapters: the question, a worked example, the cost of interruption, and a calm close.",
      "Draft a script in short sentences and mark every figure that must appear on screen.",
      "Plan diagrams that match the narration instead of decorating it.",
      "Design a thumbnail around time, not luxury.",
      "Prepare title options, a description, and chapter text.",
    ],
    deliverables: ["Script", "Chapter plan", "Edit plan", "Thumbnail concept", "Packaging sheet"],
    resultsNote,
    projectSlug: "the-quiet-compound",
    relatedSlugs: ["harbor-ledger", "copper-and-ink"],
    galleryMotifs: ["copper", "ledger", "dunes"],
    order: 1,
  }),
  study({
    id: "case_salt",
    slug: "the-salt-road",
    title: "The Salt Road",
    industry: "History",
    brief:
      "Build a faceless history documentary that follows salt as trade, tax, and ordinary life, with room for uncertainty where the record is thin.",
    challenge:
      "History formats often flatten a subject into a list of dates. The concept needed a route a viewer could remember, and a visual system that did not pretend to be archival footage the studio does not own.",
    strategy:
      "Use three stops and one commodity. Let maps and chapter cards carry orientation. Write narration that says when a claim is inference. Keep the thumbnail to a road, a mineral tone, and a short title.",
    process: [
      "Choose three stops that can each hold one scene.",
      "Separate sourced facts from inference in the research notes.",
      "Write a narration with pauses where a map needs to land.",
      "Design chapter cards and a map treatment before the edit.",
      "Cut for comprehension first, then for pace.",
      "Package the title and description without sensational dates.",
    ],
    deliverables: ["Research notes", "Script", "Map and chapter system", "Edit plan", "Thumbnail concept"],
    resultsNote,
    projectSlug: "the-salt-road",
    relatedSlugs: ["the-last-cartographer", "ordinary-objects"],
    galleryMotifs: ["salt", "atlas", "archive"],
    order: 2,
  }),
  study({
    id: "case_copper",
    slug: "copper-and-ink",
    title: "Copper and Ink",
    industry: "Thumbnail design",
    brief:
      "Rebuild a flat title card into a thumbnail that can be understood at the size of a browse result, using one material and one idea.",
    challenge:
      "The before frame treats the title as a document. At a small size the hierarchy disappears. The study had to add a focal shape without turning the frame into a cluttered poster.",
    strategy:
      "Keep the words, change the grade, and give the eye one copper form. Test the frame by reading it from across the room rather than by inventing a click-through rate.",
    process: [
      "Write the title at the size it will actually appear.",
      "Remove competing shapes until one remains.",
      "Set a copper grade and an ink field.",
      "Check the crop in a small frame and a wide frame.",
      "Record what changed and what was intentionally left out.",
    ],
    deliverables: ["Before frame", "After frame", "Type notes", "Export crop"],
    resultsNote,
    projectSlug: "copper-and-ink",
    relatedSlugs: ["night-market-boards", "the-quiet-compound"],
    galleryMotifs: ["copper", "ledger", "forge"],
    order: 3,
  }),
];

function stat(input: Omit<Statistic, "createdAt" | "updatedAt" | "sample" | "suffix" | "note"> & Partial<Pick<Statistic, "suffix" | "note">>): Statistic {
  return {
    sample: true,
    suffix: input.suffix ?? "",
    note: input.note ?? "Sample figure for the layout. Not a verified studio record.",
    createdAt: SEED_AT,
    updatedAt: SEED_AT,
    ...input,
  };
}

export const seedStatistics: Statistic[] = [
  stat({ id: "stat_projects", label: "Projects Completed", value: 24, order: 1 }),
  stat({ id: "stat_videos", label: "Videos Produced", value: 80, order: 2 }),
  stat({ id: "stat_niches", label: "Niches Covered", value: 11, order: 3 }),
  stat({ id: "stat_services", label: "Production Services", value: 12, order: 4 }),
];

function comparison(input: Omit<ComparisonItem, "createdAt" | "updatedAt" | "published" | "beforeMediaId" | "afterMediaId">): ComparisonItem {
  return {
    published: true,
    beforeMediaId: "",
    afterMediaId: "",
    createdAt: SEED_AT,
    updatedAt: SEED_AT,
    ...input,
  };
}

export const seedComparisons: ComparisonItem[] = [
  comparison({
    id: "cmp_copper",
    title: "Copper and Ink",
    explanation:
      "A concept demonstration. The before frame is a flat type card. The after frame rebuilds the same title with a copper grade, one focal shape, and type that can be read at a small size. This is not a client redesign and it has no measured click-through.",
    beforeMotif: "ledger",
    afterMotif: "copper",
    order: 1,
  }),
  comparison({
    id: "cmp_market",
    title: "Night Market Boards",
    explanation:
      "A second concept study. The before frame is an even, low-contrast layout. The after frame uses a darker field, one warm light, and a shorter read. No viewer data is attached.",
    beforeMotif: "archive",
    afterMotif: "market",
    order: 2,
  }),
];

export const seedActivity: ActivityEvent[] = [
  {
    id: "act_seed",
    message: "Sample catalog loaded into this browser.",
    at: SEED_AT,
  },
];

export type SeedSnapshot = {
  projects: PortfolioProject[];
  services: ServiceItem[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
  caseStudies: CaseStudy[];
  statistics: Statistic[];
  inquiries: [];
  comparisons: ComparisonItem[];
  settings: SiteSettings;
  activity: ActivityEvent[];
};

export function createSeedSnapshot(): SeedSnapshot {
  return {
    projects: seedProjects,
    services: seedServices,
    testimonials: seedTestimonials,
    faqs: seedFaqs,
    caseStudies: seedCaseStudies,
    statistics: seedStatistics,
    inquiries: [],
    comparisons: seedComparisons,
    settings: defaultSettings,
    activity: seedActivity,
  };
}
