"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  submitContactInquiry,
  type ContactFormState,
} from "@/app/contact/actions";
import { inquiryTopics } from "@/lib/nova-types";

const initialState: ContactFormState = { status: "idle", message: "" };

export function ContactForm() {
  const [state, action, pending] = useActionState(
    submitContactInquiry,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  return (
    <form ref={formRef} action={action} className="inquiry-form" id="contact-form">
      <div className="form-field honeypot-field" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" required minLength={2} maxLength={100} />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required maxLength={254} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="topic">What brings you to NOVA?</label>
          <select id="topic" name="topic" required defaultValue="">
            <option value="" disabled>Select a topic</option>
            {inquiryTopics.map((topic) => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="organization">School or organization <span>Optional</span></label>
          <input id="organization" name="organization" maxLength={160} />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required minLength={20} maxLength={4000} rows={7} />
      </div>

      <div className="form-submit-row">
        <p>
          If you are under 18, please involve a parent, guardian, or school music
          educator when contacting NOVA.
        </p>
        <button className="button button-accent" type="submit" disabled={pending}>
          {pending ? "Sending..." : "Send inquiry"}
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
