import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRightIcon } from "@/components/arrow-up-right-icon";
import { PageHero } from "@/components/page-hero";

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
    subject: "Academy interest",
    action: "Express interest",
  },
  {
    number: "02",
    title: "Donors & sponsors",
    body: "Discuss charitable giving, founding support, sponsorship, or a contribution directed to a particular program need.",
    subject: "Supporting NOVA Performing Arts",
    action: "Discuss support",
  },
  {
    number: "03",
    title: "Schools & educators",
    body: "Connect about student referrals, regional need, educational partnership, clinics, or collaboration with school music programs.",
    subject: "School and educator partnership",
    action: "Connect as an educator",
  },
  {
    number: "04",
    title: "Community partners",
    body: "Talk with us about instruments, rehearsal facilities, event partnerships, volunteer expertise, or other resources.",
    subject: "Community partnership",
    action: "Explore a partnership",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact NOVA"
        title="Start with a conversation."
        description="Whether you are a student, parent, educator, donor, or community partner, we would like to hear what brings you to NOVA."
        image="/images/music-clinic.jpg"
        imageAlt="A percussion educator working with young musicians"
        number="05"
      />

      <section className="contact-section">
        <div className="contact-intro">
          <p className="eyebrow">Find the right path</p>
          <h2>What would you like to help move forward?</h2>
          <p>
            Choose the closest topic below. Each link opens a prepared email so you can
            add whatever context you would like us to know.
          </p>
        </div>
        <div className="contact-grid">
          {contactPaths.map((path) => (
            <article key={path.number}>
              <span>{path.number}</span>
              <h3>{path.title}</h3>
              <p>{path.body}</p>
              <a href={`mailto:ashbw@pm.me?subject=${encodeURIComponent(path.subject)}`}>
                {path.action} <ArrowUpRightIcon />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="direct-contact">
        <div>
          <p className="eyebrow light">Direct contact</p>
          <h2>NOVA Performing Arts</h2>
          <a href="mailto:ashbw@pm.me">ashbw@pm.me</a>
          <a href="tel:+17376153164">737-615-3164</a>
          <p>Central Texas</p>
        </div>
        <div className="direct-contact-image">
          <Image src="/images/mallets-hands.jpg" alt="Hands performing on a keyboard percussion instrument" fill sizes="(max-width: 800px) 100vw, 48vw" />
          <span aria-hidden="true">NOVA</span>
        </div>
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
