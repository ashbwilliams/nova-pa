"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutHub } from "@/app/hub/actions";

export type HubSidebarItem = {
  href: string;
  label: string;
};

type HubSidebarProps = {
  items: HubSidebarItem[];
  publicHref: string;
  publicLabel: string;
};

function hrefPath(href: string) {
  return href.split("#")[0] || "/hub/dashboard";
}

function hrefHash(href: string) {
  return href.includes("#") ? href.split("#")[1] : "";
}

export function HubSidebar({ items, publicHref, publicLabel }: HubSidebarProps) {
  const pathname = usePathname();
  const firstLocalSection = items.find(
    (item) => hrefPath(item.href) === pathname && hrefHash(item.href),
  );
  const [activeHref, setActiveHref] = useState(firstLocalSection?.href ?? pathname);

  useEffect(() => {
    const sectionItems = items.filter(
      (item) => hrefPath(item.href) === pathname && hrefHash(item.href),
    );

    if (!sectionItems.length) {
      return;
    }

    const updateActiveSection = () => {
      const marker = Math.min(240, window.innerHeight * 0.3);
      let current = sectionItems[0];

      for (const item of sectionItems) {
        const section = document.getElementById(hrefHash(item.href));
        if (section && section.getBoundingClientRect().top <= marker) current = item;
      }

      setActiveHref(current.href);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("hashchange", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, [items, pathname]);

  return (
    <aside className="hub-sidebar">
      <div>
        <span className="hub-monogram">N</span>
        <p>NOVA Performing Arts</p>
        <strong>Owner Hub</strong>
      </div>
      <nav aria-label="Hub sections">
        {items.map((item) => {
          const path = hrefPath(item.href);
          const hash = hrefHash(item.href);
          const isActive = hash
            ? activeHref === item.href
            : path === pathname && !items.some(
                (candidate) =>
                  hrefPath(candidate.href) === pathname &&
                  hrefHash(candidate.href) &&
                  activeHref === candidate.href,
              );

          return (
            <Link
              className={isActive ? "active" : undefined}
              href={item.href}
              key={item.href}
              aria-current={isActive ? (hash ? "location" : "page") : undefined}
              onClick={() => setActiveHref(item.href)}
            >
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="hub-sidebar-actions">
        <Link href={publicHref} target="_blank">{publicLabel}</Link>
        <form action={logoutHub}>
          <button type="submit">Sign out</button>
        </form>
      </div>
    </aside>
  );
}
