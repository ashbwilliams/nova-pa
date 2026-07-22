import type { BusinessPlanSettings } from "@/lib/business-plan";

export const fundraisingReviewStatuses = ["working", "needs_review", "approved"] as const;

export type FundraisingReviewStatus = (typeof fundraisingReviewStatuses)[number];
export type FundraisingSectionKey = "story" | "campaign" | "impact" | "details";

export type FundingUse = {
  id: string;
  title: string;
  amount: number;
  description: string;
};

export type GivingOpportunity = {
  id: string;
  title: string;
  amount: number;
  description: string;
};

export type ImpactMetric = {
  id: string;
  value: string;
  label: string;
  description: string;
};

export type CampaignMilestone = {
  id: string;
  period: string;
  title: string;
  description: string;
};

export type FundraisingPackageSettings = {
  revisionTitle: string;
  revisedDate: string;
  campaignTitle: string;
  campaignSubtitle: string;
  preparedFor: string;
  recipientIntroduction: string;
  campaignGoal: number;
  amountSecured: number;
  caseForSupport: string;
  needStatement: string;
  solutionStatement: string;
  readinessStatement: string;
  cooperativeStatement: string;
  fundingUses: FundingUse[];
  givingOpportunities: GivingOpportunity[];
  impactMetrics: ImpactMetric[];
  timeline: CampaignMilestone[];
  donationUrl: string;
  donationInstructions: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactUrl: string;
  taxStatus: string;
  ein: string;
  updatedAt: string;
  sectionStatus: Record<FundraisingSectionKey, FundraisingReviewStatus>;
};

export type FundraisingReviewIssue = {
  level: "blocker" | "attention";
  section: FundraisingSectionKey;
  message: string;
};

export const fundraisingSectionLabels: Record<FundraisingSectionKey, string> = {
  story: "Case for support",
  campaign: "Campaign and giving",
  impact: "Impact and timeline",
  details: "Donation and organization details",
};

export const defaultFundraisingPackageSettings: FundraisingPackageSettings = {
  revisionTitle: "Founding campaign package",
  revisedDate: "2026-07-22",
  campaignTitle: "Give young musicians more time to grow.",
  campaignSubtitle: "Help launch NOVA 8 Percussion in Central Texas.",
  preparedFor: "",
  recipientIntroduction: "",
  campaignGoal: 75000,
  amountSecured: 0,
  caseForSupport:
    "Young percussionists often have more potential than their school schedules can fully develop. NOVA 8 Percussion will provide sustained, high-quality marching percussion instruction without competitive pressure, giving students more time to strengthen fundamentals, build confidence, and prepare for what comes next.",
  needStatement:
    "School music programs carry enormous instructional demands within limited rehearsal time. Students who need additional repetitions, individualized attention, or a longer developmental runway do not always have an accessible place to continue growing.",
  solutionStatement:
    "NOVA 8 offers eight-week programs, focused clinics, an 8th Grade Intensive, and public Percussion Playground experiences. Families may enroll directly, while NOVA works in active respect of school programs and returns stronger, better-prepared students to their ensembles.",
  readinessStatement:
    "NOVA already has the core instruments and electronics required to begin. Founding support can go directly toward program delivery rather than major equipment acquisition.",
  cooperativeStatement:
    "NOVA 8 does not operate around school music programs. It works with them, extending instructional capacity where helpful while keeping student access open to every family.",
  fundingUses: [
    { id: "instruction", title: "Educators and program staff", amount: 25000, description: "Compensation for lead instruction, section support, administration, and supervised teaching fellows." },
    { id: "space", title: "Rehearsal space and logistics", amount: 15000, description: "Reliable rehearsal access, storage, transportation, setup, and facility-related costs." },
    { id: "access", title: "Scholarships and student access", amount: 10000, description: "Need-based assistance so ability to pay does not determine who can participate." },
    { id: "supplies", title: "Heads, mallets, and supplies", amount: 8000, description: "Recurring consumables, maintenance, and the materials students use every week." },
    { id: "safety", title: "Safety, insurance, and administration", amount: 8000, description: "Youth-protection systems, background checks, insurance, registration, accounting, and legal support." },
    { id: "launch", title: "Launch and working capital", amount: 9000, description: "Recruitment, community events, production costs, and the cash reserve needed to make responsible commitments." },
  ],
  givingOpportunities: [
    { id: "student", title: "Sponsor student access", amount: 500, description: "Help underwrite tuition assistance and the recurring materials a student needs to participate." },
    { id: "fellow", title: "Support a teaching fellow", amount: 2500, description: "Create mentored teaching experience for an emerging percussion educator." },
    { id: "playground", title: "Present a Percussion Playground", amount: 5000, description: "Help introduce students, families, and community members to the ensemble experience." },
    { id: "cohort", title: "Underwrite a founding cohort", amount: 15000, description: "Support instruction, rehearsal space, safety, and student access for an eight-week cycle." },
    { id: "partner", title: "Become a founding annual partner", amount: 25000, description: "Provide cornerstone operating support for NOVA 8's first year and its path to sustainability." },
  ],
  impactMetrics: [
    { id: "core", value: "40", label: "Core seat-enrollments", description: "Year 1 planning target across NOVA 8 sessions." },
    { id: "intensive", value: "18", label: "8th Grade Intensive seats", description: "Focused preparation for the transition into high-school percussion." },
    { id: "clinics", value: "120", label: "Public-clinic participants", description: "Accessible points of entry for students and families." },
    { id: "schools", value: "3 to 5", label: "School relationships", description: "Cooperative relationships targeted during the founding year." },
  ],
  timeline: [
    { id: "foundation", period: "Summer 2026", title: "Build the foundation", description: "Confirm curriculum, recruit advisory educators, establish safety procedures, and develop partnerships." },
    { id: "readiness", period: "Early fall 2026", title: "Secure launch readiness", description: "Appoint instructors, secure rehearsal space, approve family terms, and begin student recruitment." },
    { id: "engagement", period: "Fall 2026", title: "Engage the community", description: "Use clinics, demonstrations, educator outreach, and Percussion Playground to introduce the program." },
    { id: "launch", period: "November 2026", title: "Begin the founding cycle", description: "Launch the first instructional cycle or a shorter founding pilot, using the calendar validated with local educators and families." },
  ],
  donationUrl: "",
  donationInstructions:
    "To discuss a founding gift, sponsored program, in-kind rehearsal space, or another form of support, contact NOVA Performing Arts using the information below.",
  contactName: "NOVA Performing Arts",
  contactEmail: "",
  contactPhone: "",
  contactUrl: "https://novaperformingarts.org/contact",
  taxStatus:
    "NOVA Performing Arts is a 501(c)(3) nonprofit organization. Contributions are tax-deductible to the extent allowed by law. The deductible amount may be reduced when a donor receives goods or services in return.",
  ein: "",
  updatedAt: "",
  sectionStatus: {
    story: "needs_review",
    campaign: "needs_review",
    impact: "needs_review",
    details: "working",
  },
};

