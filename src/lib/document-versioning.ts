import "server-only";

import { createHash, randomUUID } from "node:crypto";
import type { BusinessPlanSettings } from "@/lib/business-plan";
import type { FundraisingPackageSettings } from "@/lib/fundraising-package";

export const documentVersionStatuses = ["saved", "finalized"] as const;

export type DocumentVersionStatus = (typeof documentVersionStatuses)[number];
export type VersionedDocumentType = "business_plan" | "fundraising_package";

export type VersionArtifact = {
  fileName: string;
  mimeType: string;
  byteLength: number;
  sha256: string;
  dataBase64: string;
};

type DocumentVersionBase = {
  id: string;
  title: string;
  versionDate: string;
  status: DocumentVersionStatus;
  notes: string;
  creator: string;
  createdAt: string;
  recipient: string;
  artifact?: VersionArtifact;
};

export type BusinessPlanVersion = DocumentVersionBase & {
  documentType: "business_plan";
  snapshot: BusinessPlanSettings;
};

export type FundraisingPackageVersion = DocumentVersionBase & {
  documentType: "fundraising_package";
  snapshot: FundraisingPackageSettings;
};

export type DocumentVersion = BusinessPlanVersion | FundraisingPackageVersion;

export type DocumentVersionHistory = {
  businessPlan: BusinessPlanVersion[];
  fundraisingPackage: FundraisingPackageVersion[];
  updatedAt: string;
};

export const emptyDocumentVersionHistory: DocumentVersionHistory = {
  businessPlan: [],
  fundraisingPackage: [],
  updatedAt: "",
};

function textValue(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function normalizeArtifact(value: unknown): VersionArtifact | undefined {
  if (!value || typeof value !== "object") return undefined;
  const artifact = value as Partial<VersionArtifact>;
  const fileName = textValue(artifact.fileName, 240);
  const mimeType = textValue(artifact.mimeType, 120);
  const dataBase64 = typeof artifact.dataBase64 === "string" ? artifact.dataBase64 : "";
  const byteLength = Number(artifact.byteLength);
  const sha256 = textValue(artifact.sha256, 64);
  if (!fileName || !mimeType || !dataBase64 || !Number.isFinite(byteLength) || !/^[a-f0-9]{64}$/.test(sha256)) {
    return undefined;
  }
  return { fileName, mimeType, dataBase64, byteLength, sha256 };
}

function versionBase(value: Record<string, unknown>) {
  const status = documentVersionStatuses.includes(value.status as DocumentVersionStatus)
    ? value.status as DocumentVersionStatus
    : "saved";
  const createdAt = textValue(value.createdAt, 40);
  const versionDate = textValue(value.versionDate, 10);
  return {
    id: textValue(value.id, 80),
    title: textValue(value.title, 160),
    versionDate: isIsoDate(versionDate) ? versionDate : createdAt.slice(0, 10),
    status,
    notes: textValue(value.notes, 2000),
    creator: textValue(value.creator, 160) || "NOVA Hub owner",
    createdAt,
    recipient: textValue(value.recipient, 160),
    artifact: normalizeArtifact(value.artifact),
  };
}

export function normalizeDocumentVersionHistory(
  value: unknown,
  normalizeBusinessPlan: (value: unknown) => BusinessPlanSettings,
  normalizeFundraisingPackage: (value: unknown) => FundraisingPackageSettings,
): DocumentVersionHistory {
  const input = value && typeof value === "object" ? value as Partial<DocumentVersionHistory> : {};
  const businessPlan = Array.isArray(input.businessPlan)
    ? input.businessPlan.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const raw = item as unknown as Record<string, unknown>;
        const base = versionBase(raw);
        if (!base.id || !base.title || !base.createdAt) return [];
        return [{ ...base, documentType: "business_plan" as const, snapshot: normalizeBusinessPlan(raw.snapshot) }];
      })
    : [];
  const fundraisingPackage = Array.isArray(input.fundraisingPackage)
    ? input.fundraisingPackage.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const raw = item as unknown as Record<string, unknown>;
        const base = versionBase(raw);
        if (!base.id || !base.title || !base.createdAt) return [];
        return [{ ...base, documentType: "fundraising_package" as const, snapshot: normalizeFundraisingPackage(raw.snapshot) }];
      })
    : [];

  return {
    businessPlan: businessPlan.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    fundraisingPackage: fundraisingPackage.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    updatedAt: textValue(input.updatedAt, 40),
  };
}

export function createVersionArtifact(fileName: string, mimeType: string, data: Uint8Array | string): VersionArtifact {
  const buffer = typeof data === "string" ? Buffer.from(data, "utf8") : Buffer.from(data);
  return {
    fileName,
    mimeType,
    byteLength: buffer.byteLength,
    sha256: createHash("sha256").update(buffer).digest("hex"),
    dataBase64: buffer.toString("base64"),
  };
}

export function newVersionId() {
  return randomUUID();
}

export function getVersionCreator() {
  return textValue(process.env.NOVA_HUB_CREATOR_NAME, 160) || "NOVA Hub owner";
}

export function findDocumentVersion(history: DocumentVersionHistory, id: string) {
  return [...history.businessPlan, ...history.fundraisingPackage].find((version) => version.id === id);
}

export function safeVersionFilePart(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 80) || "version";
}
