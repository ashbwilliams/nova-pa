import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/arrow-up-right-icon";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { getSiteState } from "@/lib/nova-data";
import { resolveMediaSlot } from "@/lib/nova-media";

export const metadata: Metadata = {
  title: "NOVA 8 Teaching Fellowship",
  description:
    "The NOVA 8 Teaching Fellowship gives advanced percussionists structured, mentored teaching experience through partnerships with collegiate studios and leading percussion ensembles.",
};

const teachingSkills = [
  ["Explain", "Translate advanced technique into clear, useful instruction."],
  ["Plan", "Set objectives and build sectionals or rehearsal segments around them."],
  ["Adapt", "Respond to different ages, experience levels, and ways of learning."],
  ["Lead", "Set a productive pace while sustaining focus, trust, and belonging."],
  ["Assess", "Notice what students need and give specific, constructive feedback."],
  ["Reflect", "Use observation and mentorship to improve from one rehearsal to the next."],
];

const fellowProgression = [
  ["Observe", "Learn the program, students, curriculum, and expectations alongside the lead educator."],
  ["Contribute", "Support fundamentals, individual feedback, and clearly defined rehearsal tasks."],
  ["Teach", "Lead sectionals or planned rehearsal segments with preparation and supervision."],
  ["Reflect", "Review the work with a mentor, identify what succeeded, and set the next teaching goal."],
];