const textValue = (value: unknown, fallback: string, max = 4000) =>
  typeof value === "string" ? value.trim().slice(0, max) : fallback;

const numberValue = (value: unknown, fallback: number, min = 0, max = 10_000_000) => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, Math.round(parsed))) : fallback;
};

function idValue(value: unknown, fallback: string) {
  return textValue(value, fallback, 80).replace(/[^a-zA-Z0-9_-]/g, "-") || fallback;
}

function normalizeFundingUses(value: unknown): FundingUse[] {
  if (!Array.isArray(value)) return defaultFundraisingPackageSettings.fundingUses;
  return value.slice(0, 20).map((item, index) => {
    const entry = item && typeof item === "object" ? item as Partial<FundingUse> : {};
    return {
      id: idValue(entry.id, `use-${index + 1}`),
      title: textValue(entry.title, "", 120),
      amount: numberValue(entry.amount, 0),
      description: textValue(entry.description, "", 600),
    };
  });
}

function normalizeGivingOpportunities(value: unknown): GivingOpportunity[] {
  if (!Array.isArray(value)) return defaultFundraisingPackageSettings.givingOpportunities;
  return value.slice(0, 20).map((item, index) => {
    const entry = item && typeof item === "object" ? item as Partial<GivingOpportunity> : {};
    return {
      id: idValue(entry.id, `gift-${index + 1}`),
      title: textValue(entry.title, "", 120),
      amount: numberValue(entry.amount, 0),
      description: textValue(entry.description, "", 600),
    };
  });
}

function normalizeImpactMetrics(value: unknown): ImpactMetric[] {
  if (!Array.isArray(value)) return defaultFundraisingPackageSettings.impactMetrics;
  return value.slice(0, 12).map((item, index) => {
    const entry = item && typeof item === "object" ? item as Partial<ImpactMetric> : {};
    return {
      id: idValue(entry.id, `impact-${index + 1}`),
      value: textValue(entry.value, "", 40),
      label: textValue(entry.label, "", 120),
      description: textValue(entry.description, "", 500),
    };
  });
}

function normalizeTimeline(value: unknown): CampaignMilestone[] {
  if (!Array.isArray(value)) return defaultFundraisingPackageSettings.timeline;
  return value.slice(0, 12).map((item, index) => {
    const entry = item && typeof item === "object" ? item as Partial<CampaignMilestone> : {};
    return {
      id: idValue(entry.id, `milestone-${index + 1}`),
      period: textValue(entry.period, "", 80),
      title: textValue(entry.title, "", 120),
      description: textValue(entry.description, "", 600),
    };
  });
}

