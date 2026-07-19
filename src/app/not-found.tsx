import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found">
      <p className="eyebrow">404</p>
      <h1>This page is still finding its rhythm.</h1>
      <p>The page you requested could not be found.</p>
      <Link className="button button-dark" href="/">Return home</Link>
    </section>
  );
}
