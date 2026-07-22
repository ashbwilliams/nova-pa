import "server-only";

import { randomUUID } from "node:crypto";

import type { InquiryStatus, InquiryTopic } from "@/lib/nova-types";
import type { SiteMediaState } from "@/lib/nova-media";
import {
  defaultPlaygroundPlan,
  normalizePlaygroundPlan,
  type PlaygroundPlan,
} from "@/lib/playground-plan";
import {
  defaultRelationshipDirectory,
  normalizeRelationshipDirectory,
  type RelationshipDirectory,
} from "@/lib/relationship-directory";
import {
  defaultBusinessPlanSettings,
  normalizeBusinessPlanSettings,
  type BusinessPlanSettings,
} from "@/lib/business-plan";
import {
  defaultFundraisingPackageSettings,
  normalizeFundraisingPackage,
  type FundraisingPackageSettings,
} from "@/lib/fundraising-package";
import {
  emptyDocumentVersionHistory,
  normalizeDocumentVersionHistory,
  type DocumentVersion,
  type DocumentVersionHistory,
} from "@/lib/document-versioning";

export { inquiryStatuses, inquiryTopics } from "@/lib/nova-types";
export type { InquiryStatus, InquiryTopic } from "@/lib/nova-types";

export type Inquiry = {
  id: string;
  topic: InquiryTopic;
  name: string;
  email: string;
  organization: string | null;
  message: string;
  status: InquiryStatus;
  internal_notes: string;
  created_at: string;
  updated_at: string;
};

export type SiteContent = {
  announcementEnabled: boolean;
  announcementText: string;
  homeHeroBody: string;
  missionStatement: string;
  academyHeadline: string;
  academyOverview: string;
  supportHeadline: string;
  supportOverview: string;
  contactHeadline: string;
  contactIntro: string;
  media: SiteMediaState;
  playgroundPlan: PlaygroundPlan;
  relationshipDirectory: RelationshipDirectory;
  businessPlan: BusinessPlanSettings;
  fundraisingPackage: FundraisingPackageSettings;
};

export type ProgramDetails = {
  statusLabel: string;
  statusMessage: string;
  seasonDates: string;
  location: string;
  participationCost: string;
  eligibility: string;
  interestOpen: boolean;
};

export const defaultSiteContent: SiteContent = {
  announcementEnabled: false,
  announcementText: "",
  homeHeroBody:
    "NOVA Performing Arts is building NOVA 8 Percussion, a noncompetitive marching percussion development program that gives young musicians more opportunities to train, perform, and grow throughout the year, especially beyond their school marching season.",
  missionStatement:
    "Talent is everywhere. Access to sustained, high-quality marching arts education is not.",
  academyHeadline: "More time to grow.",
  academyOverview:
    "NOVA 8 Percussion is a noncompetitive marching percussion development program where Central Texas youth can strengthen their skills, learn together, and stay connected across seasons.",
  supportHeadline: "The instruments are ready. Help bring the program to life.",
  supportOverview:
    "Your support funds educator and staff salaries, rehearsal space, student access, and the day-to-day operations that turn those instruments into a lasting program.",
  contactHeadline: "Start with a conversation.",
  contactIntro:
    "Whether you are a student, parent, educator, donor, or community partner, we would like to hear what brings you to NOVA.",
  media: {},
  playgroundPlan: defaultPlaygroundPlan,
  relationshipDirectory: defaultRelationshipDirectory,
  businessPlan: defaultBusinessPlanSettings,
  fundraisingPackage: defaultFundraisingPackageSettings,
};

