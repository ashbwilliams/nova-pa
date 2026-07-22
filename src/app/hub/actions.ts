"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearHubSession,
  createHubSession,
  isHubAuthConfigured,
  requireHubSession,
  verifyHubPassword,
} from "@/lib/hub-auth";
import {
  deleteInquiry,
  getSiteState,
  inquiryStatuses,
  isNovaDataConfigured,
  updateInquiry,
  updatePlaygroundPlan,
  updateProgramDetails,
  updateRelationshipDirectory,
  updateBusinessPlan,
  updateSiteContent,
  updateSiteMedia,
  type InquiryStatus,
  type ProgramDetails,
  type SiteContent,
} from "@/lib/nova-data";
import { normalizePlaygroundPlan } from "@/lib/playground-plan";
import { normalizeRelationshipDirectory } from "@/lib/relationship-directory";
import { normalizeBusinessPlanSettings, reviewBusinessPlan } from "@/lib/business-plan";
import {
  isMediaSlotKey,
  resolveMediaSlot,
  toMediaVersion,
  type MediaVersion,
} from "@/lib/nova-media";
import { uploadSitePhoto } from "@/lib/nova-media-storage";

export type HubLoginState = {
  status: "idle" | "error";
  message: string;
};

export type PlaygroundPlanSaveState = {
  status: "idle" | "success" | "error";
  message: string;
  savedAt?: string;
};

export type RelationshipDirectorySaveState = {
  status: "idle" | "success" | "error";
  message: string;
  savedAt?: string;
};

export type BusinessPlanSaveState = {
  status: "idle" | "success" | "error";
  message: string;
  savedAt?: string;
};

function text(formData: FormData, key: string, max: number) {
  return String(formData.get(key) ?? "").trim().slice(0, max);
}

function storageIsReady() {
  if (!isNovaDataConfigured()) {
    throw new Error("NOVA data storage is not configured.");
  }
}

function focalPoint(formData: FormData, key: string, fallback: number) {
  const value = Number(formData.get(key));
  return Number.isFinite(value)
    ? Math.min(100, Math.max(0, Math.round(value)))
    : fallback;
}

function revalidateMediaPages() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/nova-8");
  revalidatePath("/percussion-playground");
  revalidatePath("/impact");
  revalidatePath("/support");
  revalidatePath("/contact");
  revalidatePath("/hub/dashboard");
}

function mediaRedirect(status: "success" | "error", message: string): never {
  const params = new URLSearchParams({ mediaStatus: status, mediaMessage: message });
  redirect(`/hub/dashboard?${params.toString()}#photos`);
}

export async function loginHub(
  _previousState: HubLoginState,
  formData: FormData,
): Promise<HubLoginState> {
  if (!isHubAuthConfigured()) {
    return {
      status: "error",
      message: "The NOVA Hub owner password and session secret are not configured yet.",
    };
  }

  const password = text(formData, "password", 500);
  if (!verifyHubPassword(password)) {
    return { status: "error", message: "That owner password is not correct." };
  }

  await createHubSession();
  redirect("/hub/dashboard");
}

export async function logoutHub() {
  await clearHubSession();
  redirect("/hub");
}

export async function saveSiteContent(formData: FormData) {
  await requireHubSession();
  storageIsReady();
  const { content: currentContent } = await getSiteState();

  const content: SiteContent = {
    announcementEnabled: formData.get("announcementEnabled") === "on",
    announcementText: text(formData, "announcementText", 240),
    homeHeroBody: text(formData, "homeHeroBody", 500),
    missionStatement: text(formData, "missionStatement", 300),
    academyHeadline: text(formData, "academyHeadline", 180),
    academyOverview: text(formData, "academyOverview", 700),
    supportHeadline: text(formData, "supportHeadline", 180),
    supportOverview: text(formData, "supportOverview", 700),
    contactHeadline: text(formData, "contactHeadline", 180),
    contactIntro: text(formData, "contactIntro", 700),
    media: currentContent.media,
    playgroundPlan: currentContent.playgroundPlan,
    relationshipDirectory: currentContent.relationshipDirectory,
    businessPlan: currentContent.businessPlan,
  };

  if (
    content.homeHeroBody.length < 20 ||
    content.missionStatement.length < 20 ||
    content.academyOverview.length < 20 ||
    content.supportOverview.length < 20 ||
    content.contactIntro.length < 20
  ) {
    throw new Error("Core public content cannot be left blank.");
  }

  await updateSiteContent(content);
  revalidatePath("/");
  revalidatePath("/nova-8");
  revalidatePath("/support");
  revalidatePath("/contact");
  revalidatePath("/hub/dashboard");
}

