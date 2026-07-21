export const relationshipTypes = [
  "Educator",
  "Potential member",
  "Student or family",
  "Vendor",
  "Donor or supporter",
  "Sponsor",
  "School or district",
  "Community partner",
  "Arts and culture contact",
  "Volunteer",
  "Board prospect",
  "Media",
  "Government or civic contact",
  "Other",
] as const;

export const relationshipStatuses = [
  "Researching",
  "Not contacted",
  "Outreach planned",
  "Contacted",
  "Conversation active",
  "Follow-up needed",
  "Active relationship",
  "On hold",
  "Closed",
] as const;

export const relationshipPriorities = ["Low", "Standard", "High"] as const;

export const relationshipStrengths = [
  "New",
  "Acquaintance",
  "Warm",
  "Established",
] as const;

export const preferredContactMethods = [
  "Not specified",
  "Email",
  "Phone",
  "Text",
  "In person",
  "Social media",
] as const;

export type RelationshipType = (typeof relationshipTypes)[number];
export type RelationshipStatus = (typeof relationshipStatuses)[number];
export type RelationshipPriority = (typeof relationshipPriorities)[number];
export type RelationshipStrength = (typeof relationshipStrengths)[number];
export type PreferredContactMethod = (typeof preferredContactMethods)[number];

export type RelationshipRecord = {
  id: string;
  name: string;
  organization: string;
  role: string;
  email: string;
  phone: string;
  type: RelationshipType;
  status: RelationshipStatus;
  priority: RelationshipPriority;
  strength: RelationshipStrength;
  preferredContactMethod: PreferredContactMethod;
  relationshipOwner: string;
  connectionSource: string;
  lastContactDate: string;
  nextFollowUpDate: string;
  nextAction: string;
  actionPending?: boolean;
  tags: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type RelationshipDirectory = {
  contacts: RelationshipRecord[];
  updatedAt: string;
};

export const defaultRelationshipDirectory: RelationshipDirectory = {
  contacts: [],
  updatedAt: "",
};

function stringValue(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function dateValue(value: unknown) {
  const date = stringValue(value, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "";
}

function optionValue<const T extends readonly string[]>(
  value: unknown,
  options: T,
  fallback: T[number],
) {
  return typeof value === "string" && options.includes(value)
    ? (value as T[number])
    : fallback;
}

function normalizeRecord(value: unknown, index: number): RelationshipRecord | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Partial<RelationshipRecord>;
  const id = stringValue(input.id, 100) || `relationship-${index + 1}`;

  return {
    id,
    name: stringValue(input.name, 180),
    organization: stringValue(input.organization, 180),
    role: stringValue(input.role, 160),
    email: stringValue(input.email, 240),
    phone: stringValue(input.phone, 80),
    type: optionValue(input.type, relationshipTypes, "Other"),
    status: optionValue(input.status, relationshipStatuses, "Not contacted"),
    priority: optionValue(input.priority, relationshipPriorities, "Standard"),
    strength: optionValue(input.strength, relationshipStrengths, "New"),
    preferredContactMethod: optionValue(
      input.preferredContactMethod,
      preferredContactMethods,
      "Not specified",
    ),
    relationshipOwner: stringValue(input.relationshipOwner, 120),
    connectionSource: stringValue(input.connectionSource, 240),
    lastContactDate: dateValue(input.lastContactDate),
    nextFollowUpDate: dateValue(input.nextFollowUpDate),
    nextAction: stringValue(input.nextAction, 500),
    actionPending: input.actionPending === true,
    tags: stringValue(input.tags, 500),
    notes: stringValue(input.notes, 5000),
    createdAt: stringValue(input.createdAt, 40),
    updatedAt: stringValue(input.updatedAt, 40),
  };
}

export function normalizeRelationshipDirectory(
  value: unknown,
): RelationshipDirectory {
  if (!value || typeof value !== "object") return defaultRelationshipDirectory;
  const input = value as Partial<RelationshipDirectory>;
  const contacts = Array.isArray(input.contacts)
    ? input.contacts
        .slice(0, 1500)
        .map(normalizeRecord)
        .filter((record): record is RelationshipRecord => Boolean(record))
    : [];
  const seen = new Set<string>();

  return {
    contacts: contacts.filter((record) => {
      if (seen.has(record.id)) return false;
      seen.add(record.id);
      return true;
    }),
    updatedAt: stringValue(input.updatedAt, 40),
  };
}
