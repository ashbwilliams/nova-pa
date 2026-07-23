import { redirect } from "next/navigation";
import {
  saveInquiryReview,
  saveProgramDetails,
  saveSiteContent,
} from "@/app/hub/actions";
import { hasHubSession } from "@/lib/hub-auth";
import {
  getSiteState,
  inquiryStatuses,
  isNovaDataConfigured,
  listInquiries,
} from "@/lib/nova-data";
import { HubMediaLibrary } from "@/components/hub-media-library";
import { HubSidebar } from "@/components/hub-sidebar";
import { hubPrimaryNavigation } from "@/lib/hub-navigation";
import { InquiryDeleteForm } from "@/components/inquiry-delete-form";
import { mediaSlotDefinitions, resolveMediaSlot } from "@/lib/nova-media";

export const dynamic = "force-dynamic";

function formatStatus(status: string) {
  return status === "in_progress"
    ? "In progress"
    : status.charAt(0).toUpperCase() + status.slice(1);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function contactHref(value: string) {
  if (value === "No follow-up requested") return null;
  if (value.includes("@")) return `mailto:${value}`;
  const phone = value.replace(/[^\d+]/g, "");
  return phone.length >= 7 ? `tel:${phone}` : null;
}

type HubDashboardPageProps = {
  searchParams: Promise<{
    mediaStatus?: string;
    mediaMessage?: string;
  }>;
};

export default async function HubDashboardPage({ searchParams }: HubDashboardPageProps) {
  if (!(await hasHubSession())) redirect("/hub");

  const mediaResult = await searchParams;

  const [{ content, program }, inquiries] = await Promise.all([
    getSiteState(),
    listInquiries(),
  ]);
  const counts = {
    new: inquiries.filter((item) => item.status === "new").length,
    active: inquiries.filter((item) => item.status === "in_progress").length,
    relationships: content.relationshipDirectory.contacts.length,
    followUps: content.relationshipDirectory.contacts.filter((contact) => {
      const today = new Date().toISOString().slice(0, 10);
      return (
        contact.status !== "Closed" &&
        contact.status !== "On hold" &&
        contact.nextFollowUpDate &&
        contact.nextFollowUpDate <= today
      );
    }).length,
  };
  const storageConfigured = isNovaDataConfigured();
  const mediaItems = mediaSlotDefinitions.map((definition) => ({
    definition,
    media: resolveMediaSlot(content.media, definition.key),
  }));

  return (
    <div className="hub-shell">
      <HubSidebar
        items={[
          ...hubPrimaryNavigation,
          { href: "/hub/dashboard#overview", label: "Overview", group: "Dashboard sections" },
          { href: "/hub/dashboard#inquiries", label: "All inquiries", group: "Dashboard sections" },
          { href: "/hub/dashboard#program", label: "NOVA 8 Percussion", group: "Dashboard sections" },
          { href: "/hub/dashboard#content", label: "Site content", group: "Dashboard sections" },
          { href: "/hub/dashboard#photos", label: "Site photos", group: "Dashboard sections" },
        ]}
        publicHref="/"
        publicLabel="View public site"
      />

      <div className="hub-main">
        <header className="hub-topbar">
          <div>
            <p className="eyebrow">NOVA operations</p>
            <h1>Organization dashboard</h1>
          </div>
          <span className={`hub-system-status ${storageConfigured ? "ready" : "setup"}`}>
            {storageConfigured ? "Data service connected" : "Setup required"}
          </span>
        </header>

        {!storageConfigured ? (
          <section className="hub-alert" role="status">
            <strong>Connect secure storage to activate the hub.</strong>
            <p>
              Apply the included Supabase migration and add the required Vercel
              environment variables. The public site remains available with its
              existing fallback content until then.
            </p>
          </section>
        ) : null}

        <section className="hub-section" id="overview">
          <div className="hub-section-heading">
            <div>
              <p className="eyebrow">Overview</p>
              <h2>What needs attention</h2>
            </div>
          </div>
          <div className="hub-stat-grid">
            <article><span>New</span><strong>{counts.new}</strong><p>Unreviewed inquiries</p></article>
            <article><span>Active</span><strong>{counts.active}</strong><p>Conversations underway</p></article>
            <article><span>Relationships</span><strong>{counts.relationships}</strong><p>Organization-wide records</p></article>
            <article><span>Follow-up</span><strong>{counts.followUps}</strong><p>Due today or overdue</p></article>
          </div>
        </section>

        <section className="hub-section" id="inquiries">
          <div className="hub-section-heading">
            <div>
              <p className="eyebrow">Inbox</p>
              <h2>Public inquiries</h2>
            </div>
            <span>{inquiries.length} total</span>
          </div>

          <div className="hub-inquiry-list">
            {inquiries.length ? inquiries.map((inquiry) => (
              <details className={`hub-inquiry-card status-${inquiry.status}`} key={inquiry.id}>
                <summary className="hub-inquiry-summary">
                  <span className="hub-inquiry-chevron" aria-hidden="true" />
                  <span className="hub-inquiry-summary-copy">
                    <span className="hub-inquiry-meta">
                      <span>{inquiry.topic}</span>
                      <time dateTime={inquiry.created_at}>{formatDate(inquiry.created_at)}</time>
                    </span>
                    <span className="hub-inquiry-person">
                      <span>
                        <strong>{inquiry.name}</strong>
                        <small>{inquiry.organization || inquiry.email}</small>
                      </span>
                      <span>{formatStatus(inquiry.status)}</span>
                    </span>
                  </span>
                </summary>
                <div className="hub-inquiry-details">
                  {contactHref(inquiry.email) ? (
                    <a className="hub-inquiry-email" href={contactHref(inquiry.email) ?? undefined}>
                      {inquiry.email}
                    </a>
                  ) : (
                    <p className="hub-inquiry-email">{inquiry.email}</p>
                  )}
                  {inquiry.organization ? <p className="hub-inquiry-organization">{inquiry.organization}</p> : null}
                  <p className="hub-inquiry-message">{inquiry.message}</p>
                  <form action={saveInquiryReview} className="hub-review-form">
                    <input type="hidden" name="id" value={inquiry.id} />
                    <label>
                      Status
                      <select name="status" defaultValue={inquiry.status}>
                        {inquiryStatuses.map((status) => (
                          <option value={status} key={status}>{formatStatus(status)}</option>
                        ))}
                      </select>
                    </label>
                    <label className="hub-notes-field">
                      Internal notes
                      <textarea name="internalNotes" defaultValue={inquiry.internal_notes} rows={3} maxLength={2000} />
                    </label>
                    <button className="hub-save-button" type="submit">Save changes</button>
                  </form>
                  <div className="hub-inquiry-delete-row">
                    <p>Delete test, duplicate, or no-longer-needed inquiries permanently.</p>
                    <InquiryDeleteForm id={inquiry.id} name={inquiry.name} />
                  </div>
                </div>
              </details>
            )) : (
              <div className="hub-empty-state">
                <strong>No inquiries yet</strong>
                <p>New contact-form submissions will appear here.</p>
              </div>
            )}
          </div>
        </section>

        <section className="hub-section" id="program">
          <div className="hub-section-heading">
            <div>
              <p className="eyebrow">NOVA 8 Percussion controls</p>
              <h2>Public program details</h2>
            </div>
          </div>
          <form action={saveProgramDetails} className="hub-editor-form">
            <div className="hub-form-grid">
              <label>Status label<input name="statusLabel" defaultValue={program.statusLabel} required maxLength={80} /></label>
              <label>Season dates<input name="seasonDates" defaultValue={program.seasonDates} maxLength={160} placeholder="To be announced" /></label>
              <label>Location<input name="location" defaultValue={program.location} maxLength={160} /></label>
              <label>Participation cost<input name="participationCost" defaultValue={program.participationCost} maxLength={160} placeholder="To be announced" /></label>
            </div>
            <label>Status explanation<textarea name="statusMessage" defaultValue={program.statusMessage} rows={4} required maxLength={600} /></label>
            <label>Eligibility<textarea name="eligibility" defaultValue={program.eligibility} rows={3} maxLength={500} /></label>
            <label className="hub-check-field">
              <input type="checkbox" name="interestOpen" defaultChecked={program.interestOpen} />
              Show the interest-list invitation on the public site
            </label>
            <button className="hub-save-button" type="submit" disabled={!storageConfigured}>Publish NOVA 8 Percussion details</button>
          </form>
        </section>

        <section className="hub-section" id="content">
          <div className="hub-section-heading">
            <div>
              <p className="eyebrow">Public site</p>
              <h2>Core content</h2>
            </div>
          </div>
          <form action={saveSiteContent} className="hub-editor-form">
            <div className="hub-announcement-control">
              <label className="hub-check-field">
                <input type="checkbox" name="announcementEnabled" defaultChecked={content.announcementEnabled} />
                Show announcement above the homepage hero
              </label>
              <label>Announcement text<input name="announcementText" defaultValue={content.announcementText} maxLength={240} /></label>
            </div>
            <label>Homepage introduction<textarea name="homeHeroBody" defaultValue={content.homeHeroBody} rows={4} required maxLength={500} /></label>
            <label>Mission statement<textarea name="missionStatement" defaultValue={content.missionStatement} rows={3} required maxLength={300} /></label>
            <div className="hub-form-grid">
              <label>NOVA 8 Percussion headline<input name="academyHeadline" defaultValue={content.academyHeadline} required maxLength={180} /></label>
              <label>Support headline<input name="supportHeadline" defaultValue={content.supportHeadline} required maxLength={180} /></label>
            </div>
            <label>NOVA 8 Percussion overview<textarea name="academyOverview" defaultValue={content.academyOverview} rows={4} required maxLength={700} /></label>
            <label>Support overview<textarea name="supportOverview" defaultValue={content.supportOverview} rows={4} required maxLength={700} /></label>
            <label>Contact headline<input name="contactHeadline" defaultValue={content.contactHeadline} required maxLength={180} /></label>
            <label>Contact introduction<textarea name="contactIntro" defaultValue={content.contactIntro} rows={4} required maxLength={700} /></label>
            <button className="hub-save-button" type="submit" disabled={!storageConfigured}>Publish site content</button>
          </form>
        </section>

        <section className="hub-section hub-media-section" id="photos">
          <div className="hub-section-heading">
            <div>
              <p className="eyebrow">Public site</p>
              <h2>Site photos</h2>
            </div>
            <span>{mediaSlotDefinitions.length} fixed placements</span>
          </div>
          {mediaResult.mediaMessage ? (
            <div
              className={`hub-media-notice ${
                mediaResult.mediaStatus === "error" ? "error" : "success"
              }`}
              role={mediaResult.mediaStatus === "error" ? "alert" : "status"}
            >
              {mediaResult.mediaMessage}
            </div>
          ) : null}
          <div className="hub-media-intro">
            <p>
              Each placement is fixed, so replacing a photo changes only the location
              named here. The built-in image remains available as a fallback.
            </p>
            <p>
              Use the focus controls to keep the important part of the photograph in
              frame across desktop and mobile layouts.
            </p>
          </div>

          <HubMediaLibrary items={mediaItems} storageConfigured={storageConfigured} />
        </section>
      </div>
    </div>
  );
}
