import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/arrow-up-right-icon";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { getSiteState } from "@/lib/nova-data";
import { resolveMediaSlot } from "@/lib/nova-media";

export const metadata: Metadata = {
  title: "Institutional Instructional Partnerships",
  description:
    "Learn how collegiate percussion studios, independent ensembles, and other organizations can partner with NOVA 8 to develop emerging educators.",
};

export default async function InstitutionalInstructionalPartnershipsPage() {
  const { content } = await getSiteState();
  const heroImage = resolveMediaSlot(content.media, "fellowship.hero");

  return (
    <>
      <PageHero
        eyebrow="A signature NOVA 8 opportunity"
        title="Institutional instructional partnerships"
        description="NOVA 8 partners with organizations that develop advanced performers to create meaningful, mentored teaching experience and stronger opportunities for young musicians."
        image={heroImage.src}
        imageAlt={heroImage.alt}
        imagePosition={heroImage.objectPosition}
      />

      <section className="partnerships-intro">
        <div>
          <p className="eyebrow">A reciprocal model</p>
          <h2>Each partner contributes what it is best positioned to provide.</h2>
        </div>
        <p>
          Collegiate percussion studios, independent ensembles, and other
          organizations that develop advanced performers can partner with NOVA 8
          through the NOVA 8 Teaching Fellowship. Selected percussionists gain
          structured, supervised experience teaching young musicians while NOVA 8
          students benefit from additional instruction, mentorship, and connection
          to the wider percussion community.
        </p>
      </section>

      <section className="partnership-section">
        <div className="partnership-heading">
          <p className="eyebrow">What we build together</p>
          <h2>A teaching-development pathway with real structure behind it.</h2>
          <p>
            NOVA operates the youth program and provides the environment in which
            fellows can learn to teach. The institutional partner helps connect the
            fellowship to talented performers, experienced mentors, and practical
            resources. The result is a genuine educational partnership, not simply
            a request for volunteer instructors.
          </p>
        </div>

        <div className="partnership-exchange" aria-label="Partnership contributions">
          <article>
            <p className="partnership-label">NOVA provides</p>
            <h3>The program and teaching environment</h3>
            <ul>
              <li>A functioning youth ensemble in which fellows gain meaningful experience</li>
              <li>An experienced lead educator and supervised progression of responsibility</li>
              <li>Defined teaching assignments and regular feedback</li>
              <li>Instruments, curriculum structure, scheduling, and program administration</li>
              <li>Youth-protection procedures, screening, and organizational accountability</li>
              <li>Opportunities to develop rehearsal leadership, communication, and instructional skills</li>
            </ul>
          </article>
          <article>
            <p className="partnership-label">The institutional partner may provide</p>
            <h3>People, guidance, and practical support</h3>
            <ul>
              <li>Help identifying qualified fellowship candidates</li>
              <li>A faculty, staff, or artistic liaison</li>
              <li>Occasional mentoring or curriculum consultation</li>
              <li>Rehearsal or classroom space</li>
              <li>Scheduling and recruitment assistance</li>
              <li>Access to selected equipment or institutional resources</li>
              <li>Stipends, scholarships, transportation support, or fellowship underwriting</li>
              <li>Recognition as field experience, an internship, or eventually a formal practicum</li>
            </ul>
          </article>
        </div>

        <div className="logistics-band">
          <div>
            <p className="eyebrow light">Designed around capacity</p>
            <h3>No partner is expected to provide everything.</h3>
          </div>
          <p>
            Each partnership is shaped around the organization&apos;s goals, resources,
            and practical capacity. One partner might focus on identifying fellows
            and providing a liaison. Another might also contribute rehearsal space,
            transportation, or financial support. NOVA and the partner define a
            useful, sustainable exchange together.
          </p>
        </div>
      </section>

      <section className="fellowship-benefits-section">
        <div className="section-heading-row dark-text">
          <div>
            <p className="eyebrow">Reciprocal benefit</p>
            <h2>More capable educators. More supported young musicians.</h2>
          </div>
        </div>
        <div className="fellowship-benefits-grid">
          <article>
            <p className="benefit-audience">For institutional partners</p>
            <h3>Teaching development without program administration</h3>
            <p>
              A structured pathway for advanced performers to build practical
              instructional and leadership experience in the community.
            </p>
          </article>
          <article>
            <p className="benefit-audience">For fellows</p>
            <h3>Experience before independence</h3>
            <p>
              Defined responsibilities, professional feedback, and the opportunity
              to grow under an experienced lead educator.
            </p>
          </article>
          <article>
            <p className="benefit-audience">For NOVA 8 students</p>
            <h3>More instruction and mentorship</h3>
            <p>
              Greater individual attention and meaningful relationships with
              accomplished percussionists working within a consistent program model.
            </p>
          </article>
          <article>
            <p className="benefit-audience">For the community</p>
            <h3>A stronger percussion teaching pipeline</h3>
            <p>
              More thoughtful educators prepared to serve school programs, private
              students, and ensembles throughout Central Texas.
            </p>
          </article>
        </div>
      </section>

      <section className="fellowship-interest-section">
        <div>
          <p className="eyebrow">The fellowship in practice</p>
          <h2>Learn how emerging educators develop within NOVA 8.</h2>
        </div>
        <div className="fellowship-interest-paths">
          <article>
            <h3>NOVA 8 Teaching Fellowship</h3>
            <p>
              Fellows begin with defined assignments and take on greater teaching
              responsibility as they demonstrate readiness. The separate fellowship
              page describes the experience, skills, and supervised progression.
            </p>
            <Link href="/teaching-fellowship">
              Explore the Teaching Fellowship <ArrowUpRightIcon />
            </Link>
          </article>
          <article>
            <h3>Begin with a focused pilot</h3>
            <p>
              A partnership can start with a small cohort and a limited rehearsal
              cycle, then develop into a longer fellowship, internship, field
              experience, or practicum if that structure serves both organizations.
            </p>
            <Link href="/contact?topic=School+or+educator#contact-form">
              Discuss a pilot partnership <ArrowUpRightIcon />
            </Link>
          </article>
        </div>
      </section>

      <CtaBand
        eyebrow="Build the teaching pipeline"
        title="Let&apos;s shape a partnership around your organization."
        body="If your studio, ensemble, or institution develops advanced percussionists, NOVA would welcome a conversation about how our strengths could work together."
        primaryHref="/contact?topic=School+or+educator#contact-form"
        primaryLabel="Start a partnership conversation"
        secondaryHref="/partnerships"
        secondaryLabel="View all partnership opportunities"
      />
    </>
  );
}