const legacySiteContent = {
  homeHeroBody: [
    "NOVA Performing Arts is building a noncompetitive, off-season marching percussion academy where young musicians can keep developing their craft.",
    "NOVA Performing Arts is building NOVA 8, a noncompetitive, off-season marching percussion academy where young musicians can keep developing their craft.",
    "NOVA Performing Arts is building NOVA 8 Percussion, a noncompetitive, off-season marching percussion academy where young musicians can keep developing their craft.",
  ],
  academyHeadline: ["A place to keep developing."],
  academyOverview: [
    "A noncompetitive, off-season academy where Central Texas youth can strengthen their marching percussion skills, learn together, and stay connected to the activity they love.",
    "NOVA 8 is a noncompetitive, off-season academy where Central Texas youth can strengthen their marching percussion skills, learn together, and stay connected to the activity they love.",
    "NOVA 8 Percussion is a noncompetitive, off-season academy where Central Texas youth can strengthen their marching percussion skills, learn together, and stay connected to the activity they love.",
  ],
  supportOverview: [
    "Your support can turn an off-season gap into months of instruction, mentorship, artistry, and belonging for young percussionists across Central Texas.",
    "Your support can give young percussionists across Central Texas more opportunities for instruction, mentorship, artistry, and belonging throughout the year.",
  ],
  supportHeadline: [
    "Help build the place students keep going.",
    "Help give students more time to grow.",
  ],
};

function mergeSiteContent(content: Partial<SiteContent> | null | undefined) {
  const merged = {
    ...defaultSiteContent,
    ...(content ?? {}),
    media: { ...defaultSiteContent.media, ...(content?.media ?? {}) },
    playgroundPlan: normalizePlaygroundPlan(content?.playgroundPlan),
    relationshipDirectory: normalizeRelationshipDirectory(
      content?.relationshipDirectory,
    ),
    businessPlan: normalizeBusinessPlanSettings(content?.businessPlan),
    fundraisingPackage: normalizeFundraisingPackage(content?.fundraisingPackage),
  };

  if (legacySiteContent.homeHeroBody.includes(merged.homeHeroBody)) {
    merged.homeHeroBody = defaultSiteContent.homeHeroBody;
  }

  if (legacySiteContent.academyHeadline.includes(merged.academyHeadline)) {
    merged.academyHeadline = defaultSiteContent.academyHeadline;
  }

  if (legacySiteContent.academyOverview.includes(merged.academyOverview)) {
    merged.academyOverview = defaultSiteContent.academyOverview;
  }

  if (legacySiteContent.supportOverview.includes(merged.supportOverview)) {
    merged.supportOverview = defaultSiteContent.supportOverview;
  }

  if (legacySiteContent.supportHeadline.includes(merged.supportHeadline)) {
    merged.supportHeadline = defaultSiteContent.supportHeadline;
  }

  return merged;
}

export const defaultProgramDetails: ProgramDetails = {
  statusLabel: "In development",
  statusMessage:
    "Program schedule, location, participation costs, and enrollment details will be announced as launch plans and resources are finalized.",
  seasonDates: "",
  location: "Central Texas",
  participationCost: "",
  eligibility:
    "Central Texas youth with marching percussion experience or a serious interest in developing it.",
  interestOpen: true,
};

const legacyProgramStatusMessages = [
  "Program schedule, location, participation costs, and enrollment details will be announced as launch resources are secured.",
];

function mergeProgramDetails(
  program: Partial<ProgramDetails> | null | undefined,
) {
  const merged = { ...defaultProgramDetails, ...(program ?? {}) };

  if (legacyProgramStatusMessages.includes(merged.statusMessage)) {
    merged.statusMessage = defaultProgramDetails.statusMessage;
  }

  return merged;
}

type SiteStateRow = {
  content?: Partial<SiteContent> | null;
  program?: Partial<ProgramDetails> | null;
  updated_at?: string;
};

export class NovaDataConflictError extends Error {
  constructor(message = "A newer change was saved elsewhere.") {
    super(message);
    this.name = "NovaDataConflictError";
  }
}

export class NovaDataReadError extends Error {
  constructor(message = "NOVA data could not be read safely.") {
    super(message);
    this.name = "NovaDataReadError";
  }
}

export function getNovaDataConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key =
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  return url && key ? { url, key } : null;
}

export function isNovaDataConfigured() {
  return Boolean(getNovaDataConfig());
}

