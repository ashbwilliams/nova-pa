import Link from "next/link";
import { redirect } from "next/navigation";
import {
  logoutHub,
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

export default async function HubDashboardPage() {
  if (!(await hasHubSession())) redirect("/hub");

  const [{ content, program }, inquiries] = await Promise.all([
    getSiteState(),
    listInquiries(),
  ]);
  const counts = {
    new: inquiries.filter((item) => item.status === "new").length,
    active: inquiries.filter((item) => item.status === "in_progress").length,
    students: inquiries.filter((item) => item.topic === "Student or family").length,
    supporters: inquiries.filter((item) => item.topic === "Donor or sponsor").length,
  };
  const storageConfigured = isNovaDataConfigured();

  return (
    <div className="hub-shell">
      <aside className="hub-sidebar">
        <div>
          <span className="hub-monogram">N</span>
          <p>NOVA Performing Arts</p>
          <strong>Owner Hub</strong>
        </div>
        <nav aria-label="Hub sections">
          <a href="#overview">Overview</a>
          <a href="#inquiries">Inquiries</a>
          <a href="#program">NOVA 8</a>
          <a href="#content">Site content</a>
        </nav>
        <div className="hub-sidebar-actions">
          <Link href="/" target="_blank">View public site</Link>
          <form action={logoutHub}>
            <button type="submit">Sign out</button>
          </form>
        </div>
      </aside>

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
            <article><span>Students</span><strong>{counts.students}</strong><p>Student and family inquiries</p></article>
            <article><span>Support</span><strong>{counts.supporters}</strong><p>Donor and sponsor inquiries</p></article>
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
              <article className={`hub-inquiry-card status-${inquiry.status}`} key={inquiry.id}>
                <div className="hub-inquiry-meta">
                  <span>{inquiry.topic}</span>
                  <time dateTime={inquiry.created_at}>{formatDate(inquiry.created_at)}</time>
                </div>
                <div className="hub-inquiry-person">
                  <div>
                    <h3>{inquiry.name}</h3>
                    <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
                    {inquiry.organization ? <p>{inquiry.organization}</p> : null}
                  </div>
                  <span>{formatStatus(inquiry.status)}</span>
                </div>
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
                  <button className="hub-save-button" type="submit">Save review</button>
                </form>
              </article>
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
              <p className="eyebrow">NOVA 8 controls</p>
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
              Show the interest-list invitation publicly
            </label>
            <button className="hub-save-button" type="submit" disabled={!storageConfigured}>Publish NOVA 8 details</button>
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
              <label>NOVA 8 headline<input name="academyHeadline" defaultValue={content.academyHeadline} required maxLength={180} /></label>
              <label>Support headline<input name="supportHeadline" defaultValue={content.supportHeadline} required maxLength={180} /></label>
            </div>
            <label>NOVA 8 overview<textarea name="academyOverview" defaultValue={content.academyOverview} rows={4} required maxLength={700} /></label>
            <label>Support overview<textarea name="supportOverview" defaultValue={content.supportOverview} rows={4} required maxLength={700} /></label>
            <label>Contact headline<input name="contactHeadline" defaultValue={content.contactHeadline} required maxLength={180} /></label>
            <label>Contact introduction<textarea name="contactIntro" defaultValue={content.contactIntro} rows={4} required maxLength={700} /></label>
            <button className="hub-save-button" type="submit" disabled={!storageConfigured}>Publish site content</button>
          </form>
        </section>
      </div>
    </div>
  );
}
