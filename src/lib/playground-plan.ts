export const planningStatuses = [
  "not_started",
  "in_progress",
  "waiting",
  "complete",
] as const;

export const guestCategories = [
  "Founding-circle prospect",
  "Arts and culture patron",
  "Education or youth advocate",
  "Civic or business connector",
  "Creative amplifier",
  "Marching-arts ally",
  "Other",
] as const;

export const rsvpStatuses = [
  "Not invited",
  "Invited",
  "Accepted",
  "Maybe",
  "Declined",
  "Waitlist",
] as const;

export const attendanceStatuses = [
  "Unknown",
  "Attended",
  "No-show",
] as const;

export const followUpCategories = [
  "Unassigned",
  "Ready",
  "Connector",
  "Interested",
  "Amplifier",
  "General guest",
] as const;

export type PlanningStatus = (typeof planningStatuses)[number];
export type GuestCategory = (typeof guestCategories)[number];
export type RsvpStatus = (typeof rsvpStatuses)[number];
export type AttendanceStatus = (typeof attendanceStatuses)[number];
export type FollowUpCategory = (typeof followUpCategories)[number];

export type PlaygroundTimelineTask = {
  id: string;
  title: string;
  category: string;
  offsetDays: number;
  owner: string;
  status: PlanningStatus;
  priority: "standard" | "high";
  notes: string;
};

export type PlaygroundGuest = {
  id: string;
  name: string;
  household: string;
  organization: string;
  email: string;
  phone: string;
  category: GuestCategory;
  invitingHost: string;
  relationshipOwner: string;
  affinity: string;
  capacity: string;
  influence: string;
  rsvp: RsvpStatus;
  attendance: AttendanceStatus;
  peopleToMeet: string;
  conversationNotes: string;
  followUpCategory: FollowUpCategory;
  nextStep: string;
  followUpOwner: string;
  followUpDate: string;
  outcome: string;
};

export type PlaygroundHost = {
  id: string;
  name: string;
  contact: string;
  status: PlanningStatus;
  targetInvites: number;
  introductionsPromised: number;
  relationshipOwner: string;
  notes: string;
};

export type PlaygroundWorkstream = {
  id: string;
  area: string;
  deliverable: string;
  owner: string;
  status: PlanningStatus;
  offsetDays: number;
  notes: string;
};

export type PlaygroundRunItem = {
  id: string;
  startMinute: number;
  durationMinutes: number;
  segment: string;
  owner: string;
  cue: string;
  notes: string;
};

export type PlaygroundBudgetItem = {
  id: string;
  category: string;
  item: string;
  vendor: string;
  status: PlanningStatus;
  estimate: number;
  actual: number;
  paid: boolean;
  notes: string;
};

export type PlaygroundSupportOpportunity = {
  id: string;
  title: string;
  amount: string;
  description: string;
  status: PlanningStatus;
};

export type PlaygroundPlan = {
  version: 1;
  event: {
    eventDate: string;
    startTime: string;
    workingMonth: string;
    venue: string;
    venueAddress: string;
    capacity: number;
    attendanceGoal: number;
    eventStatus: "Concept" | "Planning" | "Date selected" | "Confirmed" | "Complete";
    objective: string;
    promise: string;
    attire: string;
    parking: string;
    accessibility: string;
  };
  timeline: PlaygroundTimelineTask[];
  guests: PlaygroundGuest[];
  hosts: PlaygroundHost[];
  workstreams: PlaygroundWorkstream[];
  runOfShow: PlaygroundRunItem[];
  budget: PlaygroundBudgetItem[];
  supportOpportunities: PlaygroundSupportOpportunity[];
  notes: string;
  updatedAt: string;
};

const task = (
  id: string,
  title: string,
  category: string,
  offsetDays: number,
  priority: "standard" | "high" = "standard",
): PlaygroundTimelineTask => ({
  id,
  title,
  category,
  offsetDays,
  owner: "",
  status: "not_started",
  priority,
  notes: "",
});

