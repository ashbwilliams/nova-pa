import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/arrow-up-right-icon";
import { EventInterestForm } from "@/components/event-interest-form";
import { ManagedImage } from "@/components/managed-image";
import { getSiteState } from "@/lib/nova-data";
import { resolveMediaSlot } from "@/lib/nova-media";

export const metadata: Metadata = {
  title: "Percussion Playground",
  description:
    "Step inside a percussion ensemble through an immersive, hands-on experience from NOVA Performing Arts in Central Texas.",
  openGraph: {
    title: "Percussion Playground | NOVA Performing Arts",
    description:
      "Don’t just watch the ensemble. Step into it through an immersive, hands-on percussion experience.",
    images: [
      {
        url: "/images/rehearsal-overhead.jpg",
        width: 741,
        height: 480,
        alt: "A percussion ensemble arranged for rehearsal",
      },
    ],
  },
};

const experienceFlow = [
  ["Arrive", "Meet the performers and see how the experience will move."],
  ["Explore", "Rotate through guided stations and try a range of instruments."],
  ["Build", "Learn a short musical part and hear it join the room."],
  ["Connect", "Stay with the music, the people, and the ideas behind it."],
];

export default async function PercussionPlaygroundPage() {
  const { content } = await getSiteState();
  const heroImage = resolveMediaSlot(content.media, "playground.hero");
  const keyboardImage = resolveMediaSlot(content.media, "playground.keyboard");
  const drumsImage = resolveMediaSlot(content.media, "playground.drums");
  const audienceImage = resolveMediaSlot(content.media, "playground.audience");

  return (
    <>
      <section className="playground-hero">
        <div className="playground-hero-media">
          <ManagedImage
            media={heroImage}
            fill
            sizes="100vw"
            priority
          />
        </div>
        <div className="playground-hero-overlay" />
        <div className="playground-hero-copy">
          <p className="eyebrow light">A hands-on experience from NOVA Performing Arts</p>
          <h1>Percussion<br />Playground</h1>
          <p className="playground-hero-lead">
            Don’t just watch the ensemble. Step into it.
          </p>
          <p className="playground-hero-description">
            Move through guided percussion stations, try the instruments, learn a
            musical part, and discover what happens when the room becomes one ensemble.
          </p>
          <div className="button-row">
            <Link className="button button-accent" href="#event-updates">
              Get event updates
            </Link>
            <Link className="text-link light" href="#the-experience">
              Explore the experience <ArrowUpRightIcon />
            </Link>
          </div>
          <p className="playground-status">Dates and location are being planned.</p>
        </div>
      </section>

      <section className="playground-intro" id="the-experience">
        <div>
          <p className="eyebrow">An ensemble you can enter</p>
          <h2>Hear it from the inside.</h2>
        </div>
        <div className="playground-intro-copy">
          <p>
            Percussion Playground is an immersive event that brings people inside the
            sound and structure of a percussion ensemble. Experienced performers and
            educators will guide each station, giving you room to explore before
            everyone comes together.
          </p>
          <p>All that is needed is curiosity. No musical experience is required.</p>
        </div>
      </section>

      <section className="playground-sound-section">
        <div className="playground-section-heading">
          <p className="eyebrow">Move through the sound</p>
          <h2>Every instrument has a place in the whole.</h2>
        </div>

        <article className="playground-station">
          <div className="playground-station-image">
            <ManagedImage
              media={keyboardImage}
              fill
              sizes="(max-width: 820px) 100vw, 50vw"
            />
          </div>
          <div className="playground-station-copy">
            <p className="eyebrow light">Keyboard percussion</p>
            <h3>Find melody in motion.</h3>
            <p>
              Meet marimbas, vibraphones, and other keyboard instruments. Learn how
              mallet choice, movement, and touch shape the color of a musical line.
            </p>
          </div>
        </article>

        <article className="playground-station">
          <div className="playground-station-copy">
            <p className="eyebrow light">Drums, cymbals, and pulse</p>
            <h3>Feel how rhythm holds the room together.</h3>
            <p>
              Explore the instruments that give an ensemble its momentum, impact, and
              texture. Build a part with guidance, then hear how it changes when the
              other voices enter.
            </p>
          </div>
          <div className="playground-station-image">
            <ManagedImage
              media={drumsImage}
              fill
              sizes="(max-width: 820px) 100vw, 50vw"
            />
          </div>
        </article>
      </section>

      <section className="playground-flow-section">
        <div className="playground-section-heading dark-text">
          <p className="eyebrow">How it unfolds</p>
          <h2>From first sound to shared performance.</h2>
        </div>
        <div className="playground-flow">
          {experienceFlow.map(([title, body]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="playground-audience-section">
        <div className="playground-audience-image">
          <ManagedImage
            media={audienceImage}
            fill
            sizes="(max-width: 820px) 100vw, 50vw"
          />
        </div>
        <div className="playground-audience-copy">
          <p className="eyebrow">Made for the curious</p>
          <h2>You do not need to be a percussionist to belong here.</h2>
          <p>
            Percussion Playground welcomes music lovers, educators, families,
            supporters, and anyone who has wondered what it feels like to stand inside
            an ensemble. Participate at your own comfort level and let experienced
            guides take care of the rest.
          </p>
        </div>
      </section>

      <section className="playground-purpose-section">
        <div>
          <p className="eyebrow light">Behind every ensemble</p>
          <h2>The experience opens a wider view.</h2>
        </div>
        <div className="playground-purpose-copy">
          <p>
            Percussion Playground makes visible what a strong percussion program
            requires: skilled teaching, instruments, rehearsal space, time, and a
            community willing to create opportunity.
          </p>
          <p>
            It also offers a glimpse of what sustained access to those resources can
            mean for young musicians through NOVA 8 Percussion.
          </p>
          <div className="button-row">
            <Link className="button button-light" href="/nova-8#why-eight">
              Discover what the 8 means
            </Link>
            <Link className="text-link light" href="/support">
              Learn how to support NOVA <ArrowUpRightIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className="playground-updates-section" id="event-updates">
        <div className="playground-updates-heading">
          <p className="eyebrow">Event updates</p>
          <h2>Be first to hear when Percussion Playground is scheduled.</h2>
          <p>
            Share your email and NOVA will send the date, location, and participation
            details when they are ready.
          </p>
        </div>
        <EventInterestForm />
      </section>
    </>
  );
}
