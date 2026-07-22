import "server-only";

import fs from "node:fs";
import path from "node:path";
import JSZip from "jszip";
import { marked } from "marked";
import type { BusinessPlanSettings } from "@/lib/business-plan";

const contentRoot = path.join(process.cwd(), "src", "content", "business-plan");

const sourcePlan = fs.readFileSync(path.join(contentRoot, "NOVA_8_Business_Plan.md"), "utf8");
const directorAnalysis = fs.readFileSync(path.join(contentRoot, "NOVA_8_Band_Director_Pressure_Test.md"), "utf8");
const parentAnalysis = fs.readFileSync(path.join(contentRoot, "NOVA_8_Parent_Pressure_Test.md"), "utf8");
const offlineStyle = fs.readFileSync(path.join(contentRoot, "offline-style.css"), "utf8");
const offlineApp = fs.readFileSync(path.join(contentRoot, "offline-app.js"), "utf8");
const novaMark = Buffer.from(fs.readFileSync(path.join(contentRoot, "nova-mark.base64"), "utf8"), "base64");

marked.setOptions({ gfm: true, breaks: false });

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function displayDate(value: string) {
  if (!value) return "Not selected";
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function safeText(value: string) {
  return value.replace(/[&<>]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
  })[character] ?? character);
}

function tableText(value: string) {
  return safeText(value).replaceAll("|", "\\|").replace(/\s+/g, " ").trim();
}

function paragraphs(value: string) {
  return safeText(value).split(/\n+/).map((line) => line.trim()).filter(Boolean).join("\n\n");
}

function replaceSection(document: string, heading: string, nextHeading: string, body: string) {
  const start = document.indexOf(heading);
  const end = document.indexOf(nextHeading, start + heading.length);
  if (start < 0 || end < 0) return document;
  return `${document.slice(0, start)}${heading}\n\n${body.trim()}\n\n${document.slice(end)}`;
}

function insertBefore(document: string, marker: string, content: string) {
  const index = document.indexOf(marker);
  if (index < 0) return document;
  return `${document.slice(0, index)}${content.trim()}\n\n${document.slice(index)}`;
}