const workstream = (
  id: string,
  area: string,
  deliverable: string,
  offsetDays: number,
): PlaygroundWorkstream => ({
  id,
  area,
  deliverable,
  owner: "",
  status: "not_started",
  offsetDays,
  notes: "",
});

export const defaultPlaygroundPlan: PlaygroundPlan = {
  version: 1,
  event: {
    eventDate: "",
    startTime: "18:30",
    workingMonth: "",
    venue: "",
    venueAddress: "",
    capacity: 70,
    attendanceGoal: 55,
    eventStatus: "Concept",
    objective:
      "Build a qualified circle of prospective supporters, advocates, hosts, and connectors for NOVA Performing Arts.",
    promise:
      "Hear it up close. Step inside the ensemble. Help create what comes next.",
    attire: "Austin evening casual",
    parking: "",
    accessibility: "",
  },
  timeline: [
    task("tl-01", "Confirm event objective, capacity, and ideal guest mix", "Strategy", -84, "high"),
    task("tl-02", "Define venue profile and begin venue outreach", "Venue & production", -84, "high"),
    task("tl-03", "Recruit the first two anchor hosts", "Hosts & guests", -84, "high"),
    task("tl-04", "Build the first 40-person priority prospect list", "Hosts & guests", -77, "high"),
    task("tl-05", "Complete the 6 to 10 person host circle", "Hosts & guests", -70, "high"),
    task("tl-06", "Confirm venue, insurance requirements, and sound limits", "Venue & production", -70, "high"),
    task("tl-07", "Finalize event identity and invitation language", "Creative & invitation", -63),
    task("tl-08", "Complete landing page, invitation, and teaser assets", "Creative & invitation", -56, "high"),
    task("tl-09", "Begin personal conversations with top prospects", "Hosts & guests", -56, "high"),
    task("tl-10", "Send first invitation wave", "Hosts & guests", -49, "high"),
    task("tl-11", "Book catering, beverage, lighting, and AV partners", "Hospitality & safety", -49),
    task("tl-12", "Confirm ensemble, instructors, and rehearsal schedule", "Program", -42, "high"),
    task("tl-13", "Review first-wave response and room composition", "Hosts & guests", -39),
    task("tl-14", "Personally follow up with first-wave non-responders", "Hosts & guests", -35),
    task("tl-15", "Send a curated second invitation wave", "Hosts & guests", -32),
    task("tl-16", "Confirm photography, video, and media permissions", "Creative & invitation", -28),
    task("tl-17", "Draft remarks, instructor explanation, and support framing", "Program", -24, "high"),
    task("tl-18", "Fill gaps in guest mix", "Hosts & guests", -21),
    task("tl-19", "Send visual reminder to confirmed and invited guests", "Creative & invitation", -14),
    task("tl-20", "Complete production plan and full run-through", "Venue & production", -10, "high"),
    task("tl-21", "Confirm high-priority guests personally", "Hosts & guests", -7, "high"),
    task("tl-22", "Prepare guest briefing with photos, interests, and introductions", "Hosts & guests", -5, "high"),
    task("tl-23", "Assign every priority guest a welcome contact", "Hosts & guests", -3),
    task("tl-24", "Final venue, hospitality, safety, and accessibility check", "Hospitality & safety", -1, "high"),
    task("tl-25", "Execute Percussion Playground", "Event day", 0, "high"),
    task("tl-26", "Send personal thank-you with selected photographs", "Follow-up", 1, "high"),
    task("tl-27", "Record conversation notes and classify priority guests", "Follow-up", 1, "high"),
    task("tl-28", "Contact Ready, Connector, and Interested guests", "Follow-up", 4, "high"),
    task("tl-29", "Ask hosts to make promised introductions", "Follow-up", 5),
    task("tl-30", "Hold founding-supporter meetings and tailored briefings", "Follow-up", 14, "high"),
    task("tl-31", "Review outcomes, costs, and next-event recommendations", "Follow-up", 21),
  ],
  guests: [],
  hosts: [],
  workstreams: [
    workstream("ws-01", "Venue", "Accessible venue with parking, projection, acoustic control, and distinct performer space", -70),
    workstream("ws-02", "Production", "Projection screen, ambient lighting, power, sound plan, and equipment layout", -28),
    workstream("ws-03", "Hospitality", "Licensed beverage service, cocktails, nonalcoholic options, finger food, and service plan", -35),
    workstream("ws-04", "Safety", "Insurance, alcohol controls, minor separation, hearing protection, and emergency plan", -21),
    workstream("ws-05", "Creative", "Private landing page, digital invitation, teaser, still images, and host briefing", -56),
    workstream("ws-06", "Program", "Ensemble demonstration, guided stations, remarks, student story, and rehearsal plan", -24),
    workstream("ws-07", "Guest experience", "Arrival, name recognition, targeted introductions, signage, attire, parking, and accessibility", -10),
    workstream("ws-08", "Documentation", "Guest-respectful photography, recap video, releases, and approved follow-up assets", -14),
  ],
  runOfShow: [
    { id: "run-01", startMinute: 0, durationMinutes: 20, segment: "Arrival", owner: "", cue: "Cocktails, small bites, ambient sound, projected rehearsal film", notes: "Hosts welcome invitees and make targeted introductions." },
    { id: "run-02", startMinute: 20, durationMinutes: 3, segment: "Welcome", owner: "", cue: "Brief NOVA welcome", notes: "Keep the first remarks restrained." },
    { id: "run-03", startMinute: 23, durationMinutes: 5, segment: "Opening encounter", owner: "", cue: "Sudden, tightly rehearsed full-ensemble demonstration", notes: "Create impact before explanation." },
    { id: "run-04", startMinute: 28, durationMinutes: 15, segment: "Inside the ensemble", owner: "", cue: "Battery and front ensemble demonstration with short video moments", notes: "Explain precision, listening, movement, and trust in accessible language." },
    { id: "run-05", startMinute: 43, durationMinutes: 25, segment: "The playground", owner: "", cue: "Guided instrument stations and collective count-off", notes: "Make participation effortless and dignified." },
    { id: "run-06", startMinute: 68, durationMinutes: 7, segment: "The reason", owner: "", cue: "Student-centered story and concise operating-support case", notes: "No public ask, pledge card, auction, or donation thermometer." },
    { id: "run-07", startMinute: 75, durationMinutes: 15, segment: "Social close", owner: "", cue: "Return to cocktails and conversation", notes: "Make priority introductions and quietly schedule follow-up." },
  ],
  budget: [
    { id: "bd-01", category: "Venue", item: "Venue rental", vendor: "", status: "not_started", estimate: 0, actual: 0, paid: false, notes: "" },
    { id: "bd-02", category: "Hospitality", item: "Catering and service", vendor: "", status: "not_started", estimate: 0, actual: 0, paid: false, notes: "" },
    { id: "bd-03", category: "Hospitality", item: "Licensed beverage service", vendor: "", status: "not_started", estimate: 0, actual: 0, paid: false, notes: "" },
    { id: "bd-04", category: "Production", item: "Lighting, projection, and AV", vendor: "", status: "not_started", estimate: 0, actual: 0, paid: false, notes: "" },
    { id: "bd-05", category: "Program", item: "Musicians, instructors, and rehearsal", vendor: "", status: "not_started", estimate: 0, actual: 0, paid: false, notes: "" },
    { id: "bd-06", category: "Documentation", item: "Photography and recap video", vendor: "", status: "not_started", estimate: 0, actual: 0, paid: false, notes: "" },
    { id: "bd-07", category: "Operations", item: "Insurance, permits, staffing, and hearing protection", vendor: "", status: "not_started", estimate: 0, actual: 0, paid: false, notes: "" },
    { id: "bd-08", category: "Guest experience", item: "Parking, valet, signage, and printed materials", vendor: "", status: "not_started", estimate: 0, actual: 0, paid: false, notes: "" },
  ],
  supportOpportunities: [
    { id: "sp-01", title: "Exceptional instruction", amount: "", description: "Underwrite instructors for a defined period of NOVA 8 training.", status: "not_started" },
    { id: "sp-02", title: "A consistent place to rehearse", amount: "", description: "Secure reliable rehearsal space where the full ensemble can work safely.", status: "not_started" },
    { id: "sp-03", title: "Student access and operations", amount: "", description: "Support program leadership, safe operations, and sustained access for young musicians.", status: "not_started" },
  ],
  notes: "",
  updatedAt: "",
};

