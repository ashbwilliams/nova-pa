import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { getSiteState } from "@/lib/nova-data";

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

  return (
    <>
      <PageHero
        eyebrow="A program of NOVA Performing Arts"
        title="NOVA 8 Percussion"
        description={`${content.academyHeadline} ${content.academyOverview}`}
        image="/images/cymbal-performer.jpg"
        imageAlt="A young cymbal performer viewed during a rehearsal"
        number="02"
      />

      <section className="program-status-section" aria-labelledby="program-status-heading">
        <div className="program-status-heading">
          <p className="eyebrow">Current NOVA 8 Percussion status</p>
          <h2 id="program-status-heading">{program.statusLabel}</h2>
          <p>{program.statusMessage}</p>
          {program.interestOpen ? (
            <Link className="button button-dark" href="/contact#contact-form">
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
            placement, or selective ranking the purpose of the experience.
          </p>
          <p>
            Students will rehearse toward shared musical goals, receive thoughtful
            instruction, and see their progress through the work itself.
          </p>
        </div>
      </section>

      <section className="not-competition-section">
        <div className="not-competition-image">
          <Image src="/images/battery-instruments.jpg" alt="Marching percussion drums arranged in a rehearsal space" fill sizes="(max-width: 800px) 100vw, 48vw" />
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
            <h2>Six dimensions of continued development.</h2>
          </div>
          <span className="ghost-number dark-ghost" aria-hidden="true">03</span>
        </div>
        <div className="experience-grid">
          {experience.map(([title, body], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
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
            percussion experience or a serious interest in building it. The final
            structure will account for experience level and program capacity without
            treating advanced skill as the only measure of potential.
          </p>
          <p className="availability-note">{program.statusMessage}</p>
          <Link className="button button-dark" href="/contact">
            Join the interest list
          </Link>
        </div>
        <div className="who-image">
          <Image src="/images/music-clinic.jpg" alt="Students taking part in a percussion clinic" fill sizes="(max-width: 800px) 100vw, 48vw" />
        </div>
      </section>

      <CtaBand
        eyebrow="Make NOVA 8 Percussion possible"
        title="Students are ready to keep learning."
        body="Your support can help secure instruments, rehearsal space, instruction, and student assistance for the first season of NOVA 8 Percussion."
        primaryHref="/support"
        primaryLabel="See what support can do"
        secondaryHref="/impact"
        secondaryLabel="Understand the need"
      />
    </>
  );
}