export async function saveMediaSlot(formData: FormData) {
  await requireHubSession();
  storageIsReady();

  try {
    const slotKey = text(formData, "slotKey", 80);
    if (!isMediaSlotKey(slotKey)) throw new Error("Invalid site-photo slot.");

    const { content } = await getSiteState();
    const current = resolveMediaSlot(content.media, slotKey);
    const alt = text(formData, "alt", 240);
    if (alt.length < 3) throw new Error("Alternative text is required.");

    const fileValue = formData.get("photo");
    const file = fileValue instanceof File && fileValue.size ? fileValue : null;
    const uploaded = file ? await uploadSitePhoto(slotKey, file) : null;
    const existing = content.media[slotKey];
    const previous = uploaded ? toMediaVersion(current) : existing?.previous;

    const nextMedia = { ...content.media };
    nextMedia[slotKey] = {
      src: uploaded?.publicUrl ?? current.src,
      storagePath: uploaded?.storagePath ?? current.storagePath,
      alt,
      focalX: focalPoint(formData, "focalX", current.focalX),
      focalY: focalPoint(formData, "focalY", current.focalY),
      updatedAt: new Date().toISOString(),
      previous,
    };

    await updateSiteMedia(nextMedia);
    revalidateMediaPages();
  } catch {
    mediaRedirect("error", "The photo slot could not be saved. Check the file and try again.");
  }

  mediaRedirect("success", "The photo slot was saved and published.");
}

export async function restoreMediaSlot(formData: FormData) {
  await requireHubSession();
  storageIsReady();

  const slotKey = text(formData, "slotKey", 80);
  if (!isMediaSlotKey(slotKey)) throw new Error("Invalid site-photo slot.");

  const { content } = await getSiteState();
  const existing = content.media[slotKey];
  if (!existing?.previous) {
    mediaRedirect("error", "No previous photo is available for this placement.");
  }

  const current: MediaVersion = {
    src: existing.src,
    storagePath: existing.storagePath,
    alt: existing.alt,
    focalX: existing.focalX,
    focalY: existing.focalY,
    updatedAt: existing.updatedAt,
  };
  const nextMedia = { ...content.media };
  nextMedia[slotKey] = { ...existing.previous, previous: current };

  await updateSiteMedia(nextMedia);
  revalidateMediaPages();
  mediaRedirect("success", "The previous photo and its settings were restored.");
}

export async function resetMediaSlot(formData: FormData) {
  await requireHubSession();
  storageIsReady();

  const slotKey = text(formData, "slotKey", 80);
  if (!isMediaSlotKey(slotKey)) throw new Error("Invalid site-photo slot.");

  const { content } = await getSiteState();
  const nextMedia = { ...content.media };
  delete nextMedia[slotKey];

  await updateSiteMedia(nextMedia);
  revalidateMediaPages();
  mediaRedirect("success", "The built-in photo was restored for this placement.");
}

export async function saveProgramDetails(formData: FormData) {
  await requireHubSession();
  storageIsReady();

  const program: ProgramDetails = {
    statusLabel: text(formData, "statusLabel", 80),
    statusMessage: text(formData, "statusMessage", 600),
    seasonDates: text(formData, "seasonDates", 160),
    location: text(formData, "location", 160),
    participationCost: text(formData, "participationCost", 160),
    eligibility: text(formData, "eligibility", 500),
    interestOpen: formData.get("interestOpen") === "on",
  };

  if (program.statusLabel.length < 2 || program.statusMessage.length < 10) {
    throw new Error("Program status and its public explanation are required.");
  }

  await updateProgramDetails(program);
  revalidatePath("/");
  revalidatePath("/nova-8");
  revalidatePath("/hub/dashboard");
}

