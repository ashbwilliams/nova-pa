import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/arrow-up-right-icon";
import { CtaBand } from "@/components/cta-band";
import { ManagedImage } from "@/components/managed-image";
import { getSiteState } from "@/lib/nova-data";
import { resolveMediaSlot } from "@/lib/nova-media";

const outcomes = [
  ["Musicianship", "Build technique, listening, timing, and ensemble awareness."],
  ["Confidence", "Develop through focused work, meaningful feedback, and visible progress."],
  ["Belonging", "Find a community of students who care about the same craft."],
  ["Continuity", "Keep learning and growing beyond the school marching season."],
];

export default async function Home() {
  const { content } = await getSiteState();
  const heroImage = resolveMediaSlot(content.media, "home.hero");
  const playgroundImage = resolveMediaSlot(content.media, "home.playground");
  const needImage = resolveMediaSlot(content.media, "home.need");
  const nova8Image = resolveMediaSlot(content.media, "home.nova8");
  const evidenceImage = resolveMediaSlot(content.media, "home.evidence");

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
          <ManagedImage
            media={heroImage}
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
          <ManagedImage
            media={needImage}
            fill
            sizes="(max-width: 800px) 100vw, 42vw"
          />
        </div>
      </section>

      <section className="academy-feature">
        <div className="academy-image">
          <ManagedImage
            media={nova8Image}
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
          {outcomes.map(([title, body]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="evidence-section">
        <div className="evidence-image">
          <ManagedImage
            media={evidenceImage}
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

      <section className="home-event-feature">
        <div className="home-event-image">
          <ManagedImage
            media={playgroundImage}
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

      <CtaBand
        eyebrow="Build what comes next"
        title="The instruments are ready. Now we bring the program to life."
        body="NOVA is gathering support for instructors, salaries, rehearsal space, student access, and the operations needed to launch NOVA 8 Percussion."
        primaryHref="/support"
        primaryLabel="Support NOVA"
        secondaryHref="/contact"
        secondaryLabel="Start a conversation"
      />
    </>
  );
}
