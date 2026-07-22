import { redirect } from "next/navigation";
import { BusinessPlanBuilder } from "@/components/business-plan-builder";
import { HubSidebar } from "@/components/hub-sidebar";
import { hasHubSession } from "@/lib/hub-auth";
import { getDocumentVersionHistory, getSiteState, isNovaDataConfigured } from "@/lib/nova-data";

export const dynamic = "force-dynamic";

export default async function BusinessPlanPage() {
  if (!(await hasHubSession())) redirect("/hub");

  const [{ content }, history] = await Promise.all([
    getSiteState(),
    getDocumentVersionHistory(),
  ]);
  const storageConfigured = isNovaDataConfigured();
  const versions = history.businessPlan.map((version) => ({
    id: version.id,
    title: version.title,
    versionDate: version.versionDate,
    status: version.status,
    notes: version.notes,
    creator: version.creator,
    createdAt: version.createdAt,
    recipient: version.recipient,
    artifact: version.artifact ? {
      fileName: version.artifact.fileName,
      byteLength: version.artifact.byteLength,
      sha256: version.artifact.sha256,
    } : undefined,
  }));

  return (
    <div className="hub-shell planner-shell business-plan-shell">
      <HubSidebar
        items={[
          { href: "/hub/dashboard", label: "Organization dashboard" },
          { href: "/hub/relationships", label: "Relationship manager" },
          { href: "/hub/playground", label: "Percussion Playground planner" },
          { href: "/hub/business-plan", label: "Business Plan Builder" },
          { href: "/hub/fundraising", label: "Fundraising Package Builder" },
        ]}
        publicHref="/"
        publicLabel="View public site"
      />

      <main className="hub-main planner-main business-plan-main">
        <header className="hub-topbar planner-topbar">
          <div>
            <p className="eyebrow">NOVA 8 strategy</p>
            <h1>Business Plan Builder</h1>
            <p>Update the assumptions that change, review the complete revision, and export a new offline package.</p>
          </div>
          <span className={`hub-system-status ${storageConfigured ? "ready" : "setup"}`}>
            {storageConfigured ? "Private plan connected" : "Setup required"}
          </span>
        </header>

        {!storageConfigured ? (
          <section className="hub-alert" role="status">
            <strong>Connect secure storage to save and export revisions.</strong>
            <p>You can inspect the full builder with its founding defaults now. Saved revisions remain private within the owner hub.</p>
          </section>
        ) : null}

        <BusinessPlanBuilder
          key={content.businessPlan.updatedAt || "business-plan"}
          initialPlan={content.businessPlan}
          storageConfigured={storageConfigured}
          versions={versions}
        />
      </main>
    </div>
  );
}
