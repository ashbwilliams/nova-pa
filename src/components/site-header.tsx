import Image from "next/image";
import Link from "next/link";

const navigation = [
  { href: "/about", label: "About" },
  { href: "/academy", label: "NOVA 8 Percussion" },
  { href: "/impact", label: "Access & Impact" },
  { href: "/contact", label: "Contact" },
];

function BrandLockup() {
  return (
    <Link className="brand-lockup" href="/" aria-label="NOVA Performing Arts home">
      <span className="brand-mark-wrap" aria-hidden="true">
        <Image src="/brand/nova-mark.png" alt="" width={34} height={37} priority />
      </span>
      <span className="brand-name">
        <strong>NOVA</strong>
        <span>Performing Arts</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <BrandLockup />

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          <Link className="nav-support" href="/support">
            Support NOVA
          </Link>
        </nav>

        <details className="mobile-nav">
          <summary aria-label="Open navigation">
            <span>Menu</span>
            <span className="menu-lines" aria-hidden="true">
              <i />
              <i />
            </span>
          </summary>
          <nav aria-label="Mobile navigation">
            {navigation.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
            <Link className="mobile-support" href="/support">
              Support NOVA
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