export default async function TeachingFellowshipPage() {
  const { content } = await getSiteState();
  const heroImage = resolveMediaSlot(content.media, "fellowship.hero");

  return (
    <>
      <PageHero
        eyebrow="Developing the next generation of percussion educators"
        title="NOVA 8 Teaching Fellowship"
        description="Advanced performers gain structured, mentored experience teaching young musicians. NOVA 8 students gain thoughtful instruction from accomplished percussionists who are learning how to lead with clarity, care, and purpose."
        image={heroImage.src}
        imageAlt={heroImage.alt}
        imagePosition={heroImage.objectPosition}
      />

      <section className="fellowship-intro">
        <div>
          <p className="eyebrow">From performer to educator</p>
          <h2>Teaching is a craft of its own.</h2>
        </div>
        <div className="fellowship-intro-copy">
          <p>
            Collegiate studios and high-level ensembles develop exceptional
            percussionists. Many of those performers will eventually teach lessons,
            lead sectionals, work with school programs, or direct ensembles, yet
            meaningful teaching experience can be difficult to gain before those
            responsibilities begin.
          </p>
          <p>
            The NOVA 8 Teaching Fellowship bridges that gap. Fellows work beside an
            experienced lead educator in a real ensemble setting, with defined
            responsibilities, purposeful preparation, and regular feedback. They do
            not independently run the program. Responsibility grows as each fellow
            demonstrates readiness.
          </p>
        </div>
      </section>

      <section className="fellowship-skills-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow light">What fellows develop</p>
            <h2>Performance knowledge becomes teaching practice.</h2>
          </div>
        </div>
        <div className="fellowship-skills-grid">
          {teachingSkills.map(([title, body]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="partnership-section">
        <div className="partnership-heading">
          <p className="eyebrow">Institutional instructional partnerships</p>
          <h2>A reciprocal relationship, built around shared educational goals.</h2>
          <p>
            NOVA 8 is not asking a partner to supply free labor or take responsibility
            for operating a youth program. The partnership combines what each
            organization is best positioned to provide. Together, we create a
            stronger learning environment for young musicians and a practical
            development pathway for emerging educators.
          </p>
        </div>

        <div className="partnership-exchange" aria-label="Partnership responsibilities">
          <article>
            <p className="partnership-label">NOVA provides</p>
            <h3>The teaching environment</h3>
            <ul>
              <li>A consistent ensemble in which fellows can build real relationships and skills</li>
              <li>An experienced lead educator responsible for curriculum and instructional quality</li>
              <li>Defined assignments, observation, mentorship, and practical feedback</li>
              <li>Youth-safety orientation, required screening, and clear professional boundaries</li>
              <li>Program operations, instruments, family communication, and organizational accountability</li>
            </ul>
          </article>
          <article>
            <p className="partnership-label">The partner provides</p>
            <h3>The talent pipeline and institutional connection</h3>
            <ul>
              <li>Help identifying advanced performers with the musicianship, maturity, and interest to teach</li>
              <li>A faculty, staff, or ensemble liaison who helps align the experience with participant goals</li>
              <li>Artistic or educational guidance that strengthens fellow development</li>
              <li>Periodic mentorship, observation, or feedback when appropriate</li>
              <li>Practical collaboration on logistics where the partner has useful capacity</li>
            </ul>
          </article>
        </div>

        <div className="logistics-band">
          <div>
            <p className="eyebrow light">A flexible contribution</p>
            <h3>Logistical support can take different forms.</h3>
          </div>
          <p>
            Depending on the partner, collaboration might include rehearsal-space
            access, scheduling coordination, equipment or storage support,
            transportation planning, recruitment, communications, guest instruction,
            fellowship stipends or joint funding efforts, or connections to other
            educational resources. No partner is expected to provide every form of
            support. The agreement should reflect the strengths and limits of both
            organizations.
          </p>
        </div>
      </section>

      <section className="fellowship-benefits-section">
        <div className="section-heading-row dark-text">
          <div>
            <p className="eyebrow">What the partnership creates</p>
            <h2>Value that moves in both directions.</h2>
          </div>
        </div>
        <div className="fellowship-benefits-grid">
          <article>
            <p className="benefit-audience">For fellows</p>
            <h3>Experience before independence</h3>
            <p>Meaningful teaching responsibility, professional feedback, and evidence of growth as an educator.</p>
          </article>
          <article>
            <p className="benefit-audience">For partner organizations</p>
            <h3>A stronger educator pathway</h3>
            <p>Expanded professional development, visible community engagement, and deeper connections with regional students and educators.</p>
          </article>
          <article>
            <p className="benefit-audience">For NOVA 8 students</p>
            <h3>More excellent adults in the room</h3>
            <p>Individual attention, current performance insight, and additional mentors working within a consistent instructional model.</p>
          </article>
          <article>
            <p className="benefit-audience">For Central Texas</p>
            <h3>A growing teaching community</h3>
            <p>More capable percussion educators prepared to serve school programs, private students, and ensembles throughout the region.</p>
          </article>
        </div>
      </section>

      <section className="fellowship-progression-section">
        <div className="fellowship-progression-heading">
          <p className="eyebrow light">A supervised progression</p>
          <h2>Responsibility grows with readiness.</h2>
          <p>
            A fellowship can begin as a small pilot with a limited cohort and one
            rehearsal cycle. NOVA and the partner establish expectations in advance,
            then evaluate the experience with fellows, mentors, students, and
            families before expanding it. A successful pilot could remain an
            extracurricular fellowship or develop into a recognized field experience,
            internship, or practicum when that structure serves both partners.
          </p>
        </div>
        <ol className="fellowship-progression">
          {fellowProgression.map(([title, body], index) => (
            <li key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="fellowship-interest-section">
        <div>
          <p className="eyebrow">Who can participate</p>
          <h2>Built for institutions, ensembles, and emerging educators.</h2>
        </div>
        <div className="fellowship-interest-paths">
          <article>
            <h3>Build an institutional instructional partnership</h3>
            <p>
              NOVA welcomes conversations with collegiate percussion studios,
              independent ensembles, professional organizations, and other groups
              that develop advanced percussionists.
            </p>
            <Link href="/contact?topic=School+or+educator#contact-form">
              Explore a partnership <ArrowUpRightIcon />
            </Link>
          </article>
          <article>
            <h3>Express interest as a fellow</h3>
            <p>
              Strong musicianship, maturity, reliability, and a willingness to learn
              are essential. Prior teaching experience is helpful, but it is not the
              purpose of the fellowship.
            </p>
            <Link href="/contact?topic=School+or+educator#contact-form">
              Introduce yourself <ArrowUpRightIcon />
            </Link>
          </article>
        </div>
      </section>

      <CtaBand
        eyebrow="Build the teaching pipeline"
        title="Better teaching begins with a place to learn it."
        body="If your studio or ensemble wants to help advanced percussionists become thoughtful educators, NOVA would welcome a conversation about a pilot partnership."
        primaryHref="/contact?topic=School+or+educator#contact-form"
        primaryLabel="Start a partnership conversation"
        secondaryHref="/nova-8"
        secondaryLabel="Explore NOVA 8 Percussion"
      />
    </>
  );
}
