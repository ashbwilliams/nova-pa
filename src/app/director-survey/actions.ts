"use server";

import {
  directorRoles,
  followUpOptions,
  involvementOptions,
  novaOpportunities,
  percussionStudentCounts,
  programNeeds,
  rehearsalSpaceOptions,
  studentGroups,
  supportTimings,
} from "@/lib/director-survey";
import { createInquiry } from "@/lib/nova-data";

export type DirectorSurveyState = {
  status: "idle" | "success" | "error";
  message: string;
};

function text(formData: FormData, key: string, max: number) {
  return String(formData.get(key) ?? "").trim().slice(0, max);
}

function selected(
  formData: FormData,
  key: string,
  allowed: readonly string[],
  max = allowed.length,
) {
  return formData
    .getAll(key)
    .map(String)
    .filter((value) => allowed.includes(value))
    .slice(0, max);
}

function line(label: string, value: string | string[]) {
  const answer = Array.isArray(value) ? value.join("; ") : value;
  return `${label}: ${answer || "Not provided"}`;
}

export async function submitDirectorSurvey(
  _previousState: DirectorSurveyState,
  formData: FormData,
): Promise<DirectorSurveyState> {
  if (text(formData, "website", 200)) {
    return {
      status: "success",
      message: "Thank you. Your response has been received.",
    };
  }

  const name = text(formData, "name", 100);
  const organization = text(formData, "organization", 160);
  const roles = selected(formData, "roles", directorRoles);
  const roleOther = text(formData, "roleOther", 160);
  const students = selected(formData, "students", studentGroups);
  const studentOther = text(formData, "studentOther", 160);
  const percussionStudentCount = text(formData, "percussionStudentCount", 40);
  const needs = selected(formData, "needs", programNeeds, 3);
  const needOther = text(formData, "needOther", 160);
  const opportunities = selected(
    formData,
    "opportunities",
    novaOpportunities,
  );
  const timing = text(formData, "timing", 80);
  const involvement = selected(
    formData,
    "involvement",
    involvementOptions,
  );
  const rehearsalSpace = text(formData, "rehearsalSpace", 100);
  const spaceDetails = text(formData, "spaceDetails", 600);
  const followUp = text(formData, "followUp", 80);
  const contact = text(formData, "contact", 160);
  const additionalNotes = text(formData, "additionalNotes", 800);

  if (
    name.length < 2 ||
    !organization ||
    !roles.length ||
    !students.length ||
    !percussionStudentCounts.includes(
      percussionStudentCount as (typeof percussionStudentCounts)[number],
    ) ||
    !needs.length ||
    !opportunities.length ||
    !supportTimings.includes(timing as (typeof supportTimings)[number]) ||
    !involvement.length ||
    !rehearsalSpaceOptions.includes(
      rehearsalSpace as (typeof rehearsalSpaceOptions)[number],
    ) ||
    !followUpOptions.includes(followUp as (typeof followUpOptions)[number]) ||
    (followUp !== "No follow-up needed" && !contact)
  ) {
    return {
      status: "error",
      message:
        "Please complete each required question and choose no more than three program needs.",
    };
  }

  const message = [
    "EDUCATOR SURVEY RESPONSE",
    "",
    line("Role(s)", roles),
    line("Other role", roleOther),
    line("Students or ensembles served", students),
    line("Other student group", studentOther),
    line("Approximate percussion students", percussionStudentCount),
    line("Greatest current needs", needs),
    line("Other need", needOther),
    line("NOVA opportunities of interest", opportunities),
    line("Most useful timing", timing),
    line("Ways they may want to get involved", involvement),
    line("Possibility of providing rehearsal space", rehearsalSpace),
    line("Rehearsal space details", spaceDetails),
    line("Preferred follow-up", followUp),
    line("Preferred contact", contact),
    line("Additional notes", additionalNotes),
  ].join("\n");

  try {
    await createInquiry({
      topic: "School or educator",
      name,
      organization,
      email: contact || "No follow-up requested",
      message,
    });

    return {
      status: "success",
      message:
        "Thank you. Your perspective will help NOVA create more relevant opportunities for students and educators.",
    };
  } catch {
    return {
      status: "error",
      message:
        "We could not save your response. Please try again in a moment.",
    };
  }
}
