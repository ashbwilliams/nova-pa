import { redirect } from "next/navigation";
import { HubSidebar, hubPrimaryNavigation } from "@/components/hub-sidebar";
import { RelationshipManager } from "@/components/relationship-manager";
import { hasHubSession } from "@/lib/hub-auth";
import { getSiteState, isNovaDataConfigured } from "@/lib/nova-data";

export const dynamic = "force-dynamic";

export default async function RelationshipsPage() {
  if (!(await hasHubSession())) redirect("/hub");

  const { content } = await getSiteState();
  const storageConfigured = isNovaDataConfigured();

  return (
    <div className="hub-shell planner-shell">
      <HubSidebar
        items={hubPrimaryNavigation}
        publicHref="/"
        publicLabel="View public site"
      />

      <main className="hub-main planner-main">
        <header className="hub-topbar planner-topbar">
          <div>
            <p className="eyebrow">NOVA operations</p>
            <h1>Relationship management</h1>
            <p>
              Maintain NOVA&apos;s organization-wide network independently of any
              single program or event.
            </p>
          </div>
          <span
            className={`hub-system-status ${storageConfigured ? "ready" : "setup"}`}
          >
            {storageConfigured ? "Private directory connected" : "Setup required"}
          </span>
        </header>

        {!storageConfigured ? (
          <section className="hub-alert" role="status">
            <strong>Connect secure storage to save relationships.</strong>
            <p>
              The directory is private and available only through the protected
              owner hub.
            </p>
          </section>
        ) : null}

        <RelationshipManager
          initialDirectory={content.relationshipDirectory}
          storageConfigured={storageConfigured}
        />
      </main>
    </div>
  );
}
