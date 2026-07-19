export const inquiryTopics = [
  "Student or family",
  "Donor or sponsor",
  "School or educator",
  "Community partner",
  "Other",
] as const;

export const inquiryStatuses = ["new", "in_progress", "closed"] as const;

export type InquiryTopic = (typeof inquiryTopics)[number];
export type InquiryStatus = (typeof inquiryStatuses)[number];
