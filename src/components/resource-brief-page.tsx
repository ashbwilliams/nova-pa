import Link from "next/link";
import { getResourceBrief } from "@/lib/resource-content";

type ResourceBrief = ReturnType<typeof getResourceBrief>;

type ResourceBriefPageProps = {
  resource: ResourceBrief;
};

export function ResourceBriefPage({ resource }: ResourceBriefPageProps) {
  return (
    <article className="resource-paper resource-brief">
      <header className="resource-paper-hero resource-brief-hero">
        <div className="resource-paper-breadcrumb">
          <Link href="/resources">Resources</Link>
          <span aria-hidden="true">/</span>
          <span>Practical guide</span>
        </div>
        <div className="resource-paper-hero-grid">
          <div>
            <p className="eyebrow light">
              NOVA Performing Arts · {resource.published}
            </p>
            <h1>{resource.title}</h1>
            <p className="resource-paper-subtitle">{resource.subtitle}</p>
          </div>
          <div className="resource-paper-summary">
            <p>{resource.summary}</p>
            <dl>
              <div>
                <dt>Format</dt>
                <dd>{resource.format}</dd>
              </div>
              <div>
                <dt>Reading time</dt>
                <dd>About {resource.readingMinutes} minutes</dd>
              </div>
              <div>
                <dt>Designed for</dt>
                <dd>Sharing</dd>
              </div>
            </dl>
            <a
              className="button button-accent"
              download
              href={resource.pdfPath}
            >
              Download the brief
            </a>
          </div>
        </div>
      </header>

      <div className="resource-paper-mobile-tools">
        <details>
          <summary>In this guide</summary>
          <nav aria-label="Guide sections">
            {resource.sections.map((section) => (
              <a href={`#${section.id}`} key={section.id}>
                {section.title}
              </a>
            ))}
          </nav>
        </details>
        <a download href={resource.pdfPath}>
          Download PDF
        </a>
      </div>

      <div className="resource-paper-layout">
        <aside className="resource-paper-sidebar">
          <p className="resource-paper-sidebar-label">In this guide</p>
          <nav aria-label="Guide sections">
            {resource.sections.map((section) => (
              <a href={`#${section.id}`} key={section.id}>
                {section.title}
              </a>
            ))}
          </nav>
          <a
            className="resource-paper-download"
            download
            href={resource.pdfPath}
          >
            Download PDF
          </a>
        </aside>

        <div
          className="resource-prose"
          dangerouslySetInnerHTML={{ __html: resource.html }}
        />
      </div>

      <footer className="resource-paper-footer">
        <div>
          <p className="eyebrow light">Put the guide to work</p>
          <h2>One conversation can create a starting point.</h2>
        </div>
        <div>
          <p>
            Share this resource with someone who may want to support, host,
            sponsor, or introduce NOVA to the right partner.
          </p>
          <div className="button-row">
            <Link className="button button-light" href="/contact">
              Start a conversation
            </Link>
            <Link className="text-link light" href="/resources">
              Return to resources
            </Link>
          </div>
        </div>
      </footer>
    </article>
  );
}
