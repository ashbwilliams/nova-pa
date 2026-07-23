import type { Metadata } from "next";
import { ResourceBriefPage } from "@/components/resource-brief-page";
import { getResourceBrief } from "@/lib/resource-content";

const resource = getResourceBrief("what-is-marching-percussion");

export const metadata: Metadata = {
  title: resource.title,
  description: resource.summary,
};

export default function WhatIsMarchingPercussionPage() {
  return <ResourceBriefPage resource={resource} />;
}

