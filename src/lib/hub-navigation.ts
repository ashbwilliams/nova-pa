export type HubSidebarItem = {
  href: string;
  label: string;
  group?: string;
};

export const hubPrimaryNavigation: HubSidebarItem[] = [
  {
    href: "/hub/dashboard",
    label: "Organization dashboard",
    group: "Overview",
  },
  {
    href: "/hub/survey",
    label: "Educator survey",
    group: "Outreach",
  },
  {
    href: "/hub/relationships",
    label: "Relationship manager",
    group: "Outreach",
  },
  {
    href: "/hub/playground",
    label: "Percussion Playground",
    group: "Planning",
  },
  {
    href: "/hub/business-plan",
    label: "Business plan",
    group: "Planning",
  },
  {
    href: "/hub/fundraising",
    label: "Fundraising package",
    group: "Planning",
  },
];
