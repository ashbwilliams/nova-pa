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
          <Link href="/academy">NOVA 8 Percussion</Link>
          <Link href="/impact">Access & Impact</Link>
          <Link href="/support">Support NOVA</Link>
        </div>
        <div className="footer-links">
          <p className="footer-label">Connect</p>
          <Link href="/contact">Start a conversation</Link>
          <Link href="/contact#contact-form">Send an inquiry</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} NOVA Performing Arts</span>
        <span>Youth-centered. Access-driven. Artistically ambitious.</span>
      </div>
    </footer>
  );
}
