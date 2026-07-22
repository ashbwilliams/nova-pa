import { buildBusinessPlanZip } from "@/lib/business-plan-export";
import { buildFundraisingPackageHtml } from "@/lib/fundraising-package-export";
import { hasHubSession } from "@/lib/hub-auth";
import { getDocumentVersionHistory } from "@/lib/nova-data";
import { findDocumentVersion, safeVersionFilePart } from "@/lib/document-versioning";

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
  if (version.artifact) {
    body = Uint8Array.from(Buffer.from(version.artifact.dataBase64, "base64")).buffer;
    contentType = version.artifact.mimeType;
    fileName = version.artifact.fileName;
  } else if (version.documentType === "business_plan") {
    body = Uint8Array.from(await buildBusinessPlanZip(version.snapshot)).buffer;
    contentType = "application/zip";
    fileName = `NOVA_8_Business_Plan_${safeVersionFilePart(version.versionDate)}.zip`;
  } else {
    body = await buildFundraisingPackageHtml(version.snapshot);
    contentType = "text/html; charset=utf-8";
    fileName = `NOVA_8_Fundraising_Package_${safeVersionFilePart(version.versionDate)}.html`;
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
