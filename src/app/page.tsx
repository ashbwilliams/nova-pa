import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";

const outcomes = [
  ["Musicianship", "Build technique, listening, timing, and ensemble awareness."],
  ["Confidence", "Develop through focused work, meaningful feedback, and visible progress."],
  ["Belonging", "Find a community of students who care about the same craft."],
  ["Continuity", "Keep learning when the traditional marching season ends."],
];

export default function Home() {
  return (
    <>
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
          <p className="eyebrow light">Central Texas · Youth percussion education</p>
          <h1>More time<br />to grow.</h1>
          <p>
            NOVA Performing Arts is building a noncompetitive, off-season marching
            percussion academy where young musicians can keep developing their craft.
          </p>
          <div className="button-row">
            <Link className="button button-accent" href="/support">
              Help build the academy
            </Link>
            <Link className="text-link light" href="/academy">
              Explore the program <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <div className="hero-index" aria-hidden="true">NOVA</div>
      </section>

      <section className="mission-band">
        <p className="eyebrow">Our purpose</p>
        <p className="mission-statement">
          Talent is everywhere. Access to sustained, high-quality marching arts
          education is not.
        </p>
        <Link className="round-link" href="/about" aria-label="Learn about NOVA">
          <span>About</span>
          <b aria-hidden="true">↗</b>
        </Link>
      </section>

      <section className="editorial-section split-feature">
        <div className="section-index" aria-hidden="true">01</div>
        <div className="feature-copy">
          <p className="eyebrow">The need</p>
          <h2>The season ends.<br />The ambition does not.</h2>
          <p className="lead">
            Many young percussionists want to keep improving after marching season,
            but cost, distance, and competitive selection can put continued training
            out of reach.
          </p>
          <Link className="text-link" href="/impact">
            See the access challenge <span aria-hidden="true">↗</span>
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
          <span aria-hidden="true">02</span>
        </div>
        <div className="academy-copy">
          <p className="eyebrow light">The flagship program</p>
          <h2>A serious academy without the competitive finish line.</h2>
          <p>
            The NOVA Marching Percussion Academy will offer structured instruction,
            ensemble experience, and individual growth during the non-marching season.
            Students can work with purpose without competing for a ranking.
          </p>
          <ul className="check-list light-list">
            <li>Technique and musicianship</li>
            <li>Battery and front ensemble development</li>
            <li>Mentorship and collaborative rehearsal</li>
            <li>A culture centered on growth, safety, and artistry</li>
          </ul>
          <Link className="button button-light" href="/academy">
            Meet the academy
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
            28 total responses. The academy evolves that demonstrated need into an
            accessible, noncompetitive model focused on continued education.
          </p>
        </div>
      </section>

      <CtaBand
        eyebrow="Build what comes next"
        title="Every instrument, rehearsal hour, and scholarship opens another path forward."
        body="NOVA is gathering the partners and resources needed to launch an academy built for students who want to keep going."
        primaryHref="/support"
        primaryLabel="Support NOVA"
        secondaryHref="/contact"
        secondaryLabel="Start a conversation"
      />
    </>
  );
}
