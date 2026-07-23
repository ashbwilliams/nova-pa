import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { getSiteState } from "@/lib/nova-data";
import { DirectorSurveyForm } from "./survey-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Band & Percussion Program Survey",
  description:
    "A short survey for band directors and percussion instructors to share program needs and partnership opportunities with NOVA.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DirectorSurveyPage() {
  const { content } = await getSiteState();

  return (
    <>
      <PageHero
        eyebrow="NOVA 8 Percussion · Educator outreach"
        title="Help us understand your program."
        description="NOVA Performing Arts is developing NOVA 8 Percussion, a noncompetitive program that gives Central Texas young musicians more opportunities to train, rehearse, and grow beyond the school marching season."
        image="/images/hero-percussion.jpg"
        imageAlt="Young percussionists rehearsing together"
      />

      <section className="director-survey-section">
        <div className="director-survey-intro">
          <p className="eyebrow light">About NOVA 8 Percussion</p>
          <h2>More time to grow.</h2>
          <p className="director-survey-summary">
            The program is being designed to strengthen technique, musicianship,
            ensemble skills, confidence, and belonging through accessible
            instruction and meaningful rehearsal experiences. NOVA is currently
            listening to local educators as it shapes the program and explores
            partnerships.
          </p>
          <p className="director-survey-purpose">
            This short survey helps us understand what your students need, which
            opportunities may be useful, and whether you might like to be involved.
          </p>
          <p className="director-survey-time">About three minutes</p>
        </div>
        <DirectorSurveyForm config={content.directorSurvey} />
      </section>
    </>
  );
}
