import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/arrow-up-right-icon";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Research, practical guidance, and educational resources from NOVA Performing Arts.",
};

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
          NOVA&apos;s resource library will bring together research papers, planning
          guides, and practical tools that support thoughtful, student-centered
          marching arts education.
        </p>
      </section>

      <section className="resource-library" aria-labelledby="featured-resource">
        <div className="resource-library-heading">
          <p className="eyebrow">Featured research</p>
          <p>July 2026 · White paper</p>
        </div>
        <article className="resource-card">
          <div className="resource-card-number" aria-hidden="true">
            01
          </div>
          <div className="resource-card-copy">
            <h2 id="featured-resource">
              Marching Percussion as an Educational Discipline
            </h2>
            <p className="resource-card-subtitle">
              Why it can become a critical pathway to music, belonging, and growth
              for the right student
            </p>
            <p>
              A careful, evidence-based case for marching percussion as a
              distinctive mode of music learning, with explicit limits on what the
              research does and does not support.
            </p>
            <div className="resource-card-actions">
              <Link
                className="button button-dark"
                href="/resources/marching-percussion-as-an-educational-discipline"
              >
                Read the paper
              </Link>
              <a
                className="text-link"
                download
                href="/resources/marching-percussion-as-an-educational-discipline.pdf"
              >
                Download PDF <ArrowUpRightIcon />
              </a>
            </div>
          </div>
        </article>
      </section>

      <CtaBand
        eyebrow="A growing library"
        title="Have a question NOVA should explore?"
        body="We are developing resources around access, instruction, program design, and the educational value of the marching arts."
        primaryHref="/contact"
        primaryLabel="Start a conversation"
        secondaryHref="/about"
        secondaryLabel="About NOVA"
      />
    </>
  );
}