export async function saveInquiryReview(formData: FormData) {
  await requireHubSession();
  storageIsReady();

  const id = text(formData, "id", 80);
  const status = text(formData, "status", 40) as InquiryStatus;
  const internalNotes = text(formData, "internalNotes", 2000);

  if (
    !/^[0-9a-f-]{36}$/i.test(id) ||
    !inquiryStatuses.includes(status)
  ) {
    throw new Error("Invalid inquiry update.");
  }

  await updateInquiry(id, status, internalNotes);
  revalidatePath("/hub/dashboard");
}

export async function deleteInquiryRecord(formData: FormData) {
  await requireHubSession();
  storageIsReady();

  const id = text(formData, "id", 80);
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    throw new Error("Invalid inquiry deletion.");
  }

  await deleteInquiry(id);
  revalidatePath("/hub/dashboard");
}

export async function savePlaygroundPlan(
  _previousState: PlaygroundPlanSaveState,
  formData: FormData,
): Promise<PlaygroundPlanSaveState> {
  await requireHubSession();

  if (!isNovaDataConfigured()) {
    return {
      status: "error",
      message: "Connect the NOVA data service before saving the event plan.",
    };
  }

  const payload = String(formData.get("plan") ?? "");
  if (!payload || payload.length > 1_000_000) {
    return { status: "error", message: "The event plan could not be saved." };
  }

  try {
    const plan = normalizePlaygroundPlan(JSON.parse(payload));
    const savedAt = new Date().toISOString();
    await updatePlaygroundPlan({ ...plan, updatedAt: savedAt });
    revalidatePath("/hub/playground");
    revalidatePath("/hub/dashboard");
    return {
      status: "success",
      message: "Event plan saved.",
      savedAt,
    };
  } catch {
    return {
      status: "error",
      message: "The event plan could not be saved. Review the entries and try again.",
    };
  }
}

export async function saveRelationshipDirectory(
  _previousState: RelationshipDirectorySaveState,
  formData: FormData,
): Promise<RelationshipDirectorySaveState> {
  await requireHubSession();

  if (!isNovaDataConfigured()) {
    return {
      status: "error",
      message: "Connect the NOVA data service before saving relationships.",
    };
  }

  const payload = String(formData.get("directory") ?? "");
  if (!payload || payload.length > 1_000_000) {
    return {
      status: "error",
      message: "The relationship directory could not be saved.",
    };
  }

  try {
    const directory = normalizeRelationshipDirectory(JSON.parse(payload));
    if (directory.contacts.some((contact) => contact.name.length < 2)) {
      return {
        status: "error",
        message: "Every relationship needs a name before the directory can be saved.",
      };
    }

    const savedAt = new Date().toISOString();
    await updateRelationshipDirectory({ ...directory, updatedAt: savedAt });
    revalidatePath("/hub/relationships");
    revalidatePath("/hub/dashboard");
    return {
      status: "success",
      message: "Relationship directory saved.",
      savedAt,
    };
  } catch {
    return {
      status: "error",
      message: "The relationship directory could not be saved. Review the entries and try again.",
    };
  }
}

export async function saveBusinessPlan(
  _previousState: BusinessPlanSaveState,
  formData: FormData,
): Promise<BusinessPlanSaveState> {
  await requireHubSession();

  if (!isNovaDataConfigured()) {
    return {
      status: "error",
      message: "Connect the NOVA data service before saving the business plan.",
    };
  }

  const payload = String(formData.get("businessPlan") ?? "");
  if (!payload || payload.length > 500_000) {
    return { status: "error", message: "The business plan could not be saved." };
  }

  try {
    const plan = normalizeBusinessPlanSettings(JSON.parse(payload));
    const blockers = reviewBusinessPlan(plan).filter((issue) => issue.level === "blocker");
    if (blockers.length) {
      return {
        status: "error",
        message: blockers[0].message,
      };
    }

    const savedAt = new Date().toISOString();
    await updateBusinessPlan({ ...plan, updatedAt: savedAt });
    revalidatePath("/hub/business-plan");
    revalidatePath("/hub/dashboard");
    return {
      status: "success",
      message: "Business-plan settings saved.",
      savedAt,
    };
  } catch {
    return {
      status: "error",
      message: "The business plan could not be saved. Review the entries and try again.",
    };
  }
}
