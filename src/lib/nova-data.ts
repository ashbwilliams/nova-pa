import "server-only";

import type { InquiryStatus, InquiryTopic } from "@/lib/nova-types";

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
  supportHeadline: "Help give students more time to grow.",
  supportOverview:
    "Your support can give young percussionists across Central Texas more opportunities for instruction, mentorship, artistry, and belonging throughout the year.",
  contactHeadline: "Start with a conversation.",
  contactIntro:
    "Whether you are a student, parent, educator, donor, or community partner, we would like to hear what brings you to NOVA.",
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
  ],
  supportHeadline: ["Help build the place students keep going."],
};

function mergeSiteContent(content: Partial<SiteContent> | null | undefined) {
  const merged = { ...defaultSiteContent, ...(content ?? {}) };

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
};

function getConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key =
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  return url && key ? { url, key } : null;
}

export function isNovaDataConfigured() {
  return Boolean(getConfig());
}

async function supabaseRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const config = getConfig();

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
  const config = getConfig();

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
  if (!getConfig()) return [];

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
