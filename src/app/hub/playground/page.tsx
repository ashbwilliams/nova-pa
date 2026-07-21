import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutHub } from "@/app/hub/actions";
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
      <aside className="hub-sidebar">
        <div>
          <span className="hub-monogram">N</span>
          <p>NOVA Performing Arts</p>
          <strong>Owner Hub</strong>
        </div>
        <nav aria-label="Hub sections">
          <Link href="/hub/dashboard">Organization dashboard</Link>
          <Link className="active" href="/hub/playground">Percussion Playground</Link>
          <a href="/hub/playground#planner">Event workspace</a>
        </nav>
        <div className="hub-sidebar-actions">
          <Link href="/percussion-playground" target="_blank">View event page</Link>
          <form action={logoutHub}>
            <button type="submit">Sign out</button>
          </form>
        </div>
      </aside>

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
