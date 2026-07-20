import Image from "next/image";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  imagePosition,
}: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-hero-copy">
        <p className="eyebrow light">{eyebrow}</p>
        <h1 className={title.length > 30 ? "page-hero-title-long" : undefined}>
          {title}
        </h1>
        <p className="page-hero-description">{description}</p>
      </div>
      <div className="page-hero-image">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 800px) 100vw, 48vw"
          style={{ objectPosition: imagePosition }}
          priority
        />
      </div>
    </section>
  );
}