export function renderBusinessPlanMarkdown(settings: BusinessPlanSettings) {
  const operatingResults = settings.finance.projectedRevenue.map(
    (revenue, index) => revenue - settings.finance.projectedExpenses[index],
  );
  const campaignGap = Math.max(0, settings.finance.foundingCampaignTarget - settings.finance.foundingCampaignSecured);
  const coreGross = settings.program.capacity * settings.pricing.coreTuition;
  const coreNet = Math.round(coreGross * (1 - settings.pricing.financialAidRate / 100));
  const intensiveGross = settings.program.intensiveCapacity * settings.pricing.intensiveTuition;
  const intensiveNet = Math.round(intensiveGross * (1 - settings.pricing.financialAidRate / 100));
  const clinicGross = 20 * settings.pricing.clinicParticipant + 10 * settings.pricing.clinicObserver;
  const playgroundGross = 20 * settings.pricing.playgroundParticipant + 20 * settings.pricing.playgroundObserver;
  const statusLabel = (value: string) => value === "approved" ? "Approved" : value === "needs_review" ? "Needs review" : "Working";

  let document = sourcePlan
    .replace(/^\*\*Revised:\*\*.*$/m, `**Revised:** ${displayDate(settings.revisedDate)}  `)
    .replace(/^\*\*Planning horizon:\*\*.*$/m, `**Planning horizon:** ${safeText(settings.planningHorizon)}  `)
    .replace(/^\*\*Status:\*\*.*$/m, `**Status:** ${safeText(settings.overallStatus)}`)
    .replaceAll("November 2026 launch plan", "Founding launch plan")
    .replaceAll("#17-november-2026-launch-plan", "#17-founding-launch-plan")
    .replace(
      "can direct family interest, public events, and cooperative educator relationships together reliably fill one 20-student cohort?",
      `can direct family interest, public events, and cooperative educator relationships together reliably fill one ${settings.program.capacity}-student cohort?`,
    )
    .replace("- 16 to 20 students\n- Initial readiness assessment", `- Up to ${settings.program.intensiveCapacity} students\n- Initial readiness assessment`);

  document = insertBefore(document, "## Contents", `## Current planning assumptions\n\nThis revision is labeled **${safeText(settings.revisionTitle)}**. The table below consolidates the working decisions that change most often. The durable mission, access model, school-respecting operating principles, educational philosophy, and youth-safety commitments remain unchanged.\n\n| Area | Current decision | Review status |\n|---|---|---|\n| Founding cycle | ${tableText(displayDate(settings.program.launchStartDate))} through ${tableText(displayDate(settings.program.launchEndDate))} | ${statusLabel(settings.sectionStatus.program)} |\n| Rehearsal location | ${tableText(settings.program.location)}; ${tableText(settings.operations.rehearsalSite)} | ${statusLabel(settings.sectionStatus.operations)} |\n| Core cohort | ${settings.program.minimumEnrollment} minimum; ${settings.program.capacity} capacity; ${money.format(settings.pricing.coreTuition)} tuition | ${statusLabel(settings.sectionStatus.pricing)} |\n| Founding campaign | ${money.format(settings.finance.foundingCampaignSecured)} secured toward ${money.format(settings.finance.foundingCampaignTarget)} | ${statusLabel(settings.sectionStatus.finance)} |\n| Evidence and risk | ${tableText(settings.evidence.riskUpdate)} | ${statusLabel(settings.sectionStatus.evidence)} |\n\n**What changed in this revision:** ${safeText(settings.changeSummary)}`);

  document = replaceSection(document, "## 1.4 Founding goals", "## 1.5 Three-year outlook", `During the first operating year, NOVA 8 will aim to:\n\n- Secure ${tableText(settings.operations.rehearsalSite)} as a reliable rehearsal home\n- Begin the first eight-week cycle on ${displayDate(settings.program.launchStartDate)}\n- Serve ${settings.program.coreEnrollments[0]} core-program seat-enrollments and ${settings.program.intensiveEnrollments[0]} 8th Grade Intensive seat-enrollments\n- Present ${settings.program.clinicsYearOne} public social clinics and ${settings.program.playgroundsYearOne} Percussion Playground events\n- Establish ${tableText(settings.program.schoolRelationships[0])} active school relationships without making director involvement an enrollment requirement\n- Pilot the Teaching Fellowship with ${tableText(settings.program.teachingFellows[0])} fellows\n- Provide need-based assistance without lowering instructional standards\n- Produce evidence that students return to their school ensembles better prepared\n- Finish the year with a sustainable operating result and a documented model for renewal\n\n“Seat-enrollment” means one registration in one program cycle. Returning students may account for more than one seat-enrollment.`);

  document = replaceSection(document, "## 1.5 Three-year outlook", "## 1.6 Immediate funding objective", `| Measure | Year 1 | Year 2 | Year 3 |\n|---|---:|---:|---:|\n| Core eight-week seat-enrollments | ${settings.program.coreEnrollments.join(" | ")} |\n| 8th Grade Intensive seat-enrollments | ${settings.program.intensiveEnrollments.join(" | ")} |\n| Public social-clinic participants | ${settings.program.clinicParticipants.join(" | ")} |\n| Percussion Playground participants | ${settings.program.playgroundParticipants.join(" | ")} |\n| Active school relationships | ${settings.program.schoolRelationships.map(tableText).join(" | ")} |\n| Teaching fellows | ${settings.program.teachingFellows.map(tableText).join(" | ")} |\n| Projected cash revenue | ${settings.finance.projectedRevenue.map((value) => money.format(value)).join(" | ")} |\n| Projected operating result | ${operatingResults.map((value) => money.format(value)).join(" | ")} |`);

  document = replaceSection(document, "## 1.6 Immediate funding objective", "# 2. Organization, mission, and identity", `NOVA 8 should seek **${money.format(settings.finance.foundingCampaignTarget)} in founding cash support**. ${money.format(settings.finance.foundingCampaignSecured)} is currently recorded as secured, leaving a working gap of ${money.format(campaignGap)}. A rehearsal-space partner or equivalent in-kind facility support remains a separate priority.\n\n${paragraphs(settings.finance.campaignPriority)}`);

  document = replaceSection(document, "### Founding format", "### Program levels", `- Eight rehearsals from ${displayDate(settings.program.launchStartDate)} through ${displayDate(settings.program.launchEndDate)}\n- ${tableText(settings.program.cycleSchedule)}\n- ${settings.program.capacity}-student planned capacity with a ${settings.program.minimumEnrollment}-student operating threshold\n- ${tableText(settings.program.location)}\n- Orientation on ${displayDate(settings.program.orientationDate)}\n- Culminating demonstration or contingency date on ${displayDate(settings.program.demonstrationDate)}\n- Placement by readiness, age, instrumentation, and developmental need\n- Battery, front ensemble, movement, musicianship, and full-ensemble work\n- Family communication and attendance expectations published before deposits are accepted`);

  document = replaceSection(document, "## 7.7 Calendar coordination", "## 7.8 Data and consent boundaries", `The current working cycle runs from **${displayDate(settings.program.launchStartDate)} through ${displayDate(settings.program.launchEndDate)}**. ${paragraphs(settings.program.cycleSchedule)}.\n\nBefore the cycle is approved, NOVA 8 will compare these dates with local football playoffs, concert preparation, region auditions, indoor percussion, school breaks, and other commitments identified by area directors and families. Direct family enrollment remains available regardless of whether a student's school participates in that validation.\n\nOrientation is planned for ${displayDate(settings.program.orientationDate)}, and the demonstration or contingency date is ${displayDate(settings.program.demonstrationDate)}.`);

  document = replaceSection(document, "## 11.6 Deposits, refunds, and payment plans", "## 11.7 Launch funnel targets", `- A ${money.format(settings.pricing.deposit)} deposit reserves a seat\n- Payment plans will be available\n- Need-based aid is budgeted at approximately ${settings.pricing.financialAidRate}% of gross student tuition\n- Aid may cover some or all tuition and will not change a student's program standing\n\n${paragraphs(settings.pricing.refundPolicy)}`);

  document = replaceSection(document, "## 11.7 Launch funnel targets", "## 11.8 Public-event follow-up", `To fill a ${settings.program.capacity}-student founding cohort, NOVA 8 should initially target:\n\n- At least ${Math.ceil(settings.program.capacity * 3.75)} qualified family or student leads across all channels\n- At least ${Math.ceil(settings.program.capacity * 1.75)} completed interest forms\n- At least ${Math.ceil(settings.program.capacity * 1.25)} placement-ready applicants\n- ${settings.program.capacity} confirmed students, with a minimum operating threshold of ${settings.program.minimumEnrollment}\n- A waitlist of at least ${Math.max(3, Math.ceil(settings.program.capacity * 0.25))} students where instrumentation allows\n- Enough direct-family demand that enrollment does not depend on any single school relationship\n\nThese are management assumptions. Actual conversion data should replace them after the first cycle.`);

  document = replaceSection(document, "## 12.2 Founding price assumptions", "## 12.3 Pricing philosophy", `| Offering | Working price | Access provision |\n|---|---:|---|\n| Eight-week NOVA 8 program | ${money.format(settings.pricing.coreTuition)} per student | ${money.format(settings.pricing.deposit)} deposit; payment plans and need-based aid |\n| 8th Grade Intensive | ${money.format(settings.pricing.intensiveTuition)} per student | Payment plans, aid, school or sponsor support |\n| Public social clinic participant | ${money.format(settings.pricing.clinicParticipant)} | Sponsored tickets for selected events |\n| Public social clinic observer | ${money.format(settings.pricing.clinicObserver)} | May be waived for access or host purposes |\n| Percussion Playground participant | ${money.format(settings.pricing.playgroundParticipant)} | Sponsor-supported community seats |\n| Percussion Playground observer | ${money.format(settings.pricing.playgroundObserver)} | Host or sponsor guest allocation |\n\nThese are planning prices. Final rates should be adopted only after staff compensation, facility cost, insurance, payment processing, and financial-aid capacity are confirmed.`);

  document = document.replace(/The financial plan assumes aid equal to approximately 15 percent of gross student tuition\./, `The financial plan assumes aid equal to approximately ${settings.pricing.financialAidRate} percent of gross student tuition.`);

  document = replaceSection(document, "## 13.2 Facility strategy", "## 13.3 Instruments and equipment", `**Current rehearsal site:** ${safeText(settings.operations.rehearsalSite)}\n\n**Facility status:** ${paragraphs(settings.operations.facilityStatus)}\n\nThe site decision should prioritize safe capacity, acoustic tolerance, storage, loading access, accessibility, restrooms, emergency procedures, predictable dates, and a practical family travel radius. A donated or subsidized site is financially valuable only if it is operationally dependable.`);

  document = replaceSection(document, "### Founding minimum", "## 13.5 Weekly operating cycle", `**Lead educator:** ${safeText(settings.operations.leadEducator)}\n\n**Staffing plan:** ${paragraphs(settings.operations.staffingPlan)}\n\nThe final staffing ratio must reflect student ages, placement mix, facility layout, instrument assignments, youth-protection practices, and the amount of simultaneous battery and front-ensemble instruction.`);

  document = insertBefore(document, "## 14.2 Management responsibilities", `### Current governance update\n\n${paragraphs(settings.operations.governanceUpdate)}\n\n**Active school relationships:** ${paragraphs(settings.operations.activeSchoolRelationships)}\n\n**Institutional partners:** ${paragraphs(settings.operations.institutionalPartners)}`);

  document = replaceSection(document, "## 16.2 Founding capital requirement", "## 16.3 Illustrative unit economics", `NOVA 8's current founding campaign target is **${money.format(settings.finance.foundingCampaignTarget)}**. As of this revision, **${money.format(settings.finance.foundingCampaignSecured)}** is recorded as secured, leaving **${money.format(campaignGap)}** to close.\n\n${paragraphs(settings.finance.campaignPriority)}\n\nThe launch gate remains at least 75 percent of the founding cash target secured before NOVA commits to the full launch budget, unless the board formally approves a smaller fully financed pilot.`);

  document = replaceSection(document, "## 16.3 Illustrative unit economics", "## 16.4 Three-year cash projection", `### Core eight-week cohort\n\n| Item | Working assumption |\n|---|---:|\n| Planned capacity | ${settings.program.capacity} students |\n| Gross tuition at ${money.format(settings.pricing.coreTuition)} | ${money.format(coreGross)} |\n| Financial-aid allowance | ${settings.pricing.financialAidRate}% |\n| Estimated net tuition | ${money.format(coreNet)} |\n| Illustrative direct delivery cost | ${money.format(11500)} |\n| Required sponsorship or allocation | ${money.format(Math.max(0, 11500 - coreNet))} |\n\n### 8th Grade Intensive\n\n| Item | Working assumption |\n|---|---:|\n| Planned capacity | ${settings.program.intensiveCapacity} students |\n| Gross tuition at ${money.format(settings.pricing.intensiveTuition)} | ${money.format(intensiveGross)} |\n| Estimated net tuition | ${money.format(intensiveNet)} |\n| Illustrative direct delivery cost | ${money.format(10000)} |\n| Required sponsorship or allocation | ${money.format(Math.max(0, 10000 - intensiveNet))} |\n\n### Public social clinic\n\n| Item | Working assumption |\n|---|---:|\n| Gross tickets at 20 participants and 10 observers | ${money.format(clinicGross)} |\n| Illustrative direct cost | ${money.format(850)} |\n| Estimated contribution | ${money.format(clinicGross - 850)} |\n\n### Percussion Playground\n\n| Item | Working assumption |\n|---|---:|\n| Gross tickets at 20 participants and 20 observers | ${money.format(playgroundGross)} |\n| Illustrative direct cost | ${money.format(1250)} |\n| Estimated contribution before sponsorship | ${money.format(playgroundGross - 1250)} |`);

  document = replaceSection(document, "## 16.4 Three-year cash projection", "## 16.5 Interpretation", `### Activity assumptions\n\n| Activity | Year 1 | Year 2 | Year 3 |\n|---|---:|---:|---:|\n| Core seat-enrollments | ${settings.program.coreEnrollments.join(" | ")} |\n| Intensive seat-enrollments | ${settings.program.intensiveEnrollments.join(" | ")} |\n| Public social-clinic participants | ${settings.program.clinicParticipants.join(" | ")} |\n| Percussion Playground participants | ${settings.program.playgroundParticipants.join(" | ")} |\n\n### Cash projection summary\n\n| Measure | Year 1 | Year 2 | Year 3 |\n|---|---:|---:|---:|\n| Total cash revenue | ${settings.finance.projectedRevenue.map((value) => money.format(value)).join(" | ")} |\n| Total cash expense | ${settings.finance.projectedExpenses.map((value) => money.format(value)).join(" | ")} |\n| Projected operating result | ${operatingResults.map((value) => money.format(value)).join(" | ")} |\n\nThe projection is a planning summary. The board should retain a separate line-item budget and rolling cash forecast before contracts, facility commitments, or enrollment guarantees are made.`);

  document = replaceSection(document, "## 16.5 Interpretation", "## 16.6 Cash-flow management", `The projection currently shows operating results of ${operatingResults.map((value, index) => `**${money.format(value)} in Year ${index + 1}**`).join(", ")}. Tuition and ticket revenue demonstrate demand, while contributed revenue and in-kind support preserve access and instructional quality.\n\nChanges to enrollment, pricing, staffing, facility cost, aid, or campaign performance should be reflected in both this plan and the detailed operating budget before the next approval decision.`);

  document = replaceSection(document, "## 16.7 Decision thresholds", "# 17. Founding launch plan", `### Launch the founding cohort when all are true\n\n- At least ${settings.program.minimumEnrollment} students are enrolled, or the board approves a smaller fully funded pilot\n- The instructional lead and required staff are contracted\n- The rehearsal site is secured for the complete cycle\n- Cash on hand and committed support are sufficient to finish the cycle\n- At least ${money.format(Math.round(settings.finance.foundingCampaignTarget * 0.75))}, or 75 percent of the current campaign target, is secured before the full launch budget is committed\n- Insurance, youth-protection, emergency, refund, and family communication requirements are complete\n\n### Delay or resize when any are true\n\n- Enrollment remains below ${settings.program.minimumEnrollment} without explicit approval and full financing for a smaller pilot\n- The facility, instructional lead, safety systems, or cycle financing remains unconfirmed\n- The calendar cannot be reconciled with major school and family commitments\n- Delivering the cycle would require NOVA 8 to compromise staffing, supervision, access, or program quality`);

  document = replaceSection(document, "## 17.1 Launch recommendation", "## 17.2 Work plan", `NOVA 8's current working recommendation is to begin the first eight-week instructional cycle on **${displayDate(settings.program.launchStartDate)}** and complete instruction on **${displayDate(settings.program.launchEndDate)}**, subject to calendar, staff, facility, safety, enrollment, and funding confirmation.\n\n| Milestone | Working date |\n|---|---|\n| Family orientation and equipment fitting | ${displayDate(settings.program.orientationDate)} |\n| Instruction begins | ${displayDate(settings.program.launchStartDate)} |\n| Instruction ends | ${displayDate(settings.program.launchEndDate)} |\n| Demonstration or contingency date | ${displayDate(settings.program.demonstrationDate)} |\n\n${paragraphs(settings.program.cycleSchedule)}`);

  document = replaceSection(document, "## 17.2 Work plan", "## 17.3 Critical path", `${paragraphs(settings.evidence.launchMilestones)}\n\nThe launch sequence should remain gated. NOVA should not accept nonrefundable commitments until the instructional lead, facility, safety practices, consumer terms, staffing, and a financially completable cycle are confirmed.`);

  document = replaceSection(document, "## 18.2 Founding targets", "## 18.3 Evaluation method", `| Measure | Year 1 target |\n|---|---:|\n| Core program seat-enrollments | ${settings.program.coreEnrollments[0]} |\n| 8th Grade Intensive seat-enrollments | ${settings.program.intensiveEnrollments[0]} |\n| Public social-clinic participants | ${settings.program.clinicParticipants[0]} |\n| Percussion Playground participants | ${settings.program.playgroundParticipants[0]} |\n| Active school relationships | ${tableText(settings.program.schoolRelationships[0])} |\n| Teaching fellows | ${tableText(settings.program.teachingFellows[0])} |\n| Minimum founding cohort | ${settings.program.minimumEnrollment} students |\n| Planned founding capacity | ${settings.program.capacity} students |\n\n**Current demand evidence:** ${paragraphs(settings.evidence.demandUpdate)}\n\n**Recruitment performance:** ${paragraphs(settings.evidence.recruitmentUpdate)}\n\n**Outcome evidence:** ${paragraphs(settings.evidence.outcomeUpdate)}`);

  document = replaceSection(document, "## 19.1 Year 1: Prove usefulness", "## 19.4 Expansion tests", `${paragraphs(settings.evidence.growthPriorities)}\n\nGrowth decisions must preserve the open-enrollment model, school-respecting conduct, instructional quality, youth safety, and financial completeness of every cycle.`);

  document = replaceSection(document, "## 20.5 Founding campaign structure", "## 20.6 Stewardship", `The current founding campaign target is **${money.format(settings.finance.foundingCampaignTarget)}**, with **${money.format(settings.finance.foundingCampaignSecured)}** recorded as secured and **${money.format(campaignGap)}** remaining.\n\n${paragraphs(settings.finance.campaignPriority)}\n\nCampaign recognition and gift opportunities should be updated as actual partners, facilities, staffing, and scholarship needs are confirmed. Restricted commitments should not be presented as flexible operating cash.`);

  document = insertBefore(document, "| Risk | Early warning", `**Current risk review:** ${paragraphs(settings.evidence.riskUpdate)}\n\n`);

  document = replaceSection(document, "## 21.1 Contingency scenarios", "# 22. Appendices", `### Conservative launch\n\n- Enroll ${settings.program.minimumEnrollment} to ${Math.max(settings.program.minimumEnrollment, settings.program.capacity - 1)} students\n- Adjust instrumentation and direct expenses deliberately\n- Preserve the full staffing and youth-safety standard required by the actual group\n- Use the first cycle to validate demand, scheduling, and delivery before expansion\n\n### Expected launch\n\n- Enroll the planned ${settings.program.capacity}-student cohort\n- Deliver orientation and a culminating demonstration\n- Recruit ${tableText(settings.program.teachingFellows[0])} teaching fellows\n- Use the founding cycle to recruit the next core session and 8th Grade Intensive\n\n### Strong-demand launch\n\n- Maintain the approved ${settings.program.capacity}-student capacity\n- Create a waitlist rather than overcrowding the cohort\n- Add no simultaneous cohort unless staffing, facility, safety, demand, and cash gates are independently met\n- Use documented demand to plan the next cycle`);

  document = document
    .replace("- Approve November 2026 founding cycle", `- Approve the ${displayDate(settings.program.launchStartDate)} through ${displayDate(settings.program.launchEndDate)} founding cycle`)
    .replace("- Approve $75,000 campaign and planning budget", `- Approve the ${money.format(settings.finance.foundingCampaignTarget)} campaign target and planning budget`)
    .replace(
      /If NOVA 8 secures the lead educator, rehearsal site, safety infrastructure, founding funding, and a 16-to-20-student cohort by the October decision gate, it should proceed with the November 14, 2026 founding cycle\./,
      `If NOVA 8 secures the lead educator, rehearsal site, safety infrastructure, founding funding, and at least ${settings.program.minimumEnrollment} students by the final decision gate, it should proceed with the ${displayDate(settings.program.launchStartDate)} founding cycle.`,
    );

  return document;
}