async function supabaseRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const config = getNovaDataConfig();

  if (!config) {
    throw new Error("NOVA data storage is not configured.");
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: config.key,
      ...(config.key.startsWith("sb_secret_")
        ? {}
        : { Authorization: `Bearer ${config.key}` }),
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`NOVA data request failed with status ${response.status}.`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export async function getSiteState() {
  const config = getNovaDataConfig();

  if (!config) {
    return {
      content: defaultSiteContent,
      program: defaultProgramDetails,
      configured: false,
    };
  }

  try {
    const rows = await supabaseRequest<SiteStateRow[]>(
      "nova_site_state?id=eq.primary&select=content,program&limit=1",
    );
    const row = rows[0];

    return {
      content: mergeSiteContent(row?.content),
      program: mergeProgramDetails(row?.program),
      configured: true,
    };
  } catch {
    return {
      content: defaultSiteContent,
      program: defaultProgramDetails,
      configured: false,
    };
  }
}

export async function updateSiteContent(content: SiteContent) {
  await supabaseRequest<void>("nova_site_state?id=eq.primary", {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ content, updated_at: new Date().toISOString() }),
  });
}

export async function updateSiteMedia(media: SiteMediaState) {
  const { content } = await getSiteState();
  await updateSiteContent({ ...content, media });
}

export async function updatePlaygroundPlan(playgroundPlan: PlaygroundPlan) {
  const { content } = await getSiteState();
  await updateSiteContent({ ...content, playgroundPlan });
}

export async function updateRelationshipDirectory(
  relationshipDirectory: RelationshipDirectory,
) {
  const { content } = await getSiteState();
  await updateSiteContent({ ...content, relationshipDirectory });
}

export async function updateBusinessPlan(
  businessPlan: BusinessPlanSettings,
  expectedUpdatedAt = businessPlan.updatedAt,
) {
  return updateContentSection("businessPlan", businessPlan, expectedUpdatedAt);
}

export async function updateFundraisingPackage(
  fundraisingPackage: FundraisingPackageSettings,
  expectedUpdatedAt = fundraisingPackage.updatedAt,
) {
  return updateContentSection(
    "fundraisingPackage",
    fundraisingPackage,
    expectedUpdatedAt,
  );
}

type VersionHistoryRow = {
  content?: unknown;
  updated_at?: string;
};

async function getSiteStateRowStrict(): Promise<Required<SiteStateRow>> {
  let rows: SiteStateRow[];
  try {
    rows = await supabaseRequest<SiteStateRow[]>(
      "nova_site_state?id=eq.primary&select=content,program,updated_at&limit=1",
    );
  } catch (error) {
    throw new NovaDataReadError(
      error instanceof Error ? error.message : undefined,
    );
  }

  const row = rows[0];
  if (!row?.updated_at) {
    throw new NovaDataReadError("The primary NOVA data record is unavailable.");
  }
  return {
    content: row.content ?? {},
    program: row.program ?? {},
    updated_at: row.updated_at,
  };
}

async function updateContentSection<
  K extends "businessPlan" | "fundraisingPackage",
>(
  section: K,
  value: SiteContent[K],
  expectedSectionUpdatedAt: string,
) {
  const nextUpdatedAt = new Date().toISOString();

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const row = await getSiteStateRowStrict();
    const content = mergeSiteContent(row.content);
    const currentSectionUpdatedAt = content[section].updatedAt;
    if (currentSectionUpdatedAt !== expectedSectionUpdatedAt) {
      throw new NovaDataConflictError();
    }

    const nextValue = { ...value, updatedAt: nextUpdatedAt } as SiteContent[K];
    const path = `nova_site_state?id=eq.primary&updated_at=eq.${encodeURIComponent(row.updated_at)}&select=updated_at`;
    const updated = await supabaseRequest<{ updated_at: string }[]>(path, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        content: { ...content, [section]: nextValue },
        updated_at: nextUpdatedAt,
      }),
    });

    if (updated.length === 1) return nextUpdatedAt;
  }

  throw new NovaDataConflictError(
    "The draft changed repeatedly while this save was in progress.",
  );
}

