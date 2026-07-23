import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-orbit" aria-hidden="true">
        <Image src="/brand/nova-mark.png" alt="" width={448} height={487} />
      </div>
      <div className="footer-grid">
        <div className="footer-statement">
          <p className="eyebrow light">NOVA Performing Arts</p>
          <h2>More time to grow.</h2>
          <p>
            A Central Texas 501(c)(3) nonprofit expanding access to high-quality
            youth performing arts education.
          </p>
        </div>
        <div className="footer-links">
          <p className="footer-label">Explore</p>
          <Link href="/about">About NOVA</Link>
          <Link href="/nova-8">NOVA 8 Percussion</Link>
          <Link href="/percussion-playground">Percussion Playground</Link>
          <Link href="/impact">Access & Impact</Link>
          <Link href="/resources">Resources</Link>
          <Link href="/support">Support NOVA</Link>
        </div>
        <div className="footer-links">
          <p className="footer-label">Connect</p>
          <Link href="/partnerships">Partnership opportunities</Link>
          <Link href="/contact">Start a conversation</Link>
          <Link href="/contact#contact-form">Send an inquiry</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} NOVA Performing Arts</span>
        <div className="footer-bottom-meta">
          <span>Youth-centered. Access-driven. Artistically ambitious.</span>
          <Link
            className="footer-hub-link"
            href="/hub"
            aria-label="Open the NOVA Hub"
            title="NOVA Hub"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10" />
              <rect x="4.5" y="10" width="15" height="10" rx="1.5" />
              <path d="M12 14.2v2" />
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}
