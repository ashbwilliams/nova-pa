import Link from "next/link";
import { redirect } from "next/navigation";
import { DirectorSurveyEditor } from "@/components/director-survey-editor";
import { HubSidebar } from "@/components/hub-sidebar";
import { hasHubSession } from "@/lib/hub-auth";
import { hubPrimaryNavigation } from "@/lib/hub-navigation";
import {
  getSiteState,
  isNovaDataConfigured,
  listInquiries,
} from "@/lib/nova-data";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatStatus(status: string) {
  return status === "in_progress"
    ? "In progress"
    : status.charAt(0).toUpperCase() + status.slice(1);
}

export default async function SurveyEditorPage() {
  if (!(await hasHubSession())) redirect("/hub");

  const [{ content }, inquiries] = await Promise.all([
    getSiteState(),
    listInquiries(),
  ]);
  const responses = inquiries.filter((inquiry) =>
    inquiry.message.startsWith("EDUCATOR SURVEY RESPONSE"),
  );
  const storageConfigured = isNovaDataConfigured();

  return (
    <div className="hub-shell planner-shell">
      <HubSidebar
        items={[
          ...hubPrimaryNavigation,
          {
            href: "/hub/survey#responses",
            label: "Survey responses",
            group: "Survey workspace",
          },
          {
            href: "/hub/survey#editor",
            label: "Question editor",
            group: "Survey workspace",
          },
        ]}
        publicHref="/director-survey"
        publicLabel="View educator survey"
      />

      <main className="hub-main planner-main">
        <header className="hub-topbar planner-topbar">
          <div>
            <p className="eyebrow">Educator outreach</p>
            <h1>Educator survey</h1>
            <p>
              Review incoming responses, then update public question wording and
              answer choices from one workspace.
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

        <section className="hub-section" id="responses">
          <div className="hub-section-heading">
            <div>
              <p className="eyebrow">Response inbox</p>
              <h2>Survey results</h2>
            </div>
            <span>{responses.length} total</span>
          </div>

          <div className="hub-inquiry-list">
            {responses.length ? (
              responses.map((response) => (
                <details
                  className={`hub-inquiry-card status-${response.status}`}
                  key={response.id}
                >
                  <summary className="hub-inquiry-summary">
                    <span className="hub-inquiry-chevron" aria-hidden="true" />
                    <span className="hub-inquiry-summary-copy">
                      <span className="hub-inquiry-meta">
                        <span>Educator survey response</span>
                        <time dateTime={response.created_at}>
                          {formatDate(response.created_at)}
                        </time>
                      </span>
                      <span className="hub-inquiry-person">
                        <span>
                          <strong>{response.name}</strong>
                          <small>
                            {response.organization || response.email}
                          </small>
                        </span>
                        <span>{formatStatus(response.status)}</span>
                      </span>
                    </span>
                  </summary>
                  <div className="hub-inquiry-details">
                    <p className="hub-inquiry-email">{response.email}</p>
                    {response.organization ? (
                      <p className="hub-inquiry-organization">
                        {response.organization}
                      </p>
                    ) : null}
                    <p className="hub-inquiry-message">{response.message}</p>
                    <Link
                      className="survey-response-manage-link"
                      href="/hub/dashboard#inquiries"
                    >
                      Manage status and internal notes
                    </Link>
                  </div>
                </details>
              ))
            ) : (
              <div className="hub-empty-state">
                <strong>No survey responses yet</strong>
                <p>
                  Submitted educator surveys will appear here automatically.
                </p>
              </div>
            )}
          </div>
        </section>

        <div id="editor">
          <DirectorSurveyEditor initialConfig={content.directorSurvey} />
        </div>
      </main>
    </div>
  );
}
