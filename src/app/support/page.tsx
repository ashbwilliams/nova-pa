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
    "Help NOVA Performing Arts fund instruction, educator and staff salaries, student access, rehearsal space, and sustainable operations for NOVA 8 Percussion.",
};

const priorities = [
  {
    title: "Excellent instructors",
    body: "Fund experienced educators and teaching staff who can give students consistent, thoughtful instruction.",
  },
  {
    title: "Educator & staff salaries",
    body: "Build a reliable team by compensating the people who teach, coordinate, communicate, and care for the program.",
  },
  {
    title: "A reliable place to rehearse",
    body: "Give students a safe, consistent, geographically practical space for focused ensemble work.",
  },
  {
    title: "Student access & operations",
    body: "Reduce participation barriers while supporting youth safety, insurance, administration, and the work behind every rehearsal.",
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
            NOVA already has the instruments needed to begin. The next step is funding
            the people, time, and place that transform those instruments into a
            dependable educational experience.
          </p>
          <p>
            Community support will go directly toward instructors, educator and staff
            salaries, rehearsal space, student access, youth safety, and the daily
            operations that make every rehearsal possible. No capital investment in
            instruments is needed.
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
            <article key={priority.title}>
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
              <h3>Invest in people</h3>
              <p>Help NOVA hire and retain excellent instructors, staff, and program leadership.</p>
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
            school partners, arts organizations, and rehearsal-space hosts.
          </p>
          <div className="button-row">
            <Link className="button button-accent" href="/contact?topic=Donor+or+sponsor#contact-form">
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
