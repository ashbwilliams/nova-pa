import type { Metadata } from "next";
import { ArrowUpRightIcon } from "@/components/arrow-up-right-icon";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { getSiteState } from "@/lib/nova-data";
import { resolveMediaSlot } from "@/lib/nova-media";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact NOVA Performing Arts about NOVA 8 Percussion, student interest, donations, sponsorships, instruments, facilities, or community partnership.",
};

const contactPaths = [
  {
    number: "01",
    title: "Students & families",
    body: "Ask about NOVA 8 Percussion or be notified when program dates, location, costs, and participation details are available.",
    action: "Express interest",
  },
  {
    number: "02",
    title: "Donors & sponsors",
    body: "Discuss charitable giving, founding support, sponsorship, or a contribution directed to a particular program need.",
    action: "Discuss support",
  },
  {
    number: "03",
    title: "Schools & educators",
    body: "Connect about student referrals, regional need, educational partnership, clinics, or collaboration with school music programs.",
    action: "Connect as an educator",
  },
  {
    number: "04",
    title: "Community partners",
    body: "Talk with us about instruments, rehearsal facilities, event partnerships, volunteer expertise, or other resources.",
    action: "Explore a partnership",
  },
];

export default async function ContactPage() {
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
            <article key={path.number}>
              <span>{path.number}</span>
              <h3>{path.title}</h3>
              <p>{path.body}</p>
              <a href="#contact-form">
                {path.action} <ArrowUpRightIcon />
              </a>
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
        <ContactForm />
      </section>

      <section className="youth-safety-note">
        <p className="eyebrow">A note for students</p>
        <p>
          If you are under 18, please involve a parent, guardian, or school music
          educator when contacting NOVA.
        </p>
      </section>
    </>
  );
}