export function normalizeFundraisingPackage(value: unknown): FundraisingPackageSettings {
  const input = value && typeof value === "object" ? value as Partial<FundraisingPackageSettings> : {};
  const statuses = input.sectionStatus ?? {} as Partial<Record<FundraisingSectionKey, FundraisingReviewStatus>>;
  const status = (key: FundraisingSectionKey) => fundraisingReviewStatuses.includes(statuses[key] as FundraisingReviewStatus)
    ? statuses[key] as FundraisingReviewStatus
    : defaultFundraisingPackageSettings.sectionStatus[key];

  return {
    revisionTitle: textValue(input.revisionTitle, defaultFundraisingPackageSettings.revisionTitle, 120),
    revisedDate: textValue(input.revisedDate, defaultFundraisingPackageSettings.revisedDate, 10),
    campaignTitle: textValue(input.campaignTitle, defaultFundraisingPackageSettings.campaignTitle, 180),
    campaignSubtitle: textValue(input.campaignSubtitle, defaultFundraisingPackageSettings.campaignSubtitle, 240),
    preparedFor: textValue(input.preparedFor, "", 160),
    recipientIntroduction: textValue(input.recipientIntroduction, "", 1600),
    campaignGoal: numberValue(input.campaignGoal, defaultFundraisingPackageSettings.campaignGoal),
    amountSecured: numberValue(input.amountSecured, defaultFundraisingPackageSettings.amountSecured),
    caseForSupport: textValue(input.caseForSupport, defaultFundraisingPackageSettings.caseForSupport, 3000),
    needStatement: textValue(input.needStatement, defaultFundraisingPackageSettings.needStatement, 2000),
    solutionStatement: textValue(input.solutionStatement, defaultFundraisingPackageSettings.solutionStatement, 2000),
    readinessStatement: textValue(input.readinessStatement, defaultFundraisingPackageSettings.readinessStatement, 1600),
    cooperativeStatement: textValue(input.cooperativeStatement, defaultFundraisingPackageSettings.cooperativeStatement, 1600),
    fundingUses: normalizeFundingUses(input.fundingUses),
    givingOpportunities: normalizeGivingOpportunities(input.givingOpportunities),
    impactMetrics: normalizeImpactMetrics(input.impactMetrics),
    timeline: normalizeTimeline(input.timeline),
    donationUrl: textValue(input.donationUrl, "", 500),
    donationInstructions: textValue(input.donationInstructions, defaultFundraisingPackageSettings.donationInstructions, 1600),
    contactName: textValue(input.contactName, defaultFundraisingPackageSettings.contactName, 160),
    contactEmail: textValue(input.contactEmail, "", 240),
    contactPhone: textValue(input.contactPhone, "", 80),
    contactUrl: textValue(input.contactUrl, defaultFundraisingPackageSettings.contactUrl, 500),
    taxStatus: textValue(input.taxStatus, defaultFundraisingPackageSettings.taxStatus, 1200),
    ein: textValue(input.ein, "", 24),
    updatedAt: textValue(input.updatedAt, "", 40),
    sectionStatus: {
      story: status("story"),
      campaign: status("campaign"),
      impact: status("impact"),
      details: status("details"),
    },
  };
}

function isWebUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function reviewFundraisingPackage(
  settings: FundraisingPackageSettings,
  businessPlan?: BusinessPlanSettings,
): FundraisingReviewIssue[] {
  const issues: FundraisingReviewIssue[] = [];
  const add = (level: FundraisingReviewIssue["level"], section: FundraisingSectionKey, message: string) =>
    issues.push({ level, section, message });
  const allocated = settings.fundingUses.reduce((sum, item) => sum + item.amount, 0);

  if (!settings.revisionTitle) {
    add("blocker", "details", "Add a revision title before export.");
  }
  if (!isValidIsoDate(settings.revisedDate)) {
    add("blocker", "details", "Enter a valid revision date before export.");
  }
  if (!settings.campaignTitle || !settings.campaignSubtitle) {
    add("blocker", "story", "Add both a campaign title and subtitle before export.");
  }
  if (settings.caseForSupport.length < 150 || settings.needStatement.length < 80 || settings.solutionStatement.length < 80) {
    add("blocker", "story", "The case for support needs a substantive case, need statement, and solution before export.");
  }
  if (!settings.campaignGoal) {
    add("blocker", "campaign", "Set a fundraising goal before export.");
  }
  if (allocated !== settings.campaignGoal) {
    add("blocker", "campaign", `Funding uses total $${allocated.toLocaleString("en-US")}, not the $${settings.campaignGoal.toLocaleString("en-US")} campaign goal.`);
  }
  if (settings.fundingUses.length < 3 || settings.fundingUses.some((item) => !item.title || !item.amount || item.description.length < 20)) {
    add("blocker", "campaign", "Every funding use needs a title, positive amount, and useful description.");
  }
  if (settings.givingOpportunities.length < 3 || settings.givingOpportunities.some((item) => !item.title || !item.amount || item.description.length < 20)) {
    add("blocker", "campaign", "Include at least three complete giving opportunities.");
  }
  if (settings.amountSecured > settings.campaignGoal) {
    add("attention", "campaign", "Recorded support exceeds the campaign goal. Confirm whether the goal should be revised.");
  }
  if (settings.impactMetrics.length < 3 || settings.impactMetrics.some((item) => !item.value || !item.label || item.description.length < 15)) {
    add("blocker", "impact", "Include at least three complete impact measures.");
  }
  if (settings.timeline.length < 3 || settings.timeline.some((item) => !item.period || !item.title || item.description.length < 20)) {
    add("blocker", "impact", "Include at least three complete campaign or launch milestones.");
  }
  if (!isWebUrl(settings.donationUrl)) {
    add("blocker", "details", "Add a complete donation URL so the exported package gives readers a clear next step.");
  }
  if (settings.donationInstructions.length < 40) {
    add("blocker", "details", "Donation instructions are too brief to guide a prospective supporter.");
  }
  if (!settings.contactName || ![settings.contactEmail, settings.contactPhone, settings.contactUrl].some(Boolean)) {
    add("blocker", "details", "Add a contact name and at least one contact method.");
  }
  if (settings.contactEmail && !isValidEmail(settings.contactEmail)) {
    add("blocker", "details", "Enter a valid contact email address or remove it before export.");
  }
  if (settings.contactUrl && !isWebUrl(settings.contactUrl)) {
    add("blocker", "details", "The contact-page URL is not a complete web address.");
  }
  if (!/501\s*\(c\)\s*\(3\)/i.test(settings.taxStatus)) {
    add("attention", "details", "The tax-status language does not clearly identify NOVA as a 501(c)(3) organization.");
  }
  if (!settings.ein) {
    add("attention", "details", "The EIN is not shown. It is optional in the package but some institutional donors may expect it.");
  }
  if (businessPlan) {
    if (settings.campaignGoal !== businessPlan.finance.foundingCampaignTarget) {
      add("attention", "campaign", "The campaign goal differs from the current Business Plan Builder value.");
    }
    if (settings.amountSecured !== businessPlan.finance.foundingCampaignSecured) {
      add("attention", "campaign", "The amount secured differs from the current Business Plan Builder value.");
    }
    const expected = [
      String(businessPlan.program.coreEnrollments[0]),
      String(businessPlan.program.intensiveEnrollments[0]),
      String(businessPlan.program.clinicParticipants[0]),
      businessPlan.program.schoolRelationships[0],
    ];
    const actual = settings.impactMetrics.slice(0, 4).map((item) => item.value);
    if (expected.some((value, index) => value !== actual[index])) {
      add("attention", "impact", "One or more headline impact figures differ from the current business-plan assumptions.");
    }
  }
  (Object.keys(settings.sectionStatus) as FundraisingSectionKey[]).forEach((key) => {
    if (settings.sectionStatus[key] === "working") {
      add("attention", key, `${fundraisingSectionLabels[key]} is still marked Working.`);
    }
  });

  return issues;
}

export function applyBusinessPlanToFundraisingPackage(
  settings: FundraisingPackageSettings,
  businessPlan: BusinessPlanSettings,
): FundraisingPackageSettings {
  const impact = [...settings.impactMetrics];
  const values = [
    String(businessPlan.program.coreEnrollments[0]),
    String(businessPlan.program.intensiveEnrollments[0]),
    String(businessPlan.program.clinicParticipants[0]),
    businessPlan.program.schoolRelationships[0],
  ];
  values.forEach((value, index) => {
    if (impact[index]) impact[index] = { ...impact[index], value };
  });
  const currentAllocation = settings.fundingUses.reduce((sum, item) => sum + item.amount, 0);
  const target = businessPlan.finance.foundingCampaignTarget;
  const fundingUses = settings.fundingUses.map((item) => ({ ...item }));
  if (fundingUses.length && currentAllocation !== target) {
    let allocated = 0;
    fundingUses.forEach((item, index) => {
      const amount = index === fundingUses.length - 1
        ? Math.max(0, target - allocated)
        : currentAllocation
          ? Math.max(0, Math.floor((item.amount / currentAllocation * target) / 100) * 100)
          : 0;
      fundingUses[index] = { ...item, amount };
      allocated += amount;
    });
  }

  return {
    ...settings,
    campaignGoal: target,
    amountSecured: businessPlan.finance.foundingCampaignSecured,
    fundingUses,
    impactMetrics: impact,
  };
}
