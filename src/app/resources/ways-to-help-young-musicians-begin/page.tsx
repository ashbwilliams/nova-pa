import type { Metadata } from "next";
import { ResourceBriefPage } from "@/components/resource-brief-page";
import { getResourceBrief } from "@/lib/resource-content";

const resource = getResourceBrief("ways-to-help-young-musicians-begin");

export const metadata: Metadata = {
  title: resource.title,
  description: resource.summary,
};

export default function WaysToHelpPage() {
  return <ResourceBriefPage resource={resource} />;
}

