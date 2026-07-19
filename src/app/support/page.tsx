import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/arrow-up-right-icon";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Support NOVA",
  description:
    "Help NOVA Performing Arts build an accessible marching percussion academy through donations, sponsorship, instruments, rehearsal space, and community partnership.",
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
    title: "A durable organization",
    body: "Strengthen youth safety, insurance, transportation, administration, and the operating foundation behind every rehearsal.",
  },
];

export default function SupportPage() {
  return (
    <>
      <PageHero
        eyebrow="Support NOVA"
        title="Help build the place students keep going."
        description="Your support can turn an off-season gap into months of instruction, mentorship, artistry, and belonging for young percussionists across Central Texas."
        image="/images/ensemble-performance.jpg"
        imageAlt="Young percussionists performing together"
        number="04"
      />

      <section className="support-intro">
        <div>
          <p className="eyebrow">The case for support</p>
          <h2>The students bring the ambition. A community builds the opportunity.</h2>
        </div>
        <div>
          <p>
            A high-quality percussion program requires far more than music stands and
            rehearsal time. Instruments, facilities, instruction, safety, and student
            assistance all determine who can participate and what the academy can become.
          </p>
          <p>
            NOVA is building each part intentionally, with donor and community support
            directed toward the resources students experience most directly.
          </p>
        </div>
      </section>

      <section className="priority-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow light">Funding priorities</p>
            <h2>Four investments create the academy.</h2>
          </div>
          <span className="ghost-number" aria-hidden="true">01</span>
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
          <Image src="/images/community-outreach.jpg" alt="NOVA representatives meeting community members" fill sizes="(max-width: 800px) 100vw, 40vw" />
        </div>
        <div className="ways-copy">
          <p className="eyebrow">Ways to help</p>
          <h2>There is more than one way to move the academy forward.</h2>
          <div className="ways-list">
            <article>
              <h3>Give</h3>
              <p>Make a charitable contribution or discuss a recurring, major, or designated gift.</p>
            </article>
            <article>
              <h3>Sponsor</h3>
              <p>Connect your company or foundation with student access, education, and community impact.</p>
            </article>
            <article>
              <h3>Equip</h3>
              <p>Donate, loan, consign, or help maintain percussion instruments and supporting equipment.</p>
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
          <Image src="/images/austin-skyline.jpg" alt="The Austin skyline representing NOVA's Central Texas community" fill sizes="100vw" />
        </div>
        <div className="partner-banner-overlay" />
        <div className="partner-banner-copy">
          <p className="eyebrow light">Founding support</p>
          <h2>Help establish an academy designed to last.</h2>
          <p>
            We welcome conversations with individual donors, foundations, businesses,
            school partners, arts organizations, and facility hosts.
          </p>
          <div className="button-row">
            <a className="button button-accent" href="mailto:ashbw@pm.me?subject=Supporting%20NOVA%20Performing%20Arts">
              Start a giving conversation
            </a>
            <Link className="text-link light" href="/contact">
              Other ways to connect <ArrowUpRightIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className="giving-note">
        <p className="eyebrow">NOVA Performing Arts</p>
        <p>
          NOVA Performing Arts is a 501(c)(3) nonprofit organization. Formal giving
          instructions and online donation options are available through direct contact
          while our public giving system is completed.
        </p>
      </section>
    </>
  );
}
