import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";

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

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About NOVA"
        title="An organization built around access."
        description="NOVA Performing Arts is a youth-centered 501(c)(3) nonprofit creating high-quality performing arts opportunities across geographic and socioeconomic boundaries."
        image="/images/rehearsal-overhead.jpg"
        imageAlt="Percussion students and educators rehearsing together"
      />

      <section className="statement-section">
        <div>
          <p className="eyebrow">Our mission</p>
          <h2>Expand access to the marching arts so more young musicians can continue pursuing their potential.</h2>
        </div>
        <div className="statement-body">
          <p>
            We believe a student&apos;s opportunity to grow should not depend on where
            they live, what their school can fund, or whether they are ready to win a
            highly selective audition.
          </p>
          <p>
            NOVA exists to create another path: serious instruction, ambitious
            artistry, and a community where development matters more than placement.
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
          {values.map(([title, body], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="history-section">
        <div className="history-heading">
          <p className="eyebrow">Our history</p>
          <h2>Experience behind a new direction.</h2>
        </div>
        <div className="timeline">
          <article>
            <time>2012</time>
            <div>
              <h3>INOV8 begins</h3>
              <p>An independent percussion organization is founded in Kentucky, establishing the creative and educational roots that would later inform NOVA.</p>
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
              <Image src="/images/ash-williams.jpg" alt="Ash Williams" fill sizes="(max-width: 700px) 100vw, 30vw" />
            </div>
            <div>
              <p className="eyebrow">Founder & Board President</p>
              <h3>Ash Williams</h3>
              <p>
                Ash is a former marching arts educator and touring performer who
                believes movement-based music can build confidence, community, and
                lifelong creative connection.
              </p>
            </div>
          </article>
          <article className="leader-card">
            <div className="leader-image leader-image-james">
              <Image src="/images/james-procell.jpg" alt="James Procell" fill sizes="(max-width: 700px) 100vw, 30vw" />
            </div>
            <div>
              <p className="eyebrow">Board Leadership</p>
              <h3>James Procell</h3>
              <p>
                James is a former band director, music educator, and university music
                librarian with a career grounded in teaching and expanding access to
                musical knowledge.
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
