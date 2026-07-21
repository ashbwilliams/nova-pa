import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { ManagedImage } from "@/components/managed-image";
import { PageHero } from "@/components/page-hero";
import { getSiteState } from "@/lib/nova-data";
import { resolveMediaSlot } from "@/lib/nova-media";

export const metadata: Metadata = {
  title: "NOVA 8 Percussion",
  description:
    "Discover NOVA 8 Percussion, a noncompetitive marching percussion development program for young musicians in Central Texas.",
};

const experience = [
  ["Technique", "Focused development for battery and front ensemble percussionists."],
  ["Musicianship", "Timing, listening, music literacy, ensemble awareness, and expression."],
  ["Movement", "Foundational marching and movement skills taught with care and intention."],
  ["Mentorship", "Specific feedback from educators who value progress over comparison."],
  ["Community", "A shared rehearsal culture built on encouragement, preparation, and respect."],
  ["Performance", "Meaningful opportunities to share work without a competitive ranking."],
];

export default async function Nova8Page() {
  const { content, program } = await getSiteState();
  const heroImage = resolveMediaSlot(content.media, "nova8.hero");
  const modelImage = resolveMediaSlot(content.media, "nova8.noncompetitive");
  const audienceImage = resolveMediaSlot(content.media, "nova8.audience");

  return (
    <>
      <PageHero
        eyebrow="A program of NOVA Performing Arts"
        title="NOVA 8 Percussion"
        description={`${content.academyHeadline} ${content.academyOverview}`}
        image={heroImage.src}
        imageAlt={heroImage.alt}
        imagePosition={heroImage.objectPosition}
      />

      <section className="why-eight-section" id="why-eight">
        <div className="why-eight-count">
          <p className="eyebrow">Why 8?</p>
          <p className="count-off" aria-label="Five, six. Five, six, seven, eight.">
            <span aria-hidden="true">5</span>
            <span aria-hidden="true">6</span>
            <span className="count-break" aria-hidden="true">·</span>
            <span aria-hidden="true">5</span>
            <span aria-hidden="true">6</span>
            <span aria-hidden="true">7</span>
            <strong aria-hidden="true">8</strong>
          </p>
        </div>
        <div className="why-eight-copy">
          <h2>The last count before what comes next.</h2>
          <p>
            Named for the final count before an ensemble begins, NOVA 8 prepares
            young musicians for what comes next.
          </p>
        </div>
      </section>

      <section className="program-status-section" aria-labelledby="program-status-heading">
        <div className="program-status-heading">
          <p className="eyebrow">Program status</p>
          <h2 id="program-status-heading">{program.statusLabel}</h2>
          <p>{program.statusMessage}</p>
          {program.interestOpen ? (
            <Link className="button button-dark" href="/contact?topic=Student+or+family#contact-form">
              Join the interest list
            </Link>
          ) : null}
        </div>
        <dl className="program-details-grid">
          <div><dt>Season dates</dt><dd>{program.seasonDates || "To be announced"}</dd></div>
          <div><dt>Location</dt><dd>{program.location || "To be announced"}</dd></div>
          <div><dt>Participation cost</dt><dd>{program.participationCost || "To be announced"}</dd></div>
          <div><dt>Who it is for</dt><dd>{program.eligibility || "Details to be announced"}</dd></div>
        </dl>
      </section>

      <section className="academy-intro">
        <div className="academy-intro-title">
          <p className="eyebrow">The model</p>
          <h2>Serious instruction.<br />No competitive finish line.</h2>
        </div>
        <div className="academy-intro-copy">
          <p>
            NOVA 8 Percussion gives young percussionists more opportunities to train,
            perform, and grow throughout the year, with a particular focus on the
            months beyond their school marching season. It carries forward the
            discipline and excitement of the marching arts without making trophies,
            rankings, or audition results the purpose of the experience.
          </p>
          <p>
            Students will rehearse toward shared musical goals, receive thoughtful
            instruction, and see their progress in stronger individual and ensemble
            performance.
          </p>
        </div>
      </section>

      <section className="not-competition-section">
        <div className="not-competition-image">
          <ManagedImage media={modelImage} fill sizes="(max-width: 800px) 100vw, 48vw" />
        </div>
        <div className="not-competition-copy">
          <p className="eyebrow light">What noncompetitive means</p>
          <h2>Ambitious does not have to mean exclusive.</h2>
          <p>
            Noncompetitive does not mean casual. NOVA 8 Percussion will hold students to
            meaningful artistic and personal standards while keeping the focus on
            education, progress, and participation.
          </p>
          <div className="comparison-grid">
            <div>
              <h3>We center</h3>
              <ul>
                <li>Growth over ranking</li>
                <li>Feedback over comparison</li>
                <li>Belonging over exclusivity</li>
              </ul>
            </div>
            <div>
              <h3>We preserve</h3>
              <ul>
                <li>Excellent instruction</li>
                <li>Focused rehearsal</li>
                <li>Artistic ambition</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="experience-section">
        <div className="section-heading-row dark-text">
          <div>
            <p className="eyebrow">The student experience</p>
            <h2>What students will develop.</h2>
          </div>
        </div>
        <div className="experience-grid">
          {experience.map(([title, body]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="who-section">
        <div className="who-copy">
          <p className="eyebrow">Who NOVA 8 Percussion is for</p>
          <h2>Young musicians ready for their next season of growth.</h2>
          <p>
            NOVA 8 Percussion is being developed for Central Texas youth with marching
            percussion experience or a serious interest in developing those skills.
            We will consider experience and available space, but advanced skill will
            not be the only measure of potential.
          </p>
          <p className="availability-note">{program.statusMessage}</p>
          <Link className="button button-dark" href="/contact?topic=Student+or+family#contact-form">
            Join the interest list
          </Link>
        </div>
        <div className="who-image">
          <ManagedImage media={audienceImage} fill sizes="(max-width: 800px) 100vw, 48vw" />
        </div>
      </section>

      <CtaBand
        eyebrow="Make NOVA 8 Percussion possible"
        title="Students are ready to keep learning."
        body="The instruments are ready. Your support can fund instructors, staff, rehearsal space, student access, and the operations needed for the first season of NOVA 8 Percussion."
        primaryHref="/support"
        primaryLabel="See what support can do"
        secondaryHref="/impact"
        secondaryLabel="Understand the need"
      />
    </>
  );
}
