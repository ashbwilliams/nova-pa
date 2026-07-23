/opt/homebrew/Library/Homebrew/cmd/shellenv.sh: line 18: /bin/ps: Operation not permitted
import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { DirectorSurveyForm } from "./survey-form";

export const metadata: Metadata = {
  title: "Band & Percussion Program Survey",
  description:
    "A short survey for band directors and percussion instructors to share program needs and partnership opportunities with NOVA.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DirectorSurveyPage() {
  return (
    <>
      <PageHero
        eyebrow="NOVA 8 Percussion · Educator outreach"
        title="Help us understand your program."
        description="We know schedules are busy. This short survey helps NOVA identify meaningful ways to support your students and connect with your program."
        image="/images/hero-percussion.jpg"
        imageAlt="Young percussionists rehearsing together"
      />

      <section className="director-survey-section">
        <div className="director-survey-intro">
          <p className="eyebrow light">About three minutes</p>
          <h2>Your perspective helps us create more time to grow.</h2>
          <p>
            Share what your program needs, which opportunities may be useful,
            and whether you might like to be involved with NOVA.
          </p>
        </div>
        <DirectorSurveyForm />
      </section>
    </>
  );
}
