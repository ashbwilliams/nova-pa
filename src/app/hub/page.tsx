import Link from "next/link";
import { redirect } from "next/navigation";
import { HubLoginForm } from "@/components/hub-login-form";
import { hasHubSession } from "@/lib/hub-auth";

export const dynamic = "force-dynamic";

export default async function HubLoginPage() {
  if (await hasHubSession()) redirect("/hub/dashboard");

  return (
    <div className="hub-login-page">
      <div className="hub-login-mark" aria-hidden="true">N</div>
      <section className="hub-login-card">
        <p className="eyebrow">Protected owner workspace</p>
        <h1>NOVA Hub</h1>
        <p>
          Review inquiries, publish academy details, and keep the public NOVA site
          current.
        </p>
        <HubLoginForm />
        <Link className="hub-back-link" href="/">Return to the public site</Link>
      </section>
    </div>
  );
}
