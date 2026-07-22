import { redirect } from "next/navigation";
import { HubSidebar } from "@/components/hub-sidebar";
import { PlaygroundPlanner } from "@/components/playground-planner";
import { hasHubSession } from "@/lib/hub-auth";
import { getSiteState, isNovaDataConfigured } from "@/lib/nova-data";

export const dynamic = "force-dynamic";

export default async function PlaygroundPlanningPage() {
  if (!(await hasHubSession())) redirect("/hub");

  const { content } = await getSiteState();
  const storageConfigured = isNovaDataConfigured();

  return (
    <div className="hub-shell planner-shell">
      <HubSidebar
        items={[
          { href: "/hub/dashboard", label: "Organization dashboard" },
          { href: "/hub/relationships", label: "Relationship manager" },
          { href: "/hub/playground", label: "Percussion Playground planner" },
          { href: "/hub/business-plan", label: "Business Plan Builder" },
          { href: "/hub/fundraising", label: "Fundraising Package Builder" },
        ]}
        publicHref="/percussion-playground"
        publicLabel="View event page"
      />

      <main className="hub-main planner-main" id="planner">
        <header className="hub-topbar planner-topbar">
          <div>
            <p className="eyebrow">Percussion Playground</p>
            <h1>Event planning hub</h1>
            <p>Build the room, stage the experience, and manage every relationship that follows.</p>
          </div>
          <span className={`hub-system-status ${storageConfigured ? "ready" : "setup"}`}>
            {storageConfigured ? "Private plan connected" : "Setup required"}
          </span>
        </header>

        {!storageConfigured ? (
          <section className="hub-alert" role="status">
            <strong>Connect secure storage to save the event plan.</strong>
            <p>You can review the full workspace now, but changes will not persist until the existing NOVA data service is connected.</p>
          </section>
        ) : null}

        <PlaygroundPlanner initialPlan={content.playgroundPlan} storageConfigured={storageConfigured} />
      </main>
    </div>
  );
}
