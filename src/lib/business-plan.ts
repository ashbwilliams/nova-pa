export const planReviewStatuses = ["working", "needs_review", "approved"] as const;

export type PlanReviewStatus = (typeof planReviewStatuses)[number];

export type PlanSectionKey =
  | "program"
  | "pricing"
  | "operations"
  | "finance"
  | "evidence";

export type ThreeYearNumbers = [number, number, number];
export type ThreeYearLabels = [string, string, string];

export type BusinessPlanSettings = {
  revisionTitle: string;
  revisedDate: string;
  planningHorizon: string;
  overallStatus: string;
  changeSummary: string;
  updatedAt: string;
  sectionStatus: Record<PlanSectionKey, PlanReviewStatus>;
  program: {
    launchStartDate: string;
    launchEndDate: string;
    orientationDate: string;
    demonstrationDate: string;
    cycleSchedule: string;
    location: string;
    capacity: number;
    minimumEnrollment: number;
    intensiveCapacity: number;
    clinicsYearOne: number;
    playgroundsYearOne: number;
    coreEnrollments: ThreeYearNumbers;
    intensiveEnrollments: ThreeYearNumbers;
    clinicParticipants: ThreeYearNumbers;
    playgroundParticipants: ThreeYearNumbers;
    schoolRelationships: ThreeYearLabels;
    teachingFellows: ThreeYearLabels;
  };
  pricing: {
    coreTuition: number;
    intensiveTuition: number;
    clinicParticipant: number;
    clinicObserver: number;
    playgroundParticipant: number;
    playgroundObserver: number;
    deposit: number;
    financialAidRate: number;
    refundPolicy: string;
  };
  operations: {
    leadEducator: string;
    staffingPlan: string;
    rehearsalSite: string;
    facilityStatus: string;
    activeSchoolRelationships: string;
    institutionalPartners: string;
    governanceUpdate: string;
  };
  finance: {
    foundingCampaignTarget: number;
    foundingCampaignSecured: number;
    projectedRevenue: ThreeYearNumbers;
    projectedExpenses: ThreeYearNumbers;
    campaignPriority: string;
  };
  evidence: {
    demandUpdate: string;
    recruitmentUpdate: string;
    outcomeUpdate: string;
    riskUpdate: string;
    growthPriorities: string;
    launchMilestones: string;
  };
};

export type BusinessPlanReviewIssue = {
  level: "blocker" | "attention";
  section: PlanSectionKey;
  message: string;
};

export const planSectionLabels: Record<PlanSectionKey, string> = {
  program: "Program and schedule",
  pricing: "Pricing and access",
  operations: "People, facilities, and partners",
  finance: "Financial outlook",
  evidence: "Evidence, risks, and growth",
};

