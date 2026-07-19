import type { Metadata } from "next";
import { ArrowUpRightIcon } from "@/components/arrow-up-right-icon";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { getSiteState } from "@/lib/nova-data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact NOVA Performing Arts about the academy, student interest, donations, sponsorships, instruments, facilities, or community partnership.",
};

const contactPaths = [
  {
    number: "01",
    title: "Students & families",
    body: "Ask about the academy or be notified when program dates, location, costs, and participation details are available.",
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

  return (
    <>
      <PageHero
        eyebrow="Contact NOVA"
        title={content.contactHeadline}
        description={content.contactIntro}
        image="/images/music-clinic.jpg"
        imageAlt="A percussion educator working with young musicians"
        number="05"
      />

      <section className="contact-section">
        <div className="contact-intro">
          <p className="eyebrow">Find the right path</p>
          <h2>What would you like to help move forward?</h2>
          <p>
            Choose the closest topic below, then use the secure inquiry form to tell
            us what you would like us to know.
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
            Your message goes directly into the protected NOVA Hub for review by
            organization leadership.
          </p>
        </div>
        <ContactForm />
      </section>

      <section className="youth-safety-note">
        <p className="eyebrow">A note for students</p>
        <p>
          Students under 18 should include a parent, guardian, or school music educator
          in initial conversations with NOVA.
        </p>
      </section>
    </>
  );
}
