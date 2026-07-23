export const directorSurveyQuestionKeys = [
  "name",
  "organization",
  "role",
  "students",
  "percussionStudentCount",
  "needs",
  "opportunities",
  "timing",
  "involvement",
  "rehearsalSpace",
  "followUp",
  "additionalNotes",
] as const;

export type DirectorSurveyQuestionKey =
  (typeof directorSurveyQuestionKeys)[number];

export type DirectorSurveyConfig = {
  questions: Record<DirectorSurveyQuestionKey, string>;
  roles: string[];
  studentGroups: string[];
  percussionStudentCounts: string[];
  programNeeds: string[];
  novaOpportunities: string[];
  supportTimings: string[];
  involvementOptions: string[];
  rehearsalSpaceOptions: string[];
  followUpOptions: string[];
};

export const defaultDirectorSurveyConfig: DirectorSurveyConfig = {
  questions: {
    name: "Your name",
    organization: "School or organization",
    role: "Your role",
    students: "Which students or ensembles do you currently serve?",
    percussionStudentCount:
      "Approximately how many percussion students are in your program?",
    needs: "What are your program’s greatest current needs?",
    opportunities: "Which NOVA opportunities might interest your program?",
    timing: "When would support be most useful?",
    involvement:
      "Would you like to learn about ways to get involved in the project?",
    rehearsalSpace:
      "Might your school or organization be able to provide rehearsal space for a NOVA activity?",
    followUp: "What is the best way for NOVA to follow up?",
    additionalNotes:
      "Is there anything else we should know about your students, program, or goals?",
  },
  roles: [
    "Band director",
    "Assistant band director",
    "Percussion director or instructor",
    "Private instructor",
    "Program administrator",
    "Other",
  ],
  studentGroups: [
    "Elementary",
    "Middle school",
    "High school",
    "College",
    "Independent or community ensemble",
    "Private students",
    "Other",
  ],
  percussionStudentCounts: [
    "1–10",
    "11–25",
    "26–50",
    "More than 50",
    "Not sure",
  ],
  programNeeds: [
    "Beginning percussion instruction",
    "Marching percussion instruction",
    "Concert percussion instruction",
    "Drum set instruction",
    "Audition or competition preparation",
    "Private or small-group lessons",
    "Supplemental instructors or clinicians",
    "Student recruitment or retention",
    "Curriculum or instructional resources",
    "Instrument or equipment guidance",
    "Professional development for staff",
    "Summer or after-school opportunities",
    "Other",
  ],
  novaOpportunities: [
    "On-site clinic or workshop",
    "Recurring instruction",
    "Private or small-group lessons",
    "Student masterclass",
    "Audition or competition preparation",
    "Summer program or camp",
    "Director or instructor professional development",
    "Custom partnership",
    "I’m interested but need more information",
    "None at this time",
  ],
  supportTimings: [
    "As soon as possible",
    "During the current semester",
    "Next semester",
    "Summer",
    "Next school year",
    "Just exploring options",
  ],
  involvementOptions: [
    "Hosting a NOVA activity",
    "Teaching, coaching, or serving as a clinician",
    "Volunteering",
    "Referring students or other educators",
    "Exploring a school or organizational partnership",
    "Yes, but I’m not sure how",
    "Not at this time",
  ],
  rehearsalSpaceOptions: [
    "Yes",
    "Possibly, depending on dates and requirements",
    "No",
    "I’m not sure, but I can connect you with the appropriate person",
  ],
  followUpOptions: [
    "Email",
    "Text message",
    "Send program information only",
    "Contact me later in the school year",
    "No follow-up needed",
  ],
};

function cleanText(value: unknown, fallback: string, max = 240) {
  return typeof value === "string" && value.trim()
    ? value.trim().slice(0, max)
    : fallback;
}

function cleanList(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return [...fallback];
  const entries = Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim().slice(0, 160))
        .filter(Boolean),
    ),
  ).slice(0, 24);
  return entries.length >= 2 ? entries : [...fallback];
}

export function normalizeDirectorSurveyConfig(
  value: unknown,
): DirectorSurveyConfig {
  const input =
    value && typeof value === "object"
      ? (value as Partial<DirectorSurveyConfig>)
      : {};
  const inputQuestions =
    input.questions && typeof input.questions === "object"
      ? input.questions
      : ({} as Partial<Record<DirectorSurveyQuestionKey, string>>);
  const questions = Object.fromEntries(
    directorSurveyQuestionKeys.map((key) => [
      key,
      cleanText(
        inputQuestions[key],
        defaultDirectorSurveyConfig.questions[key],
      ),
    ]),
  ) as Record<DirectorSurveyQuestionKey, string>;

  return {
    questions,
    roles: cleanList(input.roles, defaultDirectorSurveyConfig.roles),
    studentGroups: cleanList(
      input.studentGroups,
      defaultDirectorSurveyConfig.studentGroups,
    ),
    percussionStudentCounts: cleanList(
      input.percussionStudentCounts,
      defaultDirectorSurveyConfig.percussionStudentCounts,
    ),
    programNeeds: cleanList(
      input.programNeeds,
      defaultDirectorSurveyConfig.programNeeds,
    ),
    novaOpportunities: cleanList(
      input.novaOpportunities,
      defaultDirectorSurveyConfig.novaOpportunities,
    ),
    supportTimings: cleanList(
      input.supportTimings,
      defaultDirectorSurveyConfig.supportTimings,
    ),
    involvementOptions: cleanList(
      input.involvementOptions,
      defaultDirectorSurveyConfig.involvementOptions,
    ),
    rehearsalSpaceOptions: cleanList(
      input.rehearsalSpaceOptions,
      defaultDirectorSurveyConfig.rehearsalSpaceOptions,
    ),
    followUpOptions: cleanList(
      input.followUpOptions,
      defaultDirectorSurveyConfig.followUpOptions,
    ),
  };
}
