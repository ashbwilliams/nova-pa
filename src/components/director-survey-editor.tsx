"use client";

import { useActionState } from "react";
import {
  saveDirectorSurvey,
  type DirectorSurveySaveState,
} from "@/app/hub/actions";
import type {
  DirectorSurveyConfig,
  DirectorSurveyQuestionKey,
} from "@/lib/director-survey";

const initialState: DirectorSurveySaveState = {
  status: "idle",
  message: "",
};

const questionFields: Array<{
  key: DirectorSurveyQuestionKey;
  number: string;
}> = [
  { key: "name", number: "01" },
  { key: "organization", number: "02" },
  { key: "role", number: "03" },
  { key: "students", number: "04" },
  { key: "percussionStudentCount", number: "05" },
  { key: "needs", number: "06" },
  { key: "opportunities", number: "07" },
  { key: "timing", number: "08" },
  { key: "involvement", number: "09" },
  { key: "rehearsalSpace", number: "10" },
  { key: "followUp", number: "11" },
  { key: "additionalNotes", number: "12" },
];

const optionFields: Array<{
  key: Exclude<keyof DirectorSurveyConfig, "questions">;
  label: string;
  help?: string;
}> = [
  { key: "roles", label: "Question 03 · Role choices" },
  { key: "studentGroups", label: "Question 04 · Student and ensemble choices" },
  {
    key: "percussionStudentCounts",
    label: "Question 05 · Student-count choices",
  },
  { key: "programNeeds", label: "Question 06 · Program-need choices" },
  {
    key: "novaOpportunities",
    label: "Question 07 · NOVA opportunity choices",
  },
  { key: "supportTimings", label: "Question 08 · Timing choices" },
  {
    key: "involvementOptions",
    label: "Question 09 · Involvement choices",
  },
  {
    key: "rehearsalSpaceOptions",
    label: "Question 10 · Rehearsal-space choices",
  },
  {
    key: "followUpOptions",
    label: "Question 11 · Follow-up choices",
    help:
      "Keep the no-follow-up choice last; the final choice is the one that makes contact information optional.",
  },
];

export function DirectorSurveyEditor({
  initialConfig,
}: {
  initialConfig: DirectorSurveyConfig;
}) {
  const [state, action, pending] = useActionState(
    saveDirectorSurvey,
    initialState,
  );

  return (
    <form action={action} className="survey-editor-form">
      <section className="hub-section">
        <div className="hub-section-heading">
          <div>
            <p className="eyebrow">Public wording</p>
            <h2>Survey questions</h2>
          </div>
          <span>12 questions</span>
        </div>
        <div className="survey-editor-question-grid">
          {questionFields.map((field) => (
            <label className="planner-field" key={field.key}>
              Question {field.number}
              <textarea
                name={`question_${field.key}`}
                defaultValue={initialConfig.questions[field.key]}
                rows={3}
                required
                maxLength={240}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="hub-section">
        <div className="hub-section-heading">
          <div>
            <p className="eyebrow">Selectable responses</p>
            <h2>Answer choices</h2>
          </div>
          <span>One choice per line</span>
        </div>
        <div className="survey-editor-option-grid">
          {optionFields.map((field) => (
            <label className="planner-field" key={field.key}>
              {field.label}
              <textarea
                name={`options_${field.key}`}
                defaultValue={initialConfig[field.key].join("\n")}
                rows={Math.min(10, Math.max(4, initialConfig[field.key].length))}
                required
              />
              {field.help ? <small>{field.help}</small> : null}
            </label>
          ))}
        </div>
      </section>

      <div className="survey-editor-savebar">
        <div>
          <strong>Publish survey changes</strong>
          <p>Saved wording and choices appear on the public survey immediately.</p>
        </div>
        <button className="hub-save-button" type="submit" disabled={pending}>
          {pending ? "Publishing..." : "Save and publish"}
        </button>
        <p
          className={`survey-editor-status ${state.status}`}
          aria-live="polite"
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </p>
      </div>
    </form>
  );
}
