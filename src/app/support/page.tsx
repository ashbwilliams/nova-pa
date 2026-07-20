import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/arrow-up-right-icon";
import { ManagedImage } from "@/components/managed-image";
import { PageHero } from "@/components/page-hero";
import { getSiteState } from "@/lib/nova-data";
import { resolveMediaSlot } from "@/lib/nova-media";

export const metadata: Metadata = {
  title: "Support NOVA",
  description:
    "Help NOVA Performing Arts build NOVA 8 Percussion through donations, sponsorship, instruments, rehearsal space, and community partnership.",
};

const priorities = [
  {
    number: "01",
    title: "Instruction & student access",
    body: "Support excellent educators, reduce participation costs, and create financial assistance for students who need it.",
  },
  {
    number: "02",
    title: "Instruments & maintenance",
    body: "Help secure battery instruments, keyboard equipment, electronics, hardware, and the ongoing care that keeps them usable.",
  },
  {
    number: "03",
    title: "A reliable place to rehearse",
    body: "Give students a safe, consistent, geographically practical space for focused ensemble work.",
  },
  {
    number: "04",
    title: "A strong, sustainable organization",
    body: "Strengthen youth safety, insurance, transportation, administration, and the day-to-day operations that make every rehearsal possible.",
  },
];

export default async function SupportPage() {
  const { content } = await getSiteState();
  const heroImage = resolveMediaSlot(content.media, "support.hero");
  const waysImage = resolveMediaSlot(content.media, "support.ways");
  const bannerImage = resolveMediaSlot(content.media, "support.banner");

  return (
    <>
      <PageHero
        eyebrow="Support NOVA"
        title={content.supportHeadline}
        description={content.supportOverview}
        image={heroImage.src}
        imageAlt={heroImage.alt}
        imagePosition={heroImage.objectPosition}
      />

      <section className="support-intro">
        <div>
          <p className="eyebrow">The case for support</p>
          <h2>Students bring the ambition. The community helps create the opportunity.</h2>
        </div>
        <div>
          <p>
            A high-quality percussion program requires far more than music stands and
            rehearsal time. Instruments, facilities, instruction, safety, and student
            assistance all determine who can participate and what NOVA 8 Percussion can become.
          </p>
          <p>
            NOVA is building each part intentionally, with donor and community support
            directed toward the resources that most directly shape the student experience.
          </p>
        </div>
      </section>

      <section className="priority-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow light">Funding priorities</p>
            <h2>Four priorities will make NOVA 8 Percussion possible.</h2>
          </div>
        </div>
        <div className="priority-grid">
          {priorities.map((priority) => (
            <article key={priority.number}>
              <span>{priority.number}</span>
              <h3>{priority.title}</h3>
              <p>{priority.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ways-section">
        <div className="ways-image">
          <ManagedImage media={waysImage} fill sizes="(max-width: 800px) 100vw, 40vw" />
        </div>
        <div className="ways-copy">
          <p className="eyebrow">Ways to help</p>
          <h2>There is more than one way to move NOVA 8 Percussion forward.</h2>
          <div className="ways-list">
            <article>
              <h3>Give</h3>
              <p>Make a charitable contribution or discuss a recurring, major, or designated gift.</p>
            </article>
            <article>
              <h3>Sponsor</h3>
              <p>Support student access, music education, and community impact through your company or foundation.</p>
            </article>
            <article>
              <h3>Equip</h3>
              <p>Donate or loan instruments, or help with maintenance and repairs.</p>
            </article>
            <article>
              <h3>Host</h3>
              <p>Help identify or provide a safe, consistent rehearsal facility in Central Texas.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="partner-banner">
        <div className="partner-banner-image">
          <ManagedImage media={bannerImage} fill sizes="100vw" />
        </div>
        <div className="partner-banner-overlay" />
        <div className="partner-banner-copy">
          <p className="eyebrow light">Founding support</p>
          <h2>Help establish NOVA 8 Percussion for the long term.</h2>
          <p>
            We welcome conversations with individual donors, foundations, businesses,
            school partners, arts organizations, and facility hosts.
          </p>
          <div className="button-row">
            <Link className="button button-accent" href="/contact#contact-form">
              Start a giving conversation
            </Link>
            <Link className="text-link light" href="/contact">
              Other ways to connect <ArrowUpRightIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className="giving-note">
        <p className="eyebrow">NOVA Performing Arts</p>
        <p>
          NOVA Performing Arts is a 501(c)(3) nonprofit organization. Until our online
          donation system is ready, use the secure inquiry form to request giving
          instructions or discuss a contribution.
        </p>
      </section>
    </>
  );
}
