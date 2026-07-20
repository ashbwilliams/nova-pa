import Image, { type ImageProps } from "next/image";
import type { ResolvedMediaSlot } from "@/lib/nova-media";

type ManagedImageProps = Omit<ImageProps, "src" | "alt"> & {
  media: ResolvedMediaSlot;
};

export function ManagedImage({ media, style, ...props }: ManagedImageProps) {
  return (
    <Image
      {...props}
      src={media.src}
      alt={media.alt}
      style={{ ...style, objectPosition: media.objectPosition }}
    />
  );
}
