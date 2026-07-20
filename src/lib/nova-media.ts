export type MediaVersion = {
  src: string;
  storagePath?: string;
  alt: string;
  focalX: number;
  focalY: number;
  updatedAt: string;
};

export type MediaOverride = MediaVersion & {
  previous?: MediaVersion;
};

export type SiteMediaState = Partial<Record<MediaSlotKey, MediaOverride>>;

export type MediaSlotDefinition = {
  key: string;
  group: string;
  label: string;
  description: string;
  aspectRatio: string;
  aspectRatioCss: string;
  recommendedSize: string;
  fallbackSrc: string;
  fallbackAlt: string;
  focalX: number;
  focalY: number;
};

export const mediaSlotDefinitions = [
  {
    key: "home.hero",
    group: "Homepage",
    label: "Main hero",
    description: "Full-width opening image behind the homepage headline.",
    aspectRatio: "Wide landscape",
    aspectRatioCss: "16 / 7",
    recommendedSize: "2400 × 1050 px",
    fallbackSrc: "/images/hero-percussion.jpg",
    fallbackAlt: "Young percussionists performing in an ensemble",
    focalX: 50,
    focalY: 44,
  },
  {
    key: "home.playground",
    group: "Homepage",
    label: "Percussion Playground feature",
    description: "Image beside the Percussion Playground introduction.",
    aspectRatio: "Landscape",
    aspectRatioCss: "4 / 3",
    recommendedSize: "1800 × 1350 px",
    fallbackSrc: "/images/rehearsal-overhead.jpg",
    fallbackAlt: "A percussion ensemble arranged in a rehearsal space",
    focalX: 50,
    focalY: 50,
  },
  {
    key: "home.need",
    group: "Homepage",
    label: "The need",
    description: "Tall image beside the access challenge statement.",
    aspectRatio: "Portrait",
    aspectRatioCss: "4 / 5",
    recommendedSize: "1400 × 1750 px",
    fallbackSrc: "/images/students-together.jpg",
    fallbackAlt: "Young musicians gathered together during rehearsal",
    focalX: 52,
    focalY: 50,
  },
  {
    key: "home.nova8",
    group: "Homepage",
    label: "NOVA 8 feature",
    description: "Image beside the flagship program introduction.",
    aspectRatio: "Landscape",
    aspectRatioCss: "4 / 3",
    recommendedSize: "1800 × 1350 px",
    fallbackSrc: "/images/mallet-rehearsal.jpg",
    fallbackAlt: "A student rehearsing on a keyboard percussion instrument",
    focalX: 50,
    focalY: 50,
  },
  {
    key: "home.evidence",
    group: "Homepage",
    label: "Community evidence",
    description: "Image beside the Central Texas survey result.",
    aspectRatio: "Landscape",
    aspectRatioCss: "5 / 4",
    recommendedSize: "1800 × 1440 px",
    fallbackSrc: "/images/conductor.jpg",
    fallbackAlt: "An educator conducting a musical ensemble",
    focalX: 50,
    focalY: 50,
  },
  {
    key: "about.hero",
    group: "About",
    label: "Page hero",
    description: "Opening image on the About NOVA page.",
    aspectRatio: "Landscape",
    aspectRatioCss: "4 / 3",
    recommendedSize: "1800 × 1350 px",
    fallbackSrc: "/images/rehearsal-overhead.jpg",
    fallbackAlt: "Percussion students and educators rehearsing together",
    focalX: 50,
    focalY: 50,
  },
  {
    key: "about.ash",
    group: "About",
    label: "Ash Williams portrait",
    description: "Leadership portrait on the About page.",
    aspectRatio: "Portrait",
    aspectRatioCss: "4 / 5",
    recommendedSize: "1200 × 1500 px",
    fallbackSrc: "/images/ash-williams.jpg",
    fallbackAlt: "Ash Williams",
    focalX: 50,
    focalY: 38,
  },
  {
    key: "about.james",
    group: "About",
    label: "James Procell portrait",
    description: "Leadership portrait on the About page.",
    aspectRatio: "Portrait",
    aspectRatioCss: "4 / 5",
    recommendedSize: "1200 × 1500 px",
    fallbackSrc: "/images/james-procell.jpg",
    fallbackAlt: "James Procell",
    focalX: 50,
    focalY: 25,
  },
  {
    key: "nova8.hero",
    group: "NOVA 8 Percussion",
    label: "Page hero",
    description: "Opening image on the NOVA 8 Percussion page.",
    aspectRatio: "Landscape",
    aspectRatioCss: "4 / 3",
    recommendedSize: "1800 × 1350 px",
    fallbackSrc: "/images/mallet-rehearsal.jpg",
    fallbackAlt: "A young percussionist rehearsing on a keyboard percussion instrument",
    focalX: 50,
    focalY: 50,
  },
  {
    key: "nova8.noncompetitive",
    group: "NOVA 8 Percussion",
    label: "Noncompetitive model",
    description: "Instrument image in the noncompetitive-program section.",
    aspectRatio: "Landscape",
    aspectRatioCss: "4 / 3",
    recommendedSize: "1800 × 1350 px",
    fallbackSrc: "/images/battery-instruments.jpg",
    fallbackAlt: "Marching percussion drums arranged in a rehearsal space",
    focalX: 50,
    focalY: 50,
  },
  {
    key: "nova8.audience",
    group: "NOVA 8 Percussion",
    label: "Who it is for",
    description: "Image beside the student eligibility explanation.",
    aspectRatio: "Landscape",
    aspectRatioCss: "4 / 3",
    recommendedSize: "1800 × 1350 px",
    fallbackSrc: "/images/music-clinic.jpg",
    fallbackAlt: "Students taking part in a percussion clinic",
    focalX: 50,
    focalY: 50,
  },
  {
    key: "playground.hero",
    group: "Percussion Playground",
    label: "Event hero",
    description: "Full-width opening image for Percussion Playground.",
    aspectRatio: "Wide landscape",
    aspectRatioCss: "16 / 9",
    recommendedSize: "2400 × 1350 px",
    fallbackSrc: "/images/rehearsal-overhead.jpg",
    fallbackAlt: "A percussion ensemble arranged in a rehearsal space",
    focalX: 50,
    focalY: 42,
  },
  {
    key: "playground.keyboard",
    group: "Percussion Playground",
    label: "Keyboard percussion station",
    description: "Image for the keyboard percussion experience.",
    aspectRatio: "Landscape",
    aspectRatioCss: "4 / 3",
    recommendedSize: "1800 × 1350 px",
    fallbackSrc: "/images/mallets-hands.jpg",
    fallbackAlt: "Musicians playing keyboard percussion instruments",
    focalX: 50,
    focalY: 50,
  },
  {
    key: "playground.drums",
    group: "Percussion Playground",
    label: "Drums and cymbals station",
    description: "Image for the drums, cymbals, and pulse experience.",
    aspectRatio: "Landscape",
    aspectRatioCss: "4 / 3",
    recommendedSize: "1800 × 1350 px",
    fallbackSrc: "/images/battery-instruments.jpg",
    fallbackAlt: "A collection of percussion drums prepared for rehearsal",
    focalX: 50,
    focalY: 50,
  },
  {
    key: "playground.audience",
    group: "Percussion Playground",
    label: "Made for the curious",
    description: "Ensemble image beside the audience invitation.",
    aspectRatio: "Landscape",
    aspectRatioCss: "4 / 3",
    recommendedSize: "1800 × 1350 px",
    fallbackSrc: "/images/ensemble-performance.jpg",
    fallbackAlt: "A percussion ensemble performing together",
    focalX: 50,
    focalY: 50,
  },
  {
    key: "impact.hero",
    group: "Access & Impact",
    label: "Page hero",
    description: "Opening image on the Access & Impact page.",
    aspectRatio: "Landscape",
    aspectRatioCss: "4 / 3",
    recommendedSize: "1800 × 1350 px",
    fallbackSrc: "/images/outdoor-ensemble.jpg",
    fallbackAlt: "A youth percussion ensemble rehearsing outdoors",
    focalX: 50,
    focalY: 50,
  },
  {
    key: "impact.model",
    group: "Access & Impact",
    label: "NOVA 8 response",
    description: "Image beside the program response to access barriers.",
    aspectRatio: "Landscape",
    aspectRatioCss: "4 / 3",
    recommendedSize: "1800 × 1350 px",
    fallbackSrc: "/images/mallets-hands.jpg",
    fallbackAlt: "A percussionist performing on a marimba",
    focalX: 50,
    focalY: 50,
  },
  {
    key: "support.hero",
    group: "Support",
    label: "Page hero",
    description: "Opening image on the Support NOVA page.",
    aspectRatio: "Landscape",
    aspectRatioCss: "4 / 3",
    recommendedSize: "1800 × 1350 px",
    fallbackSrc: "/images/ensemble-performance.jpg",
    fallbackAlt: "Young percussionists performing together",
    focalX: 50,
    focalY: 50,
  },
  {
    key: "support.ways",
    group: "Support",
    label: "Ways to help",
    description: "Image beside the ways-to-help section.",
    aspectRatio: "Portrait",
    aspectRatioCss: "4 / 5",
    recommendedSize: "1400 × 1750 px",
    fallbackSrc: "/images/community-outreach.jpg",
    fallbackAlt: "NOVA representatives meeting community members",
    focalX: 50,
    focalY: 50,
  },
  {
    key: "support.banner",
    group: "Support",
    label: "Founding support banner",
    description: "Full-width image behind the closing support invitation.",
    aspectRatio: "Wide landscape",
    aspectRatioCss: "16 / 7",
    recommendedSize: "2400 × 1050 px",
    fallbackSrc: "/images/austin-skyline.jpg",
    fallbackAlt: "The Austin skyline representing NOVA's Central Texas community",
    focalX: 50,
    focalY: 50,
  },
  {
    key: "contact.hero",
    group: "Contact",
    label: "Page hero",
    description: "Opening image on the Contact NOVA page.",
    aspectRatio: "Landscape",
    aspectRatioCss: "4 / 3",
    recommendedSize: "1800 × 1350 px",
    fallbackSrc: "/images/music-clinic.jpg",
    fallbackAlt: "A percussion educator working with young musicians",
    focalX: 50,
    focalY: 50,
  },
] as const satisfies readonly MediaSlotDefinition[];

