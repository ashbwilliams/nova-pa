"use client";

import { useActionState, useState } from "react";
import {
  directorRoles,
  followUpOptions,
  involvementOptions,
  novaOpportunities,
  percussionStudentCounts,
  programNeeds,
  rehearsalSpaceOptions,
  studentGroups,
  supportTimings,
} from "@/lib/director-survey";
import {
  submitDirectorSurvey,
  type DirectorSurveyState,
} from "./actions";

const initialState: DirectorSurveyState = { status: "idle", message: "" };

function ChoiceGroup({
  name,
  options,
  type = "checkbox",
  required = false,
}: {
  name: string;
  options: readonly string[];
  type?: "checkbox" | "radio";
  required?: boolean;
}) {
  return (
    <div className="survey-choice-grid">
      {options.map((option, index) => (
        <label className="survey-choice" key={option}>
          <input
            name={name}
            type={type}
            value={option}
            required={required && index === 0}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}

export function DirectorSurveyForm() {
  const [state, action, pending] = useActionState(
    submitDirectorSurvey,
    initialState,
  );
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [followUp, setFollowUp] = useState("");

  if (state.status === "success") {
    return (
      <section className="director-survey-success" aria-live="polite">
        <p className="eyebrow light">Response received</p>
        <h2>Thank you.</h2>
        <p>{state.message}</p>
      </section>
    );
  }

  return (
    <form action={action} className="director-survey-form">
      <div className="honeypot-field" aria-hidden="true">
        <label htmlFor="survey-website">Website</label>
        <input
          id="survey-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="survey-question-grid">
        <label className="survey-field">
          <span><b>01</b> Your name</span>
          <input name="name" required minLength={2} maxLength={100} autoComplete="name" />
        </label>
        <label className="survey-field">
          <span><b>02</b> School or organization</span>
          <input name="organization" required maxLength={160} autoComplete="organization" />
        </label>
      </div>

      <fieldset className="survey-question">
        <legend><b>03</b> Your role</legend>
        <ChoiceGroup name="roles" options={directorRoles} required />
        <label className="survey-field survey-dependent-field">
          <span>If other, please specify</span>
          <input name="roleOther" maxLength={160} />
        </label>
      </fieldset>

      <fieldset className="survey-question">
        <legend><b>04</b> Which students or ensembles do you currently serve?</legend>
        <ChoiceGroup name="students" options={studentGroups} required />
        <label className="survey-field survey-dependent-field">
          <span>If other, please specify</span>
          <input name="studentOther" maxLength={160} />
        </label>
      </fieldset>

      <label className="survey-field survey-question">
        <span><b>05</b> Approximately how many percussion students are in your program?</span>
        <select name="percussionStudentCount" required defaultValue="">
          <option value="" disabled>Select one</option>
          {percussionStudentCounts.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>

      <fieldset className="survey-question">
        <legend><b>06</b> What are your program’s greatest current needs?</legend>
        <p className="survey-hint">Choose up to three.</p>
        <div className="survey-choice-grid">
          {programNeeds.map((need) => {
            const checked = selectedNeeds.includes(need);
            return (
              <label className="survey-choice" key={need}>
                <input
                  checked={checked}
                  disabled={selectedNeeds.length >= 3 && !checked}
                  name="needs"
                  onChange={(event) =>
                    setSelectedNeeds((current) =>
                      event.target.checked
                        ? [...current, need]
                        : current.filter((item) => item !== need),
                    )
                  }
                  required={selectedNeeds.length === 0}
                  type="checkbox"
                  value={need}
                />
                <span>{need}</span>
              </label>
            );
          })}
        </div>
        <label className="survey-field survey-dependent-field">
          <span>If other, please specify</span>
          <input name="needOther" maxLength={160} />
        </label>
      </fieldset>

      <fieldset className="survey-question">
        <legend><b>07</b> Which NOVA opportunities might interest your program?</legend>
        <ChoiceGroup name="opportunities" options={novaOpportunities} required />
      </fieldset>

      <label className="survey-field survey-question">
        <span><b>08</b> When would support be most useful?</span>
        <select name="timing" required defaultValue="">
          <option value="" disabled>Select one</option>
          {supportTimings.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>

      <fieldset className="survey-question">
        <legend><b>09</b> Would you like to learn about ways to get involved in the project?</legend>
        <ChoiceGroup name="involvement" options={involvementOptions} required />
      </fieldset>

      <fieldset className="survey-question">
        <legend><b>10</b> Might your school or organization be able to provide rehearsal space for a NOVA activity?</legend>
        <ChoiceGroup
          name="rehearsalSpace"
          options={rehearsalSpaceOptions}
          type="radio"
          required
        />
        <label className="survey-field survey-dependent-field">
          <span>Optional: space, capacity, or availability details</span>
          <textarea name="spaceDetails" rows={4} maxLength={600} />
        </label>
      </fieldset>

      <fieldset className="survey-question">
        <legend><b>11</b> What is the best way for NOVA to follow up?</legend>
        <div className="survey-choice-grid">
          {followUpOptions.map((option, index) => (
            <label className="survey-choice" key={option}>
              <input
                name="followUp"
                onChange={(event) => setFollowUp(event.target.value)}
                required={index === 0}
                type="radio"
                value={option}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        <label className="survey-field survey-dependent-field">
          <span>Preferred email address or mobile number</span>
          <input
            name="contact"
            required={followUp !== "No follow-up needed"}
            maxLength={160}
            autoComplete="email"
          />
        </label>
      </fieldset>

      <label className="survey-field survey-question">
        <span><b>12</b> Is there anything else we should know about your students, program, or goals? <i>Optional</i></span>
        <textarea name="additionalNotes" rows={6} maxLength={800} />
      </label>

      <div className="director-survey-submit">
        <button className="button button-accent" type="submit" disabled={pending}>
          {pending ? "Sending response..." : "Submit survey"}
        </button>
        <p>
          NOVA will use your response to identify relevant opportunities and
          honor your preferred method of follow-up.
        </p>
      </div>

      <p
        className={`form-status ${state.status}`}
        aria-live="polite"
        role={state.status === "error" ? "alert" : "status"}
      >
        {state.message}
      </p>
    </form>
  );
}
