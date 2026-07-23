import type { Metadata } from "next";
import { ResourceBriefPage } from "@/components/resource-brief-page";
import { getResourceBrief } from "@/lib/resource-content";

const resource = getResourceBrief("a-students-journey-through-nova-8");

export const metadata: Metadata = {
  title: resource.title,
  description: resource.summary,
};

export default function StudentJourneyPage() {
  return <ResourceBriefPage resource={resource} />;
}

