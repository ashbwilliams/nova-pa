import type { Metadata } from "next";
import { CtaBand } from "@/components/cta-band";
import { ManagedImage } from "@/components/managed-image";
import { PageHero } from "@/components/page-hero";
import { getSiteState } from "@/lib/nova-data";
import { resolveMediaSlot } from "@/lib/nova-media";

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

export default async function ImpactPage() {
  const { content } = await getSiteState();
  const heroImage = resolveMediaSlot(content.media, "impact.hero");
  const modelImage = resolveMediaSlot(content.media, "impact.model");

  return (
    <>
      <PageHero
        eyebrow="Access & Impact"
        title="Talent is everywhere. Access is not."
        description="Young musicians may have the ambition and work ethic to grow yet still face financial, geographic, and instructional barriers they cannot overcome alone."
        image={heroImage.src}
        imageAlt={heroImage.alt}
        imagePosition={heroImage.objectPosition}
      />

      <section className="barriers-section">
        <div className="barriers-heading">
          <p className="eyebrow light">The access challenge</p>
          <h2>Three barriers close too many doors.</h2>
          <p>
            Competitive independent ensembles can provide transformative experiences,
            but their cost, distance, and audition process leave many students without a
            practical path for continued development.
          </p>
        </div>
        <div className="barrier-grid">
          <article>
            <h3>Finances</h3>
            <p>Instruction, rehearsal facilities, transportation, and participation fees can make sustained percussion education expensive.</p>
          </article>
          <article>
            <h3>Geography</h3>
            <p>Many established programs are too far from Central Texas students to make regular travel realistic for families.</p>
          </article>
          <article>
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
            their students&apos; participation in a local independent percussion program.
            NOVA 8 Percussion responds to that need with a more accessible,
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
          <ManagedImage media={modelImage} fill sizes="(max-width: 800px) 100vw, 42vw" />
        </div>
        <div className="impact-model-copy">
          <p className="eyebrow">The NOVA 8 Percussion response</p>
          <h2>Remove barriers. Keep standards high.</h2>
          <p>
            NOVA 8 Percussion is designed to open high-quality instruction to more
            students while preserving meaningful artistic work.
          </p>
          <ul className="impact-actions">
            <li><strong>Bring instruction closer</strong><span>Create a Central Texas program that families can realistically reach.</span></li>
            <li><strong>Make participation affordable</strong><span>Use donor support to reduce participation costs and provide assistance.</span></li>
            <li><strong>Welcome developing talent</strong><span>Structure learning around growth rather than a single high-stakes audition.</span></li>
            <li><strong>Create continuity</strong><span>Give students a reason and a place to keep practicing after marching season.</span></li>
          </ul>
        </div>
      </section>

      <section className="measurement-section">
        <div>
          <p className="eyebrow light">Accountability</p>
          <h2>We will measure participation, growth, and reach.</h2>
        </div>
        <ul>
          {measures.map((measure) => (
            <li key={measure}>
              {measure}
            </li>
          ))}
        </ul>
      </section>

      <CtaBand
        title="Access becomes impact when a student can actually participate."
        body="Help NOVA turn local need into rehearsal hours, excellent instruction, student access, and a lasting community for young musicians."
        primaryHref="/support"
        primaryLabel="Invest in access"
        secondaryHref="/contact?topic=Community+partner#contact-form"
        secondaryLabel="Discuss a partnership"
      />
    </>
  );
}
