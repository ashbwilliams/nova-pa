"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  submitContactInquiry,
  type ContactFormState,
} from "@/app/contact/actions";

const initialState: ContactFormState = { status: "idle", message: "" };

export function EventInterestForm() {
  const [state, action, pending] = useActionState(
    submitContactInquiry,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  return (
    <form ref={formRef} action={action} className="event-interest-form">
      <div className="form-field honeypot-field" aria-hidden="true">
        <label htmlFor="playground-website">Website</label>
        <input
          id="playground-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <input name="topic" type="hidden" value="Other" />
      <input
        name="message"
        type="hidden"
        value="Please notify me when Percussion Playground dates and event details are announced."
      />

      <div className="event-interest-fields">
        <div className="form-field">
          <label htmlFor="playground-name">Name</label>
          <input
            id="playground-name"
            name="name"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
          />
        </div>
        <div className="form-field">
          <label htmlFor="playground-email">Email</label>
          <input
            id="playground-email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
          />
        </div>
        <div className="form-field">
          <label htmlFor="playground-organization">
            School or organization <span>Optional</span>
          </label>
          <input
            id="playground-organization"
            name="organization"
            maxLength={160}
            autoComplete="organization"
          />
        </div>
      </div>

      <div className="event-interest-actions">
        <p>
          If you are under 18, please involve a parent, guardian, or school music
          educator.
        </p>
        <button className="button button-dark" type="submit" disabled={pending}>
          {pending ? "Sending..." : "Get event updates"}
        </button>
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
