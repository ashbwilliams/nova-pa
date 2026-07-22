import { buildBusinessPlanZip } from "@/lib/business-plan-export";
import { reviewBusinessPlan } from "@/lib/business-plan";
import { hasHubSession } from "@/lib/hub-auth";
import { getSiteState } from "@/lib/nova-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await hasHubSession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content } = await getSiteState();
  const blockers = reviewBusinessPlan(content.businessPlan).filter(
    (issue) => issue.level === "blocker",
  );

  if (blockers.length) {
    return Response.json(
      {
        error: "Resolve the blocking review items before exporting.",
        issues: blockers,
      },
      { status: 409 },
    );
  }

  const archive = await buildBusinessPlanZip(content.businessPlan);
  const revision = content.businessPlan.revisedDate || new Date().toISOString().slice(0, 10);

  return new Response(new Uint8Array(archive), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="NOVA_8_Business_Plan_${revision}.zip"`,
      "Content-Length": String(archive.byteLength),
      "Cache-Control": "private, no-store",
    },
  });
}