export type MediaSlotKey = (typeof mediaSlotDefinitions)[number]["key"];

export type ResolvedMediaSlot = {
  key: MediaSlotKey;
  src: string;
  storagePath?: string;
  alt: string;
  focalX: number;
  focalY: number;
  objectPosition: string;
  updatedAt?: string;
  isCustom: boolean;
  isModified: boolean;
  hasPrevious: boolean;
};

const slotKeys = new Set<string>(mediaSlotDefinitions.map((slot) => slot.key));

export function isMediaSlotKey(value: string): value is MediaSlotKey {
  return slotKeys.has(value);
}

export function getMediaSlotDefinition(key: MediaSlotKey) {
  const definition = mediaSlotDefinitions.find((slot) => slot.key === key);
  if (!definition) throw new Error(`Unknown media slot: ${key}`);
  return definition;
}

function clampFocalPoint(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed)
    ? Math.min(100, Math.max(0, Math.round(parsed)))
    : fallback;
}

export function resolveMediaSlot(
  media: SiteMediaState | null | undefined,
  key: MediaSlotKey,
): ResolvedMediaSlot {
  const definition = getMediaSlotDefinition(key);
  const override = media?.[key];
  const focalX = clampFocalPoint(override?.focalX, definition.focalX);
  const focalY = clampFocalPoint(override?.focalY, definition.focalY);

  return {
    key,
    src: override?.src || definition.fallbackSrc,
    storagePath: override?.storagePath,
    alt: override?.alt?.trim() || definition.fallbackAlt,
    focalX,
    focalY,
    objectPosition: `${focalX}% ${focalY}%`,
    updatedAt: override?.updatedAt,
    isCustom: Boolean(
      override &&
        (override.storagePath || override.src !== definition.fallbackSrc),
    ),
    isModified: Boolean(override),
    hasPrevious: Boolean(override?.previous),
  };
}

export function toMediaVersion(slot: ResolvedMediaSlot): MediaVersion {
  return {
    src: slot.src,
    storagePath: slot.storagePath,
    alt: slot.alt,
    focalX: slot.focalX,
    focalY: slot.focalY,
    updatedAt: slot.updatedAt ?? new Date(0).toISOString(),
  };
}
