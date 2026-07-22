import { buildFundraisingPackageHtml } from "@/lib/fundraising-package-export";
import { reviewFundraisingPackage } from "@/lib/fundraising-package";
import { hasHubSession } from "@/lib/hub-auth";
import { getSiteState } from "@/lib/nova-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await hasHubSession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content } = await getSiteState();
  const blockers = reviewFundraisingPackage(
    content.fundraisingPackage,
    content.businessPlan,
  ).filter((issue) => issue.level === "blocker");

  if (blockers.length) {
    return Response.json(
      {
        error: "Resolve the blocking review items before exporting.",
        issues: blockers,
      },
      { status: 409 },
    );
  }

  const html = await buildFundraisingPackageHtml(content.fundraisingPackage);
  const revision = content.fundraisingPackage.revisedDate || new Date().toISOString().slice(0, 10);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="NOVA_8_Fundraising_Package_${revision}.html"`,
      "Content-Length": String(Buffer.byteLength(html, "utf8")),
      "Cache-Control": "private, no-store",
    },
  });
}
