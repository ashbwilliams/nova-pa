import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/arrow-up-right-icon";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { getSiteState } from "@/lib/nova-data";
import { resolveMediaSlot } from "@/lib/nova-media";

export const metadata: Metadata = {
  title: "Partnership Opportunities",
  description:
    "Explore ways institutions, ensembles, educators, community organizations, and businesses can partner with NOVA Performing Arts.",
};

const opportunities = [
  {
    title: "Institutional instructional partnerships",
    body: "Collegiate studios and other high-level ensembles help connect advanced performers and practical resources to NOVA 8. In return, NOVA provides structured, mentored teaching-development opportunities through the NOVA 8 Teaching Fellowship.",
    href: "/institutional-instructional-partnerships",
    action: "Explore institutional partnerships",
  },
  {
    title: "Rehearsal home partnerships",
    body: "Schools, universities, churches, arts organizations, and community facilities can help provide a safe, consistent place for NOVA 8 to learn, rehearse, and grow.",
  },
  {
    title: "School and educator partnerships",
    body: "NOVA works alongside school programs through student referrals, schedule coordination, clinics, educator dialogue, and supplemental instruction that helps students return stronger.",
  },
  {
    title: "Artistic and ensemble partnerships",
    body: "Guest artists and leading ensembles can contribute clinics, coaching, open rehearsals, collaborative experiences, and connections to the wider percussion community.",
  },
  {
    title: "Community access partnerships",
    body: "Youth-serving and cultural organizations can connect NOVA with students and families, host introductory experiences, and help reduce barriers to participation.",
  },
  {
    title: "Program and event partnerships",
    body: "Businesses, foundations, civic groups, and professional partners can support instruction, student access, operations, Percussion Playground, and other shared community experiences.",
  },
];

export default async function PartnershipsPage() {
  const { content } = await getSiteState();
  const heroImage = resolveMediaSlot(content.media, "partnerships.hero");

  return (
    <>
      <PageHero
        eyebrow="Partnership opportunities"
        title="What could we build together?"
        description="NOVA Performing Arts develops reciprocal partnerships that create more opportunities for young musicians, emerging educators, and the organizations that support them."
        image={heroImage.src}
        imageAlt={heroImage.alt}
        imagePosition={heroImage.objectPosition}
      />

      <section className="partnerships-intro">
        <div>
          <p className="eyebrow">A reciprocal approach</p>
          <h2>Shared strengths. Shared educational impact.</h2>
        </div>
        <p>
          Every partnership begins with a common objective. NOVA brings youth
          programming, percussion expertise, instruments, and organizational
          structure. Our partners contribute the people, places, relationships, or
          resources they are best positioned to share. Each collaboration is shaped
          around mutual benefit and practical capacity.
        </p>
      </section>

      <section className="partnership-opportunities-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow light">Ways to partner</p>
            <h2>Several paths. One shared purpose.</h2>
          </div>
        </div>
        <div className="partnership-opportunities-grid">
          {opportunities.map((opportunity, index) => (
            <article key={opportunity.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{opportunity.title}</h3>
              <p>{opportunity.body}</p>
              {opportunity.href && (
                <Link href={opportunity.href}>
                  {opportunity.action} <ArrowUpRightIcon />
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      <CtaBand
        eyebrow="Start with a conversation"
        title="The strongest partnerships are designed together."
        body="If your organization develops performers, serves young people, provides space, supports the arts, or wants to invest in music education, we would welcome a conversation about what we could build together."
        primaryHref="/contact?topic=Community+partner#contact-form"
        primaryLabel="Explore a partnership"
        secondaryHref="/about"
        secondaryLabel="Learn about NOVA"
      />
    </>
  );
}
