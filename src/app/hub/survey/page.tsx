import { redirect } from "next/navigation";
import { DirectorSurveyEditor } from "@/components/director-survey-editor";
import { HubSidebar } from "@/components/hub-sidebar";
import { hasHubSession } from "@/lib/hub-auth";
import { getSiteState, isNovaDataConfigured } from "@/lib/nova-data";

export const dynamic = "force-dynamic";

export default async function SurveyEditorPage() {
  if (!(await hasHubSession())) redirect("/hub");

  const { content } = await getSiteState();
  const storageConfigured = isNovaDataConfigured();

  return (
    <div className="hub-shell planner-shell">
      <HubSidebar
        items={[
          { href: "/hub/dashboard", label: "Organization dashboard" },
          { href: "/hub/survey", label: "Educator survey" },
          { href: "/hub/relationships", label: "Relationship manager" },
          { href: "/hub/playground", label: "Percussion Playground planner" },
          { href: "/hub/business-plan", label: "Business Plan Builder" },
          { href: "/hub/fundraising", label: "Fundraising Package Builder" },
        ]}
        publicHref="/director-survey"
        publicLabel="View educator survey"
      />

      <main className="hub-main planner-main">
        <header className="hub-topbar planner-topbar">
          <div>
            <p className="eyebrow">Educator outreach</p>
            <h1>Survey editor</h1>
            <p>
              Update public question wording and answer choices without changing
              the survey page code.
            </p>
          </div>
          <span className={`hub-system-status ${storageConfigured ? "ready" : "setup"}`}>
            {storageConfigured ? "Survey connected" : "Setup required"}
          </span>
        </header>

        {!storageConfigured ? (
          <section className="hub-alert" role="status">
            <strong>Connect secure storage to edit the survey.</strong>
            <p>
              The public survey will continue using its built-in questions until
              the NOVA data service is available.
            </p>
          </section>
        ) : null}

        <DirectorSurveyEditor initialConfig={content.directorSurvey} />
      </main>
    </div>
  );
}