export const defaultBusinessPlanSettings: BusinessPlanSettings = {
  revisionTitle: "Founding plan",
  revisedDate: "2026-07-22",
  planningHorizon: "November 2026 through October 2029",
  overallStatus: "Working plan for board, partner, funder, and operating use",
  changeSummary: "Clarified open family enrollment and school-respecting cooperation.",
  updatedAt: "",
  sectionStatus: {
    program: "needs_review",
    pricing: "needs_review",
    operations: "working",
    finance: "needs_review",
    evidence: "working",
  },
  program: {
    launchStartDate: "2026-11-14",
    launchEndDate: "2027-01-23",
    orientationDate: "2026-11-07",
    demonstrationDate: "2027-01-30",
    cycleSchedule: "Eight Saturday rehearsals with breaks for Thanksgiving and the winter holidays",
    location: "Central Texas",
    capacity: 20,
    minimumEnrollment: 12,
    intensiveCapacity: 18,
    clinicsYearOne: 6,
    playgroundsYearOne: 2,
    coreEnrollments: [40, 80, 120],
    intensiveEnrollments: [18, 36, 54],
    clinicParticipants: [120, 200, 280],
    playgroundParticipants: [40, 80, 120],
    schoolRelationships: ["3 to 5", "6 to 10", "10 to 15"],
    teachingFellows: ["2 to 4", "4 to 8", "6 to 12"],
  },
  pricing: {
    coreTuition: 495,
    intensiveTuition: 525,
    clinicParticipant: 55,
    clinicObserver: 10,
    playgroundParticipant: 75,
    playgroundObserver: 15,
    deposit: 100,
    financialAidRate: 15,
    refundPolicy:
      "Full refunds are available before the published commitment date. After that date, refunds depend on whether the seat can be filled and on documented exceptions. If NOVA 8 cancels, families receive a refund or may elect a credit.",
  },
  operations: {
    leadEducator: "To be appointed",
    staffingPlan:
      "One experienced lead educator, two section instructors or teaching fellows, and one designated administrative and safety lead for the founding cohort.",
    rehearsalSite: "Site to be confirmed",
    facilityStatus: "Seeking a reliable gym, band hall, or multipurpose rehearsal space with storage and safe loading access.",
    activeSchoolRelationships: "Three to five cooperative school relationships targeted in Year 1.",
    institutionalPartners: "Collegiate percussion studios and independent ensembles under discussion.",
    governanceUpdate: "NOVA Performing Arts board retains fiduciary, safety, and launch authority. Program leadership owns curriculum and day-to-day delivery within approved policy.",
  },
  finance: {
    foundingCampaignTarget: 75000,
    foundingCampaignSecured: 0,
    projectedRevenue: [125650, 189725, 252388],
    projectedExpenses: [120000, 176000, 232000],
    campaignPriority:
      "Fund launch staffing, rehearsal space, consumables, scholarships, insurance, youth-safety systems, registration, marketing, and working capital.",
  },
  evidence: {
    demandUpdate: "Family and educator discovery is in progress. No enrollment claims should be treated as validated until interest converts to deposits.",
    recruitmentUpdate: "Use direct family enrollment, public clinics, educator referrals, community outreach, and partner communications as parallel recruitment paths.",
    outcomeUpdate: "The founding cycle will establish baseline, mid-cycle, and end-of-cycle measures for student growth, family trust, school usefulness, attendance, and return intent.",
    riskUpdate: "Highest current risks are calendar fit, rehearsal-space stability, instructor appointment, founding enrollment, affordability, and sufficient cash before commitments are made.",
    growthPriorities: "Year 1 proves usefulness. Year 2 establishes a predictable annual schedule. Year 3 expands only where staffing, facilities, demand, safety, and cash flow support it.",
    launchMilestones: "Validate the calendar with local directors; appoint the lead educator; secure rehearsal space; approve safety and refund policies; open interest and deposit collection; make the final launch decision.",
  },
};

const textValue = (value: unknown, fallback: string, max = 4000) =>
  typeof value === "string" ? value.trim().slice(0, max) : fallback;

const numberValue = (value: unknown, fallback: number, min = 0, max = 10_000_000) => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, Math.round(parsed))) : fallback;
};

function threeNumbers(value: unknown, fallback: ThreeYearNumbers): ThreeYearNumbers {
  const items = Array.isArray(value) ? value : [];
  return [0, 1, 2].map((index) => numberValue(items[index], fallback[index])) as ThreeYearNumbers;
}

function threeLabels(value: unknown, fallback: ThreeYearLabels): ThreeYearLabels {
  const items = Array.isArray(value) ? value : [];
  return [0, 1, 2].map((index) => textValue(items[index], fallback[index], 80)) as ThreeYearLabels;
}

