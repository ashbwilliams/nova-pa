import type { Metadata } from "next";
import Link from "next/link";
import { getMarchingPercussionPaper } from "@/lib/resource-content";

const PDF_PATH =
  "/resources/marching-percussion-as-an-educational-discipline.pdf";

export const metadata: Metadata = {
  title: "Marching Percussion as an Educational Discipline",
  description:
    "A research-based NOVA white paper on marching percussion as a pathway to musicianship, music appreciation, belonging, and growth.",
};

export default function MarchingPercussionPaperPage() {
  const paper = getMarchingPercussionPaper();

  return (
    <article className="resource-paper">
      <header className="resource-paper-hero">
        <div className="resource-paper-breadcrumb">
          <Link href="/resources">Resources</Link>
          <span aria-hidden="true">/</span>
          <span>White paper</span>
        </div>
        <div className="resource-paper-hero-grid">
          <div>
            <p className="eyebrow light">NOVA Performing Arts · July 2026</p>
            <h1>Marching Percussion as an Educational Discipline</h1>
            <p className="resource-paper-subtitle">
              Why it can become a critical pathway to music, belonging, and growth
              for the right student
            </p>
          </div>
          <div className="resource-paper-summary">
            <p>
              A serious, evidence-based case for understanding access to marching
              percussion as an educational opportunity, not merely access to an
              activity.
            </p>
            <dl>
              <div>
                <dt>Format</dt>
                <dd>White paper</dd>
              </div>
              <div>
                <dt>Reading time</dt>
                <dd>About {paper.readingMinutes} minutes</dd>
              </div>
              <div>
                <dt>References</dt>
                <dd>12 sources</dd>
              </div>
            </dl>
            <a className="button button-accent" download href={PDF_PATH}>
              Download the PDF
            </a>
          </div>
        </div>
      </header>

      <div className="resource-paper-mobile-tools">
        <details>
          <summary>In this paper</summary>
          <nav aria-label="Paper sections">
            {paper.sections.map((section) => (
              <a href={`#${section.id}`} key={section.id}>
                {section.title}
              </a>
            ))}
          </nav>
        </details>
        <a download href={PDF_PATH}>Download PDF</a>
      </div>

      <div className="resource-paper-layout">
        <aside className="resource-paper-sidebar">
          <p className="resource-paper-sidebar-label">In this paper</p>
          <nav aria-label="Paper sections">
            {paper.sections.map((section) => (
              <a href={`#${section.id}`} key={section.id}>
                {section.title}
              </a>
            ))}
          </nav>
          <a className="resource-paper-download" download href={PDF_PATH}>
            Download PDF
          </a>
        </aside>

        <div
          className="resource-prose"
          dangerouslySetInnerHTML={{ __html: paper.html }}
        />
      </div>

      <footer className="resource-paper-footer">
        <div>
          <p className="eyebrow light">Continue exploring</p>
          <h2>Research is only useful when it informs practice.</h2>
        </div>
        <div>
          <p>
            Learn how NOVA is translating this case into accessible, rigorous
            marching percussion education in Central Texas.
          </p>
          <div className="button-row">
            <Link className="button button-light" href="/nova-8">
              Explore NOVA 8 Percussion
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
