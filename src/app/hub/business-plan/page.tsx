import { redirect } from "next/navigation";
import { BusinessPlanBuilder } from "@/components/business-plan-builder";
import { HubSidebar } from "@/components/hub-sidebar";
import { hasHubSession } from "@/lib/hub-auth";
import { getSiteState, isNovaDataConfigured } from "@/lib/nova-data";

export const dynamic = "force-dynamic";

export default async function BusinessPlanPage() {
  if (!(await hasHubSession())) redirect("/hub");

  const { content } = await getSiteState();
  const storageConfigured = isNovaDataConfigured();

  return (
    <div className="hub-shell planner-shell business-plan-shell">
      <HubSidebar
        items={[
          { href: "/hub/dashboard", label: "Organization dashboard" },
          { href: "/hub/relationships", label: "Relationship manager" },
          { href: "/hub/playground", label: "Percussion Playground planner" },
          { href: "/hub/business-plan", label: "Business Plan Builder" },
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

        <BusinessPlanBuilder initialPlan={content.businessPlan} storageConfigured={storageConfigured} />
      </main>
    </div>
  );
}