export function normalizeBusinessPlanSettings(value: unknown): BusinessPlanSettings {
  const input = value && typeof value === "object" ? value as Partial<BusinessPlanSettings> : {};
  const program = input.program ?? {} as BusinessPlanSettings["program"];
  const pricing = input.pricing ?? {} as BusinessPlanSettings["pricing"];
  const operations = input.operations ?? {} as BusinessPlanSettings["operations"];
  const finance = input.finance ?? {} as BusinessPlanSettings["finance"];
  const evidence = input.evidence ?? {} as BusinessPlanSettings["evidence"];
  const statuses = input.sectionStatus ?? {} as Partial<Record<PlanSectionKey, PlanReviewStatus>>;
  const status = (key: PlanSectionKey) => planReviewStatuses.includes(statuses[key] as PlanReviewStatus)
    ? statuses[key] as PlanReviewStatus
    : defaultBusinessPlanSettings.sectionStatus[key];

  return {
    revisionTitle: textValue(input.revisionTitle, defaultBusinessPlanSettings.revisionTitle, 120),
    revisedDate: textValue(input.revisedDate, defaultBusinessPlanSettings.revisedDate, 10),
    planningHorizon: textValue(input.planningHorizon, defaultBusinessPlanSettings.planningHorizon, 160),
    overallStatus: textValue(input.overallStatus, defaultBusinessPlanSettings.overallStatus, 200),
    changeSummary: textValue(input.changeSummary, defaultBusinessPlanSettings.changeSummary, 1000),
    updatedAt: textValue(input.updatedAt, "", 40),
    sectionStatus: {
      program: status("program"),
      pricing: status("pricing"),
      operations: status("operations"),
      finance: status("finance"),
      evidence: status("evidence"),
    },
    program: {
      launchStartDate: textValue(program.launchStartDate, defaultBusinessPlanSettings.program.launchStartDate, 10),
      launchEndDate: textValue(program.launchEndDate, defaultBusinessPlanSettings.program.launchEndDate, 10),
      orientationDate: textValue(program.orientationDate, defaultBusinessPlanSettings.program.orientationDate, 10),
      demonstrationDate: textValue(program.demonstrationDate, defaultBusinessPlanSettings.program.demonstrationDate, 10),
      cycleSchedule: textValue(program.cycleSchedule, defaultBusinessPlanSettings.program.cycleSchedule, 500),
      location: textValue(program.location, defaultBusinessPlanSettings.program.location, 200),
      capacity: numberValue(program.capacity, defaultBusinessPlanSettings.program.capacity, 1, 200),
      minimumEnrollment: numberValue(program.minimumEnrollment, defaultBusinessPlanSettings.program.minimumEnrollment, 1, 200),
      intensiveCapacity: numberValue(program.intensiveCapacity, defaultBusinessPlanSettings.program.intensiveCapacity, 1, 200),
      clinicsYearOne: numberValue(program.clinicsYearOne, defaultBusinessPlanSettings.program.clinicsYearOne, 0, 100),
      playgroundsYearOne: numberValue(program.playgroundsYearOne, defaultBusinessPlanSettings.program.playgroundsYearOne, 0, 100),
      coreEnrollments: threeNumbers(program.coreEnrollments, defaultBusinessPlanSettings.program.coreEnrollments),
      intensiveEnrollments: threeNumbers(program.intensiveEnrollments, defaultBusinessPlanSettings.program.intensiveEnrollments),
      clinicParticipants: threeNumbers(program.clinicParticipants, defaultBusinessPlanSettings.program.clinicParticipants),
      playgroundParticipants: threeNumbers(program.playgroundParticipants, defaultBusinessPlanSettings.program.playgroundParticipants),
      schoolRelationships: threeLabels(program.schoolRelationships, defaultBusinessPlanSettings.program.schoolRelationships),
      teachingFellows: threeLabels(program.teachingFellows, defaultBusinessPlanSettings.program.teachingFellows),
    },
    pricing: {
      coreTuition: numberValue(pricing.coreTuition, defaultBusinessPlanSettings.pricing.coreTuition),
      intensiveTuition: numberValue(pricing.intensiveTuition, defaultBusinessPlanSettings.pricing.intensiveTuition),
      clinicParticipant: numberValue(pricing.clinicParticipant, defaultBusinessPlanSettings.pricing.clinicParticipant),
      clinicObserver: numberValue(pricing.clinicObserver, defaultBusinessPlanSettings.pricing.clinicObserver),
      playgroundParticipant: numberValue(pricing.playgroundParticipant, defaultBusinessPlanSettings.pricing.playgroundParticipant),
      playgroundObserver: numberValue(pricing.playgroundObserver, defaultBusinessPlanSettings.pricing.playgroundObserver),
      deposit: numberValue(pricing.deposit, defaultBusinessPlanSettings.pricing.deposit),
      financialAidRate: numberValue(pricing.financialAidRate, defaultBusinessPlanSettings.pricing.financialAidRate, 0, 100),
      refundPolicy: textValue(pricing.refundPolicy, defaultBusinessPlanSettings.pricing.refundPolicy, 2000),
    },
    operations: {
      leadEducator: textValue(operations.leadEducator, defaultBusinessPlanSettings.operations.leadEducator, 200),
      staffingPlan: textValue(operations.staffingPlan, defaultBusinessPlanSettings.operations.staffingPlan, 2000),
      rehearsalSite: textValue(operations.rehearsalSite, defaultBusinessPlanSettings.operations.rehearsalSite, 240),
      facilityStatus: textValue(operations.facilityStatus, defaultBusinessPlanSettings.operations.facilityStatus, 2000),
      activeSchoolRelationships: textValue(operations.activeSchoolRelationships, defaultBusinessPlanSettings.operations.activeSchoolRelationships, 2000),
      institutionalPartners: textValue(operations.institutionalPartners, defaultBusinessPlanSettings.operations.institutionalPartners, 2000),
      governanceUpdate: textValue(operations.governanceUpdate, defaultBusinessPlanSettings.operations.governanceUpdate, 2000),
    },
    finance: {
      foundingCampaignTarget: numberValue(finance.foundingCampaignTarget, defaultBusinessPlanSettings.finance.foundingCampaignTarget),
      foundingCampaignSecured: numberValue(finance.foundingCampaignSecured, defaultBusinessPlanSettings.finance.foundingCampaignSecured),
      projectedRevenue: threeNumbers(finance.projectedRevenue, defaultBusinessPlanSettings.finance.projectedRevenue),
      projectedExpenses: threeNumbers(finance.projectedExpenses, defaultBusinessPlanSettings.finance.projectedExpenses),
      campaignPriority: textValue(finance.campaignPriority, defaultBusinessPlanSettings.finance.campaignPriority, 2000),
    },
    evidence: {
      demandUpdate: textValue(evidence.demandUpdate, defaultBusinessPlanSettings.evidence.demandUpdate, 2000),
      recruitmentUpdate: textValue(evidence.recruitmentUpdate, defaultBusinessPlanSettings.evidence.recruitmentUpdate, 2000),
      outcomeUpdate: textValue(evidence.outcomeUpdate, defaultBusinessPlanSettings.evidence.outcomeUpdate, 2000),
      riskUpdate: textValue(evidence.riskUpdate, defaultBusinessPlanSettings.evidence.riskUpdate, 2000),
      growthPriorities: textValue(evidence.growthPriorities, defaultBusinessPlanSettings.evidence.growthPriorities, 2000),
      launchMilestones: textValue(evidence.launchMilestones, defaultBusinessPlanSettings.evidence.launchMilestones, 2000),
    },
  };
}