type ParsedDocument = {
  title: string;
  preface: string;
  sections: { title: string; markdown: string }[];
};

function escapeHtml(value: string) {
  return value.replace(/[&<>\"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" })[character] ?? character);
}

function slugify(value: string) {
  return value.toLowerCase().replace(/&amp;/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
}

function plain(value: string) {
  return value.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1").replace(/[*_`>#]/g, "").replace(/\s+/g, " ").trim();
}

function markdown(value: string) {
  return marked.parse(value, { async: false }) as string;
}

function uniqueHeadingIds(html: string, prefix = "") {
  const used = new Map<string, number>();
  return html.replace(/<h([1-6])>([\s\S]*?)<\/h\1>/g, (_match, level: string, inner: string) => {
    const label = plain(inner.replace(/<[^>]+>/g, ""));
    const base = slugify(`${prefix}-${label}`);
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    const id = count ? `${base}-${count + 1}` : base;
    return `<h${level} id="${id}">${inner}<a class="heading-anchor" href="#${id}" aria-label="Link to ${escapeHtml(label)}">#</a></h${level}>`;
  });
}

function splitTopSections(document: string): ParsedDocument {
  const lines = document.split(/\r?\n/);
  const sections: ParsedDocument["sections"] = [];
  const preface: string[] = [];
  let current: ParsedDocument["sections"][number] | null = null;
  for (let index = 1; index < lines.length; index += 1) {
    const match = lines[index].match(/^#\s+(.+)$/);
    if (match) {
      if (current) sections.push(current);
      current = { title: match[1].trim(), markdown: "" };
    } else if (current) {
      current.markdown += `${lines[index]}\n`;
    } else {
      preface.push(lines[index]);
    }
  }
  if (current) sections.push(current);
  return { title: lines[0].replace(/^#\s+/, ""), preface: preface.join("\n").trim(), sections };
}

function renderChapter(section: ParsedDocument["sections"][number], prefix: string, open = true) {
  const id = slugify(`${prefix}-${section.title}`);
  return `<details class="chapter" id="${id}"${open ? " open" : ""}><summary><span class="chapter-rule"></span><span>${escapeHtml(section.title)}</span><span class="chapter-toggle" aria-hidden="true"></span></summary><div class="chapter-body">${uniqueHeadingIds(markdown(section.markdown), id)}</div></details>`;
}

const navigation = [["index.html", "Home"], ["plan-overview.html", "Plan"], ["director-analysis.html", "Director analysis"], ["parent-analysis.html", "Parent analysis"]];

function header(active: string) {
  const links = navigation.map(([href, label]) => `<a href="${href}"${active === href ? ' aria-current="page"' : ""}>${label}</a>`).join("");
  return `<a class="skip-link" href="#main-content">Skip to content</a><header class="site-header"><div class="site-header-inner"><a class="brand-lockup" href="index.html" aria-label="NOVA 8 business plan home"><span class="brand-mark-wrap"><img src="assets/nova-mark.png" alt=""></span><span class="brand-name"><strong>NOVA</strong><span>Performing Arts</span></span></a><nav class="desktop-nav" aria-label="Primary navigation">${links}<button class="search-trigger" type="button" data-search-open><span aria-hidden="true">⌕</span> Search</button></nav><details class="mobile-nav"><summary>Menu <span aria-hidden="true">＋</span></summary><nav>${links}<button class="search-trigger" type="button" data-search-open>Search the plan</button></nav></details></div></header>`;
}

function footer() {
  return `<footer class="site-footer"><img class="footer-orbit" src="assets/nova-mark.png" alt=""><div class="footer-grid"><div><p class="eyebrow light">NOVA Performing Arts</p><h2>More time to grow.</h2><p>A Central Texas 501(c)(3) nonprofit expanding access to high-quality youth performing arts education.</p></div><div class="footer-links"><p class="footer-label">Business plan</p><a href="plan-overview.html">Read by chapter</a><a href="complete-business-plan.html">Complete plan</a><a href="documents/NOVA_8_Business_Plan.md">Source Markdown</a></div><div class="footer-links"><p class="footer-label">Supporting analysis</p><a href="director-analysis.html">Director pressure test</a><a href="parent-analysis.html">Parent pressure test</a><a href="README.txt">How to use this package</a></div></div><div class="footer-bottom"><span>© ${new Date().getUTCFullYear()} NOVA Performing Arts</span><span>Youth-centered. Access-driven. Artistically ambitious.</span></div></footer>`;
}

function searchDialog() {
  return `<dialog class="search-dialog" data-search-dialog><div class="search-panel"><div class="search-heading"><div><p class="eyebrow">Offline search</p><h2>Find anything.</h2></div><button type="button" class="icon-button" data-search-close aria-label="Close search">×</button></div><label class="search-box"><span class="sr-only">Search</span><input type="search" data-search-input placeholder="Try “rehearsal space” or “refunds”" autocomplete="off"></label><p class="search-help" data-search-help>Searches the complete plan and both supporting analyses.</p><div class="search-results" data-search-results></div></div></dialog>`;
}

function shell(input: { title: string; description: string; active: string; body: string; bodyClass?: string }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escapeHtml(input.title)} | NOVA Performing Arts</title><meta name="description" content="${escapeHtml(input.description)}"><link rel="icon" href="assets/nova-mark.png"><link rel="stylesheet" href="assets/style.css"></head><body class="${input.bodyClass ?? ""}">${header(input.active)}<main id="main-content">${input.body}</main>${footer()}${searchDialog()}<script src="assets/search-index.js"></script><script src="assets/app.js"></script></body></html>`;
}

export async function buildBusinessPlanZip(settings: BusinessPlanSettings) {
  const planDocument = renderBusinessPlanMarkdown(settings);
  const parsedPlan = splitTopSections(planDocument);
  const parsedDirector = splitTopSections(directorAnalysis);
  const parsedParent = splitTopSections(parentAnalysis);
  const zip = new JSZip();
  const root = zip.folder("NOVA_8_Offline_Business_Plan");
  if (!root) throw new Error("Could not create export folder.");

  const groups = [
    { file: "plan-overview.html", label: "Foundation", range: "Sections 1–5", title: "Purpose, need, and strategy", start: 0, end: 5 },
    { file: "plan-programs.html", label: "Programs", range: "Sections 6–9", title: "Programs, schools, and teaching", start: 5, end: 9 },
    { file: "plan-market.html", label: "Market", range: "Sections 10–12", title: "Positioning, enrollment, and revenue", start: 9, end: 12 },
    { file: "plan-operations.html", label: "Operations", range: "Sections 13–15", title: "Staffing, governance, and safety", start: 12, end: 15 },
    { file: "plan-finance.html", label: "Execution", range: "Sections 16–18", title: "Finance, launch, and evaluation", start: 15, end: 18 },
    { file: "plan-growth.html", label: "Growth", range: "Sections 19–22", title: "Growth, fundraising, and contingencies", start: 18, end: parsedPlan.sections.length },
  ];
  const sectionHref = (index: number, complete = false) => {
    const section = parsedPlan.sections[index];
    if (complete) return `#${slugify(`complete-${section.title}`)}`;
    const group = groups.find((candidate) => index >= candidate.start && index < candidate.end) ?? groups[0];
    return `${group.file}#${slugify(`${group.file}-${section.title}`)}`;
  };
  const preface = (prefix: string, complete = false) => {
    const content = parsedPlan.preface.replace(/\n## Contents[\s\S]*$/, "").trim();
    const items = parsedPlan.sections.map((section, index) => ({ section, index })).filter(({ section }) => /^\d+\.\s+/.test(section.title)).map(({ section, index }) => `<li><a href="${sectionHref(index, complete)}">${escapeHtml(section.title.replace(/^\d+\.\s+/, ""))}</a></li>`).join("");
    const conclusionIndex = parsedPlan.sections.findIndex((section) => section.title === "Conclusion");
    return `${uniqueHeadingIds(markdown(content), prefix)}<h2 id="${slugify(`${prefix}-contents`)}">Contents</h2><ol class="linked-contents">${items}</ol>${conclusionIndex >= 0 ? `<p class="contents-conclusion"><a href="${sectionHref(conclusionIndex, complete)}">Conclusion <span aria-hidden="true">→</span></a></p>` : ""}<hr>`;
  };

  groups.forEach((group, index) => {
    const chapterNav = groups.map((item) => `<a href="${item.file}"${item.file === group.file ? ' aria-current="page"' : ""}><span>${item.label}</span><small>${item.range}</small></a>`).join("");
    const chapters = parsedPlan.sections.slice(group.start, group.end).map((section) => renderChapter(section, group.file)).join("");
    const previous = index > 0 ? groups[index - 1] : null;
    const next = index < groups.length - 1 ? groups[index + 1] : null;
    const pager = `<nav class="chapter-pager" aria-label="Business plan chapters">${previous ? `<a href="${previous.file}"><span>Previous</span><strong>← ${previous.label}</strong></a>` : "<span></span>"}<a class="next" href="${next ? next.file : "complete-business-plan.html"}"><span>${next ? "Next" : "Print or review"}</span><strong>${next ? next.label : "Complete plan"} →</strong></a></nav>`;
    const body = `<section class="document-hero"><div><p class="eyebrow">NOVA 8 business plan · ${group.range}</p><h1>${group.title}</h1></div><div class="document-intro"><p>${group.start === 0 ? "The current plan for NOVA 8 Percussion, prepared for board, partner, funder, and operating use." : "Continue through the operating model, with every section available offline and optimized for screen or print."}</p><div class="action-row"><button class="button button-dark" type="button" data-print>Print this chapter</button><button class="text-button" type="button" data-expand-all>Expand all</button><button class="text-button" type="button" data-collapse-all>Collapse all</button></div></div></section><nav class="plan-nav" aria-label="Plan sections">${chapterNav}</nav><article class="document-shell">${group.start === 0 ? `<section class="plan-preface">${preface("preface")}</section>` : ""}${chapters}${pager}</article>`;
    root.file(group.file, shell({ title: group.title, description: `NOVA 8 business plan ${group.range}`, active: "plan-overview.html", body, bodyClass: "document-page" }));
  });

  const analysisPage = (parsed: ParsedDocument, type: "director" | "parent") => {
    const director = type === "director";
    const file = director ? "director-analysis.html" : "parent-analysis.html";
    const title = director ? "Pressure test: school leadership" : "Pressure test: family trust";
    const summary = director ? "A skeptical review of calendar fit, instructional authority, recruiting ethics, facility burden, safety, and school value." : "A skeptical review of value, scheduling, safety, supervision, placement, fairness, communication, and family trust.";
    const cards = (director ? [["Validate", "Calendar fit"], ["Align", "Instructional authority"], ["Limit", "School burden"], ["Require", "Launch protections"]] : [["Clarify", "Calendar burden"], ["Name", "Instructional trust"], ["Define", "Student fit"], ["Publish", "Consumer terms"]]).map(([tag, heading], index) => `<a class="analysis-dashboard-card" href="#${slugify(`${type}-${parsed.sections[Math.min(index + 1, parsed.sections.length - 1)]?.title ?? parsed.sections[0]?.title}`)}"><small>${tag}</small><strong>${heading}</strong><span>Select to read the supporting analysis and recommended safeguards.</span></a>`).join("");
    const body = `<section class="document-hero analysis-hero"><div><p class="eyebrow">${director ? "Band and percussion director perspective" : "Parent and guardian perspective"}</p><h1>${title}</h1></div><div class="document-intro"><p>${summary}</p><div class="action-row"><button class="button button-dark" type="button" data-print>Print analysis</button><button class="text-button" type="button" data-expand-all>Expand all</button><button class="text-button" type="button" data-collapse-all>Collapse all</button></div></div></section><article class="document-shell analysis-shell"><section class="plan-preface">${uniqueHeadingIds(markdown(parsed.preface), `${type}-preface`)}</section><section class="analysis-dashboard"><div class="analysis-dashboard-head"><h2>The decision in one view.</h2><p>${summary}</p></div><div class="analysis-dashboard-grid">${cards}</div></section><div class="analysis-directory-head"><h2>Complete findings</h2><p>${parsed.sections.length} findings and decision sections.</p></div><div class="analysis-sections">${parsed.sections.map((section, index) => renderChapter(section, type, index === 0)).join("")}</div></article>`;
    root.file(file, shell({ title, description: summary, active: file, body, bodyClass: "document-page analysis-page" }));
  };
  analysisPage(parsedDirector, "director");
  analysisPage(parsedParent, "parent");

  const completeBody = `<section class="document-hero"><div><p class="eyebrow">Complete document</p><h1>NOVA 8 Percussion Business Plan</h1></div><div class="document-intro"><p>All 22 sections in one continuous, print-ready view.</p><div class="action-row"><button class="button button-dark" type="button" data-print>Print complete plan</button><a class="text-link" href="plan-overview.html">Read by chapter</a></div></div></section><article class="document-shell complete-shell"><section class="plan-preface">${preface("complete-preface", true)}</section>${parsedPlan.sections.map((section) => renderChapter(section, "complete")).join("")}</article>`;
  root.file("complete-business-plan.html", shell({ title: "Complete Business Plan", description: "The complete NOVA 8 Percussion business plan", active: "plan-overview.html", body: completeBody, bodyClass: "document-page complete-page" }));

  const planCards = groups.map((group, index) => `<a class="plan-card" href="${group.file}"><span class="card-number">0${index + 1}</span><p class="eyebrow">${group.range}</p><h3>${group.title}</h3><span class="card-link">Read chapter <b>↗</b></span></a>`).join("");
  const securedPercent = settings.finance.foundingCampaignTarget ? Math.round(settings.finance.foundingCampaignSecured / settings.finance.foundingCampaignTarget * 100) : 0;
  const homeBody = `<section class="home-hero"><div class="countoff" aria-label="Count off: 5, 6, 5, 6, 7, 8"><span>5</span><span>6</span><span>5</span><span>6</span><span>7</span><strong>8</strong></div><div class="hero-copy"><p class="eyebrow light">${escapeHtml(settings.revisionTitle)} · revised ${escapeHtml(displayDate(settings.revisedDate))}</p><h1><span>NOVA</span> 8</h1><p>Named for the final count before an ensemble begins, NOVA 8 prepares young musicians for what comes next.</p><div class="hero-actions"><a class="button button-light" href="plan-overview.html">Explore the plan</a><button class="button button-ghost" type="button" data-search-open>Search all documents</button></div></div><img class="hero-mark" src="assets/nova-mark.png" alt=""></section><section class="principle-band"><p class="eyebrow light">Open access. Responsible cooperation.</p><blockquote>Families may enroll directly. No director referral, approval, or school partnership is required. NOVA 8 still works in active respect of school music programs.</blockquote></section><section class="home-section"><div class="section-heading"><p class="eyebrow">The complete plan</p><h2>Current, reviewable, and ready to share.</h2><p>${escapeHtml(settings.changeSummary)}</p></div><div class="plan-grid">${planCards}</div></section><section class="metrics-band"><div><span>${settings.program.coreEnrollments[0]}</span><p>Year 1 core seat-enrollments</p></div><div><span>${settings.program.intensiveEnrollments[0]}</span><p>8th Grade Intensive seats</p></div><div><span>${escapeHtml(settings.program.schoolRelationships[0])}</span><p>Active school relationships</p></div><div><span>${securedPercent}%</span><p>Founding campaign secured</p></div></section><section class="review-section"><div><p class="eyebrow light">Evidence over assumption</p><h2>A plan tested from both sides.</h2><p>The supporting analyses identify what skeptical directors and families may resist.</p></div><div class="review-links"><a href="director-analysis.html"><span>01</span><h3>Director pressure test</h3><p>Calendar, instructional authority, facilities, liability, and trust.</p><b>Read analysis ↗</b></a><a href="parent-analysis.html"><span>02</span><h3>Parent pressure test</h3><p>Value, safety, placement, communication, scheduling, and refunds.</p><b>Read analysis ↗</b></a></div></section><section class="offline-note"><div><p class="eyebrow">Portable by design</p><h2>No internet required.</h2></div><div><p>Keep this folder together and open <strong>index.html</strong> in a modern browser.</p><div class="action-row"><a class="button button-dark" href="README.txt">Read instructions</a><a class="text-link" href="complete-business-plan.html">Open print view</a></div></div></section>`;
  root.file("index.html", shell({ title: "NOVA 8 Business Plan", description: "Portable offline business plan for NOVA 8 Percussion", active: "index.html", body: homeBody, bodyClass: "home-page" }));

  const searchIndex: { page: string; title: string; url: string; text: string }[] = [];
  [...groups.map((group) => ({ file: group.file, label: `Business plan · ${group.label}`, sections: parsedPlan.sections.slice(group.start, group.end) })), { file: "director-analysis.html", label: "Director pressure test", sections: parsedDirector.sections }, { file: "parent-analysis.html", label: "Parent pressure test", sections: parsedParent.sections }].forEach((page) => page.sections.forEach((section) => searchIndex.push({ page: page.label, title: section.title, url: `${page.file}#${slugify(`${page.file}-${section.title}`)}`, text: plain(section.markdown).slice(0, 2200) })));

  root.file("assets/style.css", offlineStyle);
  root.file("assets/app.js", offlineApp);
  root.file("assets/search-index.js", `window.NOVA_SEARCH_INDEX=${JSON.stringify(searchIndex)};\n`);
  root.file("assets/nova-mark.png", novaMark);
  root.file("documents/NOVA_8_Business_Plan.md", planDocument);
  root.file("documents/NOVA_8_Band_Director_Pressure_Test.md", directorAnalysis);
  root.file("documents/NOVA_8_Parent_Pressure_Test.md", parentAnalysis);
  root.file("README.txt", `NOVA 8 OFFLINE BUSINESS PLAN\n\nREVISION\n${settings.revisionTitle}\nRevised ${displayDate(settings.revisedDate)}\n\nHOW TO OPEN\n1. Keep this entire folder together.\n2. Double-click index.html.\n3. No internet connection or installation is required.\n\nUSB USE\nCopy the complete NOVA_8_Offline_Business_Plan folder to a USB drive. Do not copy index.html by itself.\n\nPRINTING\nUse the Print button on any page. Use complete-business-plan.html for the entire plan.\n\nSEARCH\nSearch works entirely within this folder and covers the business plan plus both pressure-test analyses.\n`);

  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 6 } });
}
