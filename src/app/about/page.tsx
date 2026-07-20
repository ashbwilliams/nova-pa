import type { Metadata } from "next";
import { CtaBand } from "@/components/cta-band";
import { ManagedImage } from "@/components/managed-image";
import { PageHero } from "@/components/page-hero";
import { getSiteState } from "@/lib/nova-data";
import { resolveMediaSlot } from "@/lib/nova-media";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about NOVA Performing Arts, our mission, values, history, and the people building greater access to youth performing arts education.",
};

const values = [
  ["Growth", "We meet students where they are and give them the instruction, feedback, and room to progress."],
  ["Safety", "Physical and emotional safety are foundational to every rehearsal, relationship, and decision."],
  ["Professionalism", "We model preparation, respect, accountability, and care for the people and spaces around us."],
  ["Artistry", "We teach technique in service of expression, curiosity, and meaningful musical experiences."],
];

export default async function AboutPage() {
  const { content } = await getSiteState();
  const heroImage = resolveMediaSlot(content.media, "about.hero");
  const ashImage = resolveMediaSlot(content.media, "about.ash");
  const jamesImage = resolveMediaSlot(content.media, "about.james");

  return (
    <>
      <PageHero
        eyebrow="About NOVA"
        title="An organization built around access."
        description="NOVA Performing Arts is a youth-centered 501(c)(3) nonprofit creating high-quality performing arts opportunities regardless of where students live or what their families can afford."
        image={heroImage.src}
        imageAlt={heroImage.alt}
        imagePosition={heroImage.objectPosition}
      />

      <section className="statement-section">
        <div>
          <p className="eyebrow">Our mission</p>
          <h2>Expand access to the marching arts so more young musicians can keep learning, performing, and growing.</h2>
        </div>
        <div className="statement-body">
          <p>
            We believe a student&apos;s opportunity to grow should not depend on where
            they live, what their school can fund, or whether they can earn a place
            through a highly selective audition.
          </p>
          <p>
            NOVA exists to create another path: serious instruction, high artistic
            standards, and a community where development matters more than placement.
          </p>
        </div>
      </section>

      <section className="values-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow light">How we work</p>
            <h2>Four values shape every program.</h2>
          </div>
        </div>
        <div className="values-grid">
          {values.map(([title, body]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="history-section">
        <div className="history-heading">
          <p className="eyebrow">Our history</p>
          <h2>Built on experience. Focused on what comes next.</h2>
        </div>
        <div className="timeline">
          <article>
            <time>2012</time>
            <div>
              <h3>INOV8 begins</h3>
              <p>An independent percussion organization is founded in Kentucky, establishing educational and artistic roots that would later help shape NOVA.</p>
            </div>
          </article>
          <article>
            <time>2023</time>
            <div>
              <h3>NOVA Performing Arts</h3>
              <p>NOVA is established as a nonprofit organization with a commitment to expanding access to the marching arts in Central Texas.</p>
            </div>
          </article>
          <article>
            <time>Now</time>
            <div>
              <h3>NOVA 8 Percussion takes shape</h3>
              <p>NOVA is channeling its experience and INOV8 roots into NOVA 8 Percussion, a noncompetitive marching percussion development program centered on education, access, and sustained student growth across seasons.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="leadership-section">
        <div className="section-heading-row dark-text">
          <div>
            <p className="eyebrow">Leadership</p>
            <h2>Educators and advocates who believe in the power of performance.</h2>
          </div>
        </div>
        <div className="leader-grid">
          <article className="leader-card">
            <div className="leader-image">
              <ManagedImage media={ashImage} fill sizes="(max-width: 700px) 100vw, 30vw" />
            </div>
            <div>
              <p className="eyebrow">Founder & Board President</p>
              <h3>Ash Williams</h3>
              <p>
                Ash is a former marching arts educator and touring performer who
                believes the marching arts can build confidence, community, and
                lifelong creative connections.
              </p>
            </div>
          </article>
          <article className="leader-card">
            <div className="leader-image leader-image-james">
              <ManagedImage media={jamesImage} fill sizes="(max-width: 700px) 100vw, 30vw" />
            </div>
            <div>
              <p className="eyebrow">Board Leadership</p>
              <h3>James Procell</h3>
              <p>
                James is a former band director, music educator, and university music
                librarian with a career devoted to teaching and making musical
                knowledge more accessible.
              </p>
            </div>
          </article>
        </div>
        <div className="governance-list">
          <div>
            <p className="eyebrow">Board of Directors</p>
            <p>Ash Williams · James Procell</p>
          </div>
          <div>
            <p className="eyebrow">Artistic & Educational Advisors</p>
            <p>Dave Isaacs · Jason Moncrief · Kit Chatham · George Pinney</p>
          </div>
        </div>
      </section>

      <CtaBand
        title="NOVA is building for the long term."
        body="NOVA 8 Percussion is our first major program, and a foundation for future youth performing arts opportunities across Central Texas."
        primaryHref="/support"
        primaryLabel="Help build the foundation"
        secondaryHref="/nova-8"
        secondaryLabel="Explore NOVA 8 Percussion"
      />
    </>
  );
}