const strings = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T =>
  typeof value === "string" && allowed.includes(value as T) ? (value as T) : fallback;

const clean = (value: unknown, max = 2000) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const number = (value: unknown, min: number, max: number, fallback = 0) => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
};

const id = (value: unknown, fallback: string) => {
  const cleaned = clean(value, 80);
  return /^[a-zA-Z0-9_-]+$/.test(cleaned) ? cleaned : fallback;
};

export function normalizePlaygroundPlan(value: unknown): PlaygroundPlan {
  if (!value || typeof value !== "object") return structuredClone(defaultPlaygroundPlan);
  const input = value as Partial<PlaygroundPlan>;
  const event = input.event && typeof input.event === "object" ? input.event : {} as Partial<PlaygroundPlan["event"]>;
  const statuses = planningStatuses;

  return {
    version: 1,
    event: {
      eventDate: /^\d{4}-\d{2}-\d{2}$/.test(clean(event.eventDate, 10)) ? clean(event.eventDate, 10) : "",
      startTime: /^\d{2}:\d{2}$/.test(clean(event.startTime, 5)) ? clean(event.startTime, 5) : "18:30",
      workingMonth: clean(event.workingMonth, 80),
      venue: clean(event.venue, 180),
      venueAddress: clean(event.venueAddress, 240),
      capacity: Math.round(number(event.capacity, 1, 1000, 70)),
      attendanceGoal: Math.round(number(event.attendanceGoal, 1, 1000, 55)),
      eventStatus: strings(event.eventStatus, ["Concept", "Planning", "Date selected", "Confirmed", "Complete"] as const, "Concept"),
      objective: clean(event.objective, 1000) || defaultPlaygroundPlan.event.objective,
      promise: clean(event.promise, 500) || defaultPlaygroundPlan.event.promise,
      attire: clean(event.attire, 120),
      parking: clean(event.parking, 500),
      accessibility: clean(event.accessibility, 500),
    },
    timeline: (Array.isArray(input.timeline) ? input.timeline : defaultPlaygroundPlan.timeline).slice(0, 250).map((item, index) => ({
      id: id(item?.id, `timeline-${index}`),
      title: clean(item?.title, 240),
      category: clean(item?.category, 100) || "General",
      offsetDays: Math.round(number(item?.offsetDays, -730, 730)),
      owner: clean(item?.owner, 120),
      status: strings(item?.status, statuses, "not_started"),
      priority: strings(item?.priority, ["standard", "high"] as const, "standard"),
      notes: clean(item?.notes, 1000),
    })),
    guests: (Array.isArray(input.guests) ? input.guests : []).slice(0, 1000).map((item, index) => ({
      id: id(item?.id, `guest-${index}`),
      name: clean(item?.name, 160),
      household: clean(item?.household, 160),
      organization: clean(item?.organization, 180),
      email: clean(item?.email, 254),
      phone: clean(item?.phone, 50),
      category: strings(item?.category, guestCategories, "Other"),
      invitingHost: clean(item?.invitingHost, 160),
      relationshipOwner: clean(item?.relationshipOwner, 160),
      affinity: clean(item?.affinity, 500),
      capacity: clean(item?.capacity, 120),
      influence: clean(item?.influence, 120),
      rsvp: strings(item?.rsvp, rsvpStatuses, "Not invited"),
      attendance: strings(item?.attendance, attendanceStatuses, "Unknown"),
      peopleToMeet: clean(item?.peopleToMeet, 500),
      conversationNotes: clean(item?.conversationNotes, 2000),
      followUpCategory: strings(item?.followUpCategory, followUpCategories, "Unassigned"),
      nextStep: clean(item?.nextStep, 1000),
      followUpOwner: clean(item?.followUpOwner, 160),
      followUpDate: /^\d{4}-\d{2}-\d{2}$/.test(clean(item?.followUpDate, 10)) ? clean(item?.followUpDate, 10) : "",
      outcome: clean(item?.outcome, 1000),
    })),
    hosts: (Array.isArray(input.hosts) ? input.hosts : []).slice(0, 100).map((item, index) => ({
      id: id(item?.id, `host-${index}`),
      name: clean(item?.name, 160),
      contact: clean(item?.contact, 254),
      status: strings(item?.status, statuses, "not_started"),
      targetInvites: Math.round(number(item?.targetInvites, 0, 100, 10)),
      introductionsPromised: Math.round(number(item?.introductionsPromised, 0, 100, 3)),
      relationshipOwner: clean(item?.relationshipOwner, 160),
      notes: clean(item?.notes, 1000),
    })),
    workstreams: (Array.isArray(input.workstreams) ? input.workstreams : defaultPlaygroundPlan.workstreams).slice(0, 150).map((item, index) => ({
      id: id(item?.id, `workstream-${index}`),
      area: clean(item?.area, 100),
      deliverable: clean(item?.deliverable, 500),
      owner: clean(item?.owner, 160),
      status: strings(item?.status, statuses, "not_started"),
      offsetDays: Math.round(number(item?.offsetDays, -730, 730)),
      notes: clean(item?.notes, 1000),
    })),
    runOfShow: (Array.isArray(input.runOfShow) ? input.runOfShow : defaultPlaygroundPlan.runOfShow).slice(0, 100).map((item, index) => ({
      id: id(item?.id, `run-${index}`),
      startMinute: Math.round(number(item?.startMinute, 0, 1440)),
      durationMinutes: Math.round(number(item?.durationMinutes, 1, 1440, 5)),
      segment: clean(item?.segment, 180),
      owner: clean(item?.owner, 160),
      cue: clean(item?.cue, 500),
      notes: clean(item?.notes, 1000),
    })),
    budget: (Array.isArray(input.budget) ? input.budget : defaultPlaygroundPlan.budget).slice(0, 200).map((item, index) => ({
      id: id(item?.id, `budget-${index}`),
      category: clean(item?.category, 100),
      item: clean(item?.item, 180),
      vendor: clean(item?.vendor, 180),
      status: strings(item?.status, statuses, "not_started"),
      estimate: number(item?.estimate, 0, 10000000),
      actual: number(item?.actual, 0, 10000000),
      paid: Boolean(item?.paid),
      notes: clean(item?.notes, 1000),
    })),
    supportOpportunities: (Array.isArray(input.supportOpportunities) ? input.supportOpportunities : defaultPlaygroundPlan.supportOpportunities).slice(0, 50).map((item, index) => ({
      id: id(item?.id, `support-${index}`),
      title: clean(item?.title, 180),
      amount: clean(item?.amount, 120),
      description: clean(item?.description, 1000),
      status: strings(item?.status, statuses, "not_started"),
    })),
    notes: clean(input.notes, 12000),
    updatedAt: clean(input.updatedAt, 40),
  };
}

export function dateForOffset(eventDate: string, offsetDays: number) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) return "";
  const [year, month, day] = eventDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

export function relativeLabel(offsetDays: number) {
  if (offsetDays === 0) return "Event day";
  const direction = offsetDays < 0 ? "before" : "after";
  const absolute = Math.abs(offsetDays);
  if (absolute % 7 === 0) {
    const weeks = absolute / 7;
    return `${weeks} week${weeks === 1 ? "" : "s"} ${direction}`;
  }
  return `${absolute} day${absolute === 1 ? "" : "s"} ${direction}`;
}
