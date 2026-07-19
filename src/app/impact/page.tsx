import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Access & Impact",
  description:
    "See the barriers facing Central Texas youth percussionists and how NOVA 8 Percussion can create continued access, development, and belonging.",
};

const measures = [
  "Students served and scholarships provided",
  "Schools and Central Texas communities represented",
  "Hours of high-quality instruction delivered",
  "Student retention and continued participation",
  "Growth reported by students, families, and educators",
];

export default function ImpactPage() {
  return (
    <>
      <PageHero
        eyebrow="Access & Impact"
        title="Talent is everywhere. Access is not."
        description="Young musicians can have the ambition and work ethic to grow while still facing financial, geographic, and instructional barriers they cannot overcome alone."
        image="/images/outdoor-ensemble.jpg"
        imageAlt="A youth percussion ensemble rehearsing outdoors"
        number="03"
      />

      <section className="barriers-section">
        <div className="barriers-heading">
          <p className="eyebrow light">The access challenge</p>
          <h2>Three barriers close too many doors.</h2>
          <p>
            Competitive independent ensembles can provide transformative experiences,
            but their cost, location, and selection model leave many students without a
            practical path for continued development.
          </p>
        </div>
        <div className="barrier-grid">
          <article>
            <span>01</span>
            <h3>Finances</h3>
            <p>Instruments, instruction, facilities, transportation, and participation fees make sustained percussion education expensive.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Geography</h3>
            <p>Many established opportunities are concentrated far from students in Central Texas, making regular travel unrealistic for families.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Skill level</h3>
            <p>Highly selective auditions can exclude developing musicians who would benefit most from additional instruction and ensemble experience.</p>
          </article>
        </div>
      </section>

      <section className="proof-section">
        <div className="proof-stat">
          <span>93%</span>
          <p>support for student participation</p>
        </div>
        <div className="proof-copy">
          <p className="eyebrow">Evidence of local need</p>
          <h2>Central Texas educators have already told us the opportunity matters.</h2>
          <p>
            In an earlier NOVA survey, 93% of 28 responding band directors supported
            their students participating in a local independent percussion opportunity.
            NOVA 8 Percussion translates that affirmed need into a more accessible,
            noncompetitive educational model.
          </p>
          <blockquote>
            “Creating opportunities for students in Central Texas, especially those
            who are economically disadvantaged, is huge.”
            <cite>Central Texas band director survey response</cite>
          </blockquote>
        </div>
      </section>

      <section className="impact-model-section">
        <div className="impact-model-image">
          <Image src="/images/mallets-hands.jpg" alt="A percussionist performing on a marimba" fill sizes="(max-width: 800px) 100vw, 42vw" />
          <span aria-hidden="true">04</span>
        </div>
        <div className="impact-model-copy">
          <p className="eyebrow">The NOVA 8 Percussion response</p>
          <h2>Remove the barrier. Keep the standard.</h2>
          <p>
            NOVA 8 Percussion is designed to widen the entry point while preserving
            high-quality teaching and meaningful artistic work.
          </p>
          <ul className="impact-actions">
            <li><strong>Bring instruction closer</strong><span>Create a Central Texas program that families can realistically reach.</span></li>
            <li><strong>Build financial access</strong><span>Use donor support to reduce participation costs and provide assistance.</span></li>
            <li><strong>Welcome developing talent</strong><span>Structure learning around growth rather than a single high-stakes audition.</span></li>
            <li><strong>Create continuity</strong><span>Give students a reason and a place to keep practicing after marching season.</span></li>
          </ul>
        </div>
      </section>

      <section className="measurement-section">
        <div>
          <p className="eyebrow light">Accountability</p>
          <h2>We will measure what access makes possible.</h2>
        </div>
        <ul>
          {measures.map((measure, index) => (
            <li key={measure}>
              <span>0{index + 1}</span>
              {measure}
            </li>
          ))}
        </ul>
      </section>

      <CtaBand
        title="Access becomes impact when a student can actually participate."
        body="Help NOVA turn local need into rehearsal hours, instruction, equipment, and a lasting community for young musicians."
        primaryHref="/support"
        primaryLabel="Invest in access"
        secondaryHref="/contact"
        secondaryLabel="Discuss a partnership"
      />
    </>
  );
}
