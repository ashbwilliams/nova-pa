import { buildBusinessPlanZip } from "@/lib/business-plan-export";
import { buildFundraisingPackageHtml } from "@/lib/fundraising-package-export";
import { hasHubSession } from "@/lib/hub-auth";
import { getDocumentVersionHistory } from "@/lib/nova-data";
import {
  findDocumentVersion,
  readVerifiedVersionArtifact,
  safeVersionFilePart,
  VersionArtifactIntegrityError,
} from "@/lib/document-versioning";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: RouteContext<"/hub/versions/[id]/download">) {
  if (!(await hasHubSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const version = findDocumentVersion(await getDocumentVersionHistory(), id);
  if (!version) return Response.json({ error: "Version not found" }, { status: 404 });

  let body: ArrayBuffer | string;
  let contentType: string;
  let fileName: string;
  try {
    if (version.artifact) {
      body = Uint8Array.from(readVerifiedVersionArtifact(version.artifact)).buffer;
      contentType = version.artifact.mimeType;
      fileName = version.artifact.fileName;
    } else if (version.status === "finalized") {
      throw new VersionArtifactIntegrityError("The finalized export is missing from its archive record.");
    } else if (version.documentType === "business_plan") {
      body = Uint8Array.from(await buildBusinessPlanZip(version.snapshot)).buffer;
      contentType = "application/zip";
      fileName = `NOVA_8_Business_Plan_${safeVersionFilePart(version.versionDate)}.zip`;
    } else {
      body = await buildFundraisingPackageHtml(version.snapshot);
      contentType = "text/html; charset=utf-8";
      fileName = `NOVA_8_Fundraising_Package_${safeVersionFilePart(version.versionDate)}.html`;
    }
  } catch (error) {
    if (error instanceof VersionArtifactIntegrityError) {
      return Response.json({ error: error.message }, {
        status: 409,
        headers: { "Cache-Control": "private, no-store" },
      });
    }
    throw error;
  }

  return new Response(body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Length": String(typeof body === "string" ? Buffer.byteLength(body, "utf8") : body.byteLength),
      "Cache-Control": "private, no-store",
    },
  });
}
