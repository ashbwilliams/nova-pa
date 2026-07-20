"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const primaryNavigation = [
  { href: "/about", label: "About" },
  { href: "/impact", label: "Access & Impact" },
  { href: "/contact", label: "Contact" },
];

const programNavigation = [
  { href: "/nova-8", label: "NOVA 8 Percussion" },
  { href: "/percussion-playground", label: "Percussion Playground" },
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
  const pathname = usePathname();
  const programMenuRef = useRef<HTMLDetailsElement>(null);
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const programIsActive = programNavigation.some((item) => item.href === pathname);

  useEffect(() => {
    programMenuRef.current?.removeAttribute("open");
    mobileMenuRef.current?.removeAttribute("open");
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <BrandLockup />

        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href="/about" aria-current={pathname === "/about" ? "page" : undefined}>
            About
          </Link>
          <details
            className={`desktop-programs${programIsActive ? " is-active" : ""}`}
            ref={programMenuRef}
          >
            <summary>
              Programs &amp; Experiences
              <span className="nav-chevron" aria-hidden="true" />
            </summary>
            <div className="desktop-programs-menu">
              {programNavigation.map((item) => (
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
          {primaryNavigation.slice(1).map((item) => (
            <Link
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
          <Link
            className="nav-support"
            href="/support"
            aria-current={pathname === "/support" ? "page" : undefined}
          >
            Support NOVA
          </Link>
        </nav>

        <details className="mobile-nav" ref={mobileMenuRef}>
          <summary aria-label="Open navigation">
            <span>Menu</span>
            <span className="menu-lines" aria-hidden="true">
              <i />
              <i />
            </span>
          </summary>
          <nav aria-label="Mobile navigation">
            <Link href="/about" aria-current={pathname === "/about" ? "page" : undefined}>
              About
            </Link>
            <span className="mobile-nav-group-label">Programs &amp; Experiences</span>
            {programNavigation.map((item) => (
              <Link
                className="mobile-program-link"
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
            {primaryNavigation.slice(1).map((item) => (
              <Link
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
            <Link
              className="mobile-support"
              href="/support"
              aria-current={pathname === "/support" ? "page" : undefined}
            >
              Support NOVA
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
