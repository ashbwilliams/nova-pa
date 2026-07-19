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
  inquiryStatuses,
  isNovaDataConfigured,
  updateInquiry,
  updateProgramDetails,
  updateSiteContent,
  type InquiryStatus,
  type ProgramDetails,
  type SiteContent,
} from "@/lib/nova-data";

export type HubLoginState = {
  status: "idle" | "error";
  message: string;
};

function text(formData: FormData, key: string, max: number) {
  return String(formData.get(key) ?? "").trim().slice(0, max);
}

function storageIsReady() {
  if (!isNovaDataConfigured()) {
    throw new Error("NOVA data storage is not configured.");
  }
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
