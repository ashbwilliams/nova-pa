import JSZip from "jszip";
import { buildBusinessPlanZip } from "@/lib/business-plan-export";
import { buildFundraisingPackageHtml } from "@/lib/fundraising-package-export";
import { hasHubSession } from "@/lib/hub-auth";
import { getDocumentVersionHistory } from "@/lib/nova-data";
import { findDocumentVersion } from "@/lib/document-versioning";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const previewPolicy = "default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'none'; font-src data:;";

export async function GET(_request: Request, context: RouteContext<"/hub/versions/[id]/preview">) {
  if (!(await hasHubSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const version = findDocumentVersion(await getDocumentVersionHistory(), id);
  if (!version) return Response.json({ error: "Version not found" }, { status: 404 });

  let html: string;
  if (version.documentType === "fundraising_package") {
    html = version.artifact
      ? Buffer.from(version.artifact.dataBase64, "base64").toString("utf8")
      : await buildFundraisingPackageHtml(version.snapshot);
  } else {
    const archive = version.artifact
      ? Buffer.from(version.artifact.dataBase64, "base64")
      : await buildBusinessPlanZip(version.snapshot);
    const zip = await JSZip.loadAsync(archive);
    const root = "NOVA_8_Offline_Business_Plan/";
    const page = zip.file(`${root}complete-business-plan.html`) ?? zip.file("complete-business-plan.html");
    const style = zip.file(`${root}assets/style.css`) ?? zip.file("assets/style.css");
    const app = zip.file(`${root}assets/app.js`) ?? zip.file("assets/app.js");
    const search = zip.file(`${root}assets/search-index.js`) ?? zip.file("assets/search-index.js");
    const mark = zip.file(`${root}assets/nova-mark.png`) ?? zip.file("assets/nova-mark.png");
    if (!page || !style || !app || !search || !mark) {
      return Response.json({ error: "Preview unavailable" }, { status: 500 });
    }
    const [pageHtml, css, appJs, searchJs, markBase64] = await Promise.all([
      page.async("string"),
      style.async("string"),
      app.async("string"),
      search.async("string"),
      mark.async("base64"),
    ]);
    html = pageHtml
      .replace('<link rel="stylesheet" href="assets/style.css">', `<style>${css}</style>`)
      .replace('<script src="assets/search-index.js"></script>', `<script>${searchJs}</script>`)
      .replace('<script src="assets/app.js"></script>', `<script>${appJs}</script>`)
      .replaceAll('src="assets/nova-mark.png"', `src="data:image/png;base64,${markBase64}"`)
      .replace('href="assets/nova-mark.png"', `href="data:image/png;base64,${markBase64}"`)
      .replace(/href="(?!#)[^"]+\.(?:html|txt|md)(?:#[^"]*)?"/g, 'href="#"');
  }

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": "inline",
      "Content-Length": String(Buffer.byteLength(html, "utf8")),
      "Cache-Control": "private, no-store",
      "Content-Security-Policy": previewPolicy,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