async function getVersionHistoryRowStrict(): Promise<VersionHistoryRow | null> {
  try {
    const rows = await supabaseRequest<VersionHistoryRow[]>(
      "nova_site_state?id=eq.version_history&select=content,updated_at&limit=1",
    );
    return rows[0] ?? null;
  } catch (error) {
    throw new NovaDataReadError(
      error instanceof Error ? error.message : undefined,
    );
  }
}

export async function getDocumentVersionHistory(): Promise<DocumentVersionHistory> {
  if (!getNovaDataConfig()) return emptyDocumentVersionHistory;

  const row = await getVersionHistoryRowStrict();
  return normalizeDocumentVersionHistory(
    row?.content,
    normalizeBusinessPlanSettings,
    normalizeFundraisingPackage,
  );
}

export async function appendDocumentVersion(version: DocumentVersion) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const row = await getVersionHistoryRowStrict();
    const history = normalizeDocumentVersionHistory(
      row?.content,
      normalizeBusinessPlanSettings,
      normalizeFundraisingPackage,
    );
    if ([...history.businessPlan, ...history.fundraisingPackage]
      .some((item) => item.id === version.id)) return;

    const updatedAt = version.createdAt;
    const writeToken = randomUUID();
    const nextHistory: DocumentVersionHistory = version.documentType === "business_plan"
      ? { ...history, businessPlan: [version, ...history.businessPlan], updatedAt, writeToken }
      : { ...history, fundraisingPackage: [version, ...history.fundraisingPackage], updatedAt, writeToken };

    if (!row) {
      const inserted = await supabaseRequest<VersionHistoryRow[]>(
        "nova_site_state?on_conflict=id&select=updated_at",
        {
          method: "POST",
          headers: { Prefer: "resolution=ignore-duplicates,return=representation" },
          body: JSON.stringify({
            id: "version_history",
            content: nextHistory,
            program: {},
            updated_at: updatedAt,
          }),
        },
      );
      if (inserted.length === 1) return;
      continue;
    }

    if (!row.updated_at) {
      throw new NovaDataReadError("Version-history concurrency metadata is missing.");
    }
    const tokenFilter = history.writeToken
      ? `eq.${encodeURIComponent(history.writeToken)}`
      : "is.null";
    const path = `nova_site_state?id=eq.version_history&updated_at=eq.${encodeURIComponent(row.updated_at)}&content->>writeToken=${tokenFilter}&select=updated_at`;
    const updated = await supabaseRequest<VersionHistoryRow[]>(path, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ content: nextHistory, updated_at: updatedAt }),
    });
    if (updated.length === 1) return;
  }

  throw new NovaDataConflictError(
    "Version history changed repeatedly while this version was being saved.",
  );
}

export async function updateProgramDetails(program: ProgramDetails) {
  await supabaseRequest<void>("nova_site_state?id=eq.primary", {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ program, updated_at: new Date().toISOString() }),
  });
}

export async function createInquiry(input: {
  topic: InquiryTopic;
  name: string;
  email: string;
  organization: string;
  message: string;
}) {
  await supabaseRequest<void>("nova_inquiries", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      topic: input.topic,
      name: input.name,
      email: input.email,
      organization: input.organization || null,
      message: input.message,
      status: "new",
      internal_notes: "",
    }),
  });
}

export async function listInquiries() {
  if (!getNovaDataConfig()) return [];

  try {
    return await supabaseRequest<Inquiry[]>(
      "nova_inquiries?select=id,topic,name,email,organization,message,status,internal_notes,created_at,updated_at&order=created_at.desc",
    );
  } catch {
    return [];
  }
}

export async function updateInquiry(
  id: string,
  status: InquiryStatus,
  internalNotes: string,
) {
  await supabaseRequest<void>(`nova_inquiries?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      status,
      internal_notes: internalNotes,
      updated_at: new Date().toISOString(),
    }),
  });
}

export async function deleteInquiry(id: string) {
  await supabaseRequest<void>(`nova_inquiries?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  });
}
