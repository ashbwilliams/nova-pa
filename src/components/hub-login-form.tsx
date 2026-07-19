"use client";

import { useActionState } from "react";
import { loginHub, type HubLoginState } from "@/app/hub/actions";

const initialState: HubLoginState = { status: "idle", message: "" };

export function HubLoginForm() {
  const [state, action, pending] = useActionState(loginHub, initialState);

  return (
    <form action={action} className="hub-login-form">
      <label htmlFor="hub-password">Owner password</label>
      <input
        id="hub-password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        autoFocus
      />
      <button className="button button-accent" type="submit" disabled={pending}>
        {pending ? "Opening hub..." : "Open NOVA Hub"}
      </button>
      <p className="hub-login-status" role="alert" aria-live="polite">
        {state.message}
      </p>
    </form>
  );
}
