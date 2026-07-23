import type { Metadata } from "next";
import { ResourceBriefPage } from "@/components/resource-brief-page";
import { getResourceBrief } from "@/lib/resource-content";

const resource = getResourceBrief(
  "what-it-takes-to-put-an-ensemble-on-the-floor",
);

export const metadata: Metadata = {
  title: resource.title,
  description: resource.summary,
};

export default function WhatItTakesPage() {
  return <ResourceBriefPage resource={resource} />;
}