export function reviewBusinessPlan(settings: BusinessPlanSettings): BusinessPlanReviewIssue[] {
  const issues: BusinessPlanReviewIssue[] = [];
  const add = (level: BusinessPlanReviewIssue["level"], section: PlanSectionKey, message: string) =>
    issues.push({ level, section, message });

  if (!settings.program.launchStartDate || !settings.program.launchEndDate) {
    add("blocker", "program", "The founding cycle needs both a start and end date before export is treated as final.");
  } else if (settings.program.launchEndDate < settings.program.launchStartDate) {
    add("blocker", "program", "The cycle end date is earlier than the start date.");
  }
  if (settings.program.minimumEnrollment > settings.program.capacity) {
    add("blocker", "program", "Minimum enrollment cannot exceed cohort capacity.");
  }
  if (/to be|tbd|seeking|not yet|unconfirmed/i.test(settings.operations.rehearsalSite)) {
    add("attention", "operations", "The rehearsal site still appears unconfirmed.");
  }
  if (/to be|tbd|not yet|unconfirmed/i.test(settings.operations.leadEducator)) {
    add("attention", "operations", "The lead educator is not yet named.");
  }
  if (!settings.pricing.refundPolicy || settings.pricing.refundPolicy.length < 60) {
    add("blocker", "pricing", "The refund and cancellation policy needs enough detail for a family to understand the terms.");
  }
  if (settings.finance.foundingCampaignSecured > settings.finance.foundingCampaignTarget) {
    add("attention", "finance", "Secured founding support exceeds the campaign target. Confirm whether the target should be revised.");
  }
  if (settings.finance.foundingCampaignTarget > 0 && settings.finance.foundingCampaignSecured < settings.finance.foundingCampaignTarget * 0.75) {
    add("attention", "finance", "Less than 75% of the founding campaign is recorded as secured, the plan's stated launch funding threshold.");
  }
  settings.finance.projectedRevenue.forEach((revenue, index) => {
    if (revenue < settings.finance.projectedExpenses[index]) {
      add("attention", "finance", `Year ${index + 1} projects an operating deficit.`);
    }
  });
  if (settings.evidence.riskUpdate.length < 40) {
    add("attention", "evidence", "The current risk update is too brief to support a meaningful review.");
  }
  (Object.keys(settings.sectionStatus) as PlanSectionKey[]).forEach((key) => {
    if (settings.sectionStatus[key] === "working") {
      add("attention", key, `${planSectionLabels[key]} is still marked Working.`);
    }
  });

  return issues;
}
