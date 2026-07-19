import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/arrow-up-right-icon";

type CtaBandProps = {
  eyebrow?: string;
  title: string;
  body: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function CtaBand({
  eyebrow = "Take part",
  title,
  body,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: CtaBandProps) {
  return (
    <section className="cta-band">
      <div>
        <p className="eyebrow light">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <div className="cta-band-action">
        <p>{body}</p>
        <div className="button-row">
          <Link className="button button-light" href={primaryHref}>
            {primaryLabel}
          </Link>
          {secondaryHref && secondaryLabel ? (
            <Link className="text-link light" href={secondaryHref}>
              {secondaryLabel} <ArrowUpRightIcon />
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
