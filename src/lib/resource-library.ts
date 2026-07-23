export type ResourceCatalogItem = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  format: "White paper" | "Practical guide";
  published: string;
  pdfPath: string;
};

export const resourceCatalog: ResourceCatalogItem[] = [
  {
    slug: "marching-percussion-as-an-educational-discipline",
    title: "Marching Percussion as an Educational Discipline",
    subtitle:
      "Why it can become a critical pathway to music, belonging, and growth for the right student",
    summary:
      "A careful, evidence-based case for marching percussion as a distinctive mode of music learning, with explicit limits on what the research does and does not support.",
    format: "White paper",
    published: "July 2026",
    pdfPath:
      "/resources/marching-percussion-as-an-educational-discipline.pdf",
  },
  {
    slug: "what-is-marching-percussion",
    title: "What Is Marching Percussion?",
    subtitle:
      "A plain-language guide to the instruments, the ensemble, and the learning",
    summary:
      "A concise introduction for donors, families, and partners who want to understand what students actually do and learn.",
    format: "Practical guide",
    published: "July 2026",
    pdfPath: "/resources/what-is-marching-percussion.pdf",
  },
  {
    slug: "what-it-takes-to-put-an-ensemble-on-the-floor",
    title: "What It Takes to Put an Ensemble on the Floor",
    subtitle: "Why instruments are only the beginning",
    summary:
      "A clear look at the people, place, supplies, access, safety, and operations required to turn NOVA's instruments into a student program.",
    format: "Practical guide",
    published: "July 2026",
    pdfPath:
      "/resources/what-it-takes-to-put-an-ensemble-on-the-floor.pdf",
  },
  {
    slug: "a-students-journey-through-nova-8",
    title: "A Student's Journey Through NOVA 8",
    subtitle: "From first encounter to confident ensemble member",
    summary:
      "An illustrative student pathway that shows how donor support shapes every stage, from discovery through performance and the next opportunity.",
    format: "Practical guide",
    published: "July 2026",
    pdfPath: "/resources/a-students-journey-through-nova-8.pdf",
  },
  {
    slug: "ways-to-help-young-musicians-begin",
    title: "Ways to Help Young Musicians Begin",
    subtitle:
      "A practical guide for donors, sponsors, hosts, and community partners",
    summary:
      "Specific ways to fund instruction and access, provide space, host an experience, strengthen operations, or open the right door.",
    format: "Practical guide",
    published: "July 2026",
    pdfPath: "/resources/ways-to-help-young-musicians-begin.pdf",
  },
];

export function getResourceCatalogItem(slug: string) {
  const resource = resourceCatalog.find((item) => item.slug === slug);

  if (!resource) {
    throw new Error(`Unknown resource: ${slug}`);
  }

  return resource;
}

