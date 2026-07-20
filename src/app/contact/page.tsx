import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/arrow-up-right-icon";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { getSiteState } from "@/lib/nova-data";
import { resolveMediaSlot } from "@/lib/nova-media";
import { inquiryTopics, type InquiryTopic } from "@/lib/nova-types";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact NOVA Performing Arts about NOVA 8 Percussion, student interest, donations, sponsorships, rehearsal space, instruction, operations, or community partnership.",
};

const contactPaths = [
  {
    title: "Students & families",
    topic: "Student or family" as InquiryTopic,
    body: "Ask about NOVA 8 Percussion or be notified when program dates, location, costs, and participation details are available.",
    action: "Express interest",
  },
  {
    title: "Donors & sponsors",
    topic: "Donor or sponsor" as InquiryTopic,
    body: "Discuss charitable giving, founding support, sponsorship, or a contribution directed to a particular program need.",
    action: "Discuss support",
  },
  {
    title: "Schools & educators",
    topic: "School or educator" as InquiryTopic,
    body: "Connect about student referrals, regional need, educational partnership, clinics, or collaboration with school music programs.",
    action: "Connect as an educator",
  },
  {
    title: "Community partners",
    topic: "Community partner" as InquiryTopic,
    body: "Talk with us about rehearsal facilities, event partnerships, professional expertise, operations, or other community resources.",
    action: "Explore a partnership",
  },
];

type ContactPageProps = {
  searchParams: Promise<{ topic?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const requestedTopic = (await searchParams).topic;
  const initialTopic = inquiryTopics.includes(requestedTopic as InquiryTopic)
    ? (requestedTopic as InquiryTopic)
    : "";
  const { content } = await getSiteState();
  const heroImage = resolveMediaSlot(content.media, "contact.hero");

  return (
    <>
      <PageHero
        eyebrow="Contact NOVA"
        title={content.contactHeadline}
        description={content.contactIntro}
        image={heroImage.src}
        imageAlt={heroImage.alt}
        imagePosition={heroImage.objectPosition}
      />

      <section className="contact-section">
        <div className="contact-intro">
          <p className="eyebrow">Find the right path</p>
          <h2>How would you like to connect with NOVA?</h2>
          <p>
            Choose the topic that best fits, then use the secure inquiry form to tell
            us how you would like to be involved.
          </p>
        </div>
        <div className="contact-grid">
          {contactPaths.map((path) => (
            <article key={path.title}>
              <h3>{path.title}</h3>
              <p>{path.body}</p>
              <Link href={`/contact?topic=${encodeURIComponent(path.topic)}#contact-form`}>
                {path.action} <ArrowUpRightIcon />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-form-section">
        <div className="contact-form-heading">
          <p className="eyebrow light">Send an inquiry</p>
          <h2>Tell us what brings you to NOVA.</h2>
          <p>
            Your message will be reviewed privately by NOVA leadership.
          </p>
        </div>
        <ContactForm initialTopic={initialTopic} />
      </section>
    </>
  );
}
