import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/arrow-up-right-icon";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { resourceCatalog } from "@/lib/resource-library";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Research, practical guidance, and educational resources from NOVA Performing Arts.",
};

const featuredResource = resourceCatalog[0];
const practicalResources = resourceCatalog.slice(1);

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="NOVA Resources"
        title="Research for the work ahead."
        description="Evidence, practical guidance, and clear thinking for educators, families, community partners, and everyone working to expand access to the marching arts."
        image="/images/mallets-hands.jpg"
        imageAlt="A percussionist holding mallets above a keyboard instrument"
      />

      <section className="resources-intro">
        <div>
          <p className="eyebrow">Resource library</p>
          <h2>Useful ideas, built to be shared.</h2>
        </div>
        <p>
          NOVA&apos;s resource library brings together research and clear,
          shareable guides for people who want to understand the work, explain
          the need, or help a young musician begin.
        </p>
      </section>

      <section className="resource-library">
        <div className="resource-library-heading">
          <p className="eyebrow">Featured research</p>
          <p>
            {featuredResource.published} · {featuredResource.format}
          </p>
        </div>
        <article className="resource-card">
          <div className="resource-card-number" aria-hidden="true">
            01
          </div>
          <div className="resource-card-copy">
            <h2>{featuredResource.title}</h2>
            <p className="resource-card-subtitle">
              {featuredResource.subtitle}
            </p>
            <p>{featuredResource.summary}</p>
            <div className="resource-card-actions">
              <Link
                className="button button-dark"
                href={`/resources/${featuredResource.slug}`}
              >
                Read the paper
              </Link>
              <a
                className="text-link"
                download
                href={featuredResource.pdfPath}
              >
                Download PDF <ArrowUpRightIcon />
              </a>
            </div>
          </div>
        </article>

        <div className="resource-collection-heading">
          <div>
            <p className="eyebrow">Practical fundraising guides</p>
            <h2>Four clear ways to explain the opportunity.</h2>
          </div>
          <p>
            Short, accessible resources built for donor meetings, community
            introductions, prospective hosts, and anyone encountering NOVA for
            the first time.
          </p>
        </div>

        <div className="resource-guide-grid">
          {practicalResources.map((resource, index) => (
            <article className="resource-guide-card" key={resource.slug}>
              <div className="resource-guide-meta">
                <span>{String(index + 2).padStart(2, "0")}</span>
                <span>{resource.format}</span>
              </div>
              <h3>{resource.title}</h3>
              <p className="resource-guide-subtitle">{resource.subtitle}</p>
              <p>{resource.summary}</p>
              <div className="resource-guide-actions">
                <Link href={`/resources/${resource.slug}`}>Read the guide</Link>
                <a download href={resource.pdfPath}>
                  Download PDF
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBand
        eyebrow="Put the resources to work"
        title="Share the idea. Start the right conversation."
        body="Use these guides to introduce marching percussion, explain what a program requires, or help a potential donor or partner see where they fit."
        primaryHref="/support"
        primaryLabel="Explore ways to help"
        secondaryHref="/contact"
        secondaryLabel="Start a conversation"
      />
    </>
  );
}
