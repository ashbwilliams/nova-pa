import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/arrow-up-right-icon";
import { CtaBand } from "@/components/cta-band";
import { getSiteState } from "@/lib/nova-data";

const outcomes = [
  ["Musicianship", "Build technique, listening, timing, and ensemble awareness."],
  ["Confidence", "Develop through focused work, meaningful feedback, and visible progress."],
  ["Belonging", "Find a community of students who care about the same craft."],
  ["Continuity", "Keep learning and growing beyond the school marching season."],
];

export default async function Home() {
  const { content } = await getSiteState();

  return (
    <>
      {content.announcementEnabled && content.announcementText ? (
        <div className="announcement-bar" role="status">
          <span>News</span>
          <p>{content.announcementText}</p>
        </div>
      ) : null}
      <section className="home-hero">
        <div className="home-hero-media">
          <Image
            src="/images/hero-percussion.jpg"
            alt="Young percussionists performing in an ensemble"
            fill
            sizes="100vw"
            priority
          />
        </div>
        <div className="home-hero-overlay" />
        <div className="home-hero-copy">
          <p className="eyebrow light">NOVA 8 Percussion · A program of NOVA Performing Arts</p>
          <h1>More time<br />to grow.</h1>
          <p>{content.homeHeroBody}</p>
          <div className="button-row">
            <Link className="button button-accent" href="/support">
              Help build NOVA 8 Percussion
            </Link>
            <Link className="text-link light" href="/nova-8">
              Explore NOVA 8 Percussion <ArrowUpRightIcon />
            </Link>
          </div>
        </div>
        <div className="hero-index" aria-hidden="true">NOVA</div>
      </section>

      <section className="mission-band">
        <p className="eyebrow">Our purpose</p>
        <p className="mission-statement">{content.missionStatement}</p>
        <Link className="text-link mission-link" href="/about">
          About NOVA
          <ArrowUpRightIcon />
        </Link>
      </section>

      <section className="home-event-feature">
        <div className="home-event-image">
          <Image
            src="/images/rehearsal-overhead.jpg"
            alt="A percussion ensemble arranged in a rehearsal space"
            fill
            sizes="(max-width: 820px) 100vw, 50vw"
          />
        </div>
        <div className="home-event-copy">
          <p className="eyebrow light">A new hands-on NOVA experience</p>
          <h2>Percussion Playground</h2>
          <p>
            Don’t just watch the ensemble. Step inside it, try the instruments,
            learn a musical part, and discover how the whole sound comes together.
          </p>
          <p className="home-event-status">Dates and location are being planned.</p>
          <Link className="button button-light" href="/percussion-playground">
            Explore Percussion Playground
          </Link>
        </div>
      </section>

      <section className="editorial-section split-feature">
        <div className="feature-copy">
          <p className="eyebrow">The need</p>
          <h2>The season ends.<br />The ambition does not.</h2>
          <p className="lead">
            Many young percussionists want to keep improving after marching season,
            but cost, distance, and competitive selection can put continued training
            out of reach.
          </p>
          <Link className="text-link" href="/impact">
            See the access challenge <ArrowUpRightIcon />
          </Link>
        </div>
        <div className="feature-image tall-image">
          <Image
            src="/images/students-together.jpg"
            alt="Young musicians gathered together during rehearsal"
            fill
            sizes="(max-width: 800px) 100vw, 42vw"
          />
        </div>
      </section>

      <section className="academy-feature">
        <div className="academy-image">
          <Image
            src="/images/mallet-rehearsal.jpg"
            alt="A student rehearsing on a keyboard percussion instrument"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
        <div className="academy-copy">
          <p className="eyebrow light">NOVA 8 Percussion · The flagship program</p>
          <h2>Serious development without the competitive finish line.</h2>
          <p>
            NOVA 8 Percussion will offer structured instruction,
            ensemble experience, and individual growth for more of the year, with an
            emphasis on the months beyond the school marching season. Students can
            work with purpose without competing for a ranking.
          </p>
          <p className="academy-name-story">
            Named for the final count before an ensemble begins, NOVA 8 prepares
            young musicians for what comes next.
          </p>
          <ul className="check-list light-list">
            <li>Technique and musicianship</li>
            <li>Battery and front ensemble development</li>
            <li>Mentorship and collaborative rehearsal</li>
            <li>A culture centered on growth, safety, and artistry</li>
          </ul>
          <Link className="button button-light" href="/nova-8">
            Meet NOVA 8 Percussion
          </Link>
        </div>
      </section>

      <section className="outcomes-section">
        <div className="outcomes-heading">
          <p className="eyebrow">What access creates</p>
          <h2>Development that carries beyond rehearsal.</h2>
        </div>
        <div className="outcomes-grid">
          {outcomes.map(([title, body], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="evidence-section">
        <div className="evidence-image">
          <Image
            src="/images/conductor.jpg"
            alt="An educator conducting a musical ensemble"
            fill
            sizes="(max-width: 800px) 100vw, 42vw"
          />
        </div>
        <div className="evidence-copy">
          <p className="eyebrow light">A need heard across Central Texas</p>
          <p className="evidence-number">93<span>%</span></p>
          <p className="evidence-lead">
            of band directors surveyed by NOVA supported student participation in a
            local independent percussion opportunity.
          </p>
          <p className="fine-print">
            28 total responses. NOVA 8 Percussion responds to that demonstrated need
            with an accessible, noncompetitive model focused on continued education.
          </p>
        </div>
      </section>

      <CtaBand
        eyebrow="Build what comes next"
        title="Every instrument, rehearsal hour, and scholarship opens another path forward."
        body="NOVA is gathering the partners and resources needed to launch NOVA 8 Percussion for students who want to keep going."
        primaryHref="/support"
        primaryLabel="Support NOVA"
        secondaryHref="/contact"
        secondaryLabel="Start a conversation"
      />
    </>
  );
}
