"use client";

import { useEffect, useRef, useState } from "react";
import {
  resetMediaSlot,
  restoreMediaSlot,
  saveMediaSlot,
} from "@/app/hub/actions";
import type { ResolvedMediaSlot } from "@/lib/nova-media";

type MediaSlotEditorProps = {
  definition: {
    key: string;
    label: string;
    description: string;
    aspectRatio: string;
    aspectRatioCss: string;
    recommendedSize: string;
  };
  media: ResolvedMediaSlot;
  storageConfigured: boolean;
};

export function HubMediaSlotEditor({
  definition,
  media,
  storageConfigured,
}: MediaSlotEditorProps) {
  const [previewSrc, setPreviewSrc] = useState(media.src);
  const [focalX, setFocalX] = useState(media.focalX);
  const [focalY, setFocalY] = useState(media.focalY);
  const [fileError, setFileError] = useState("");
  const previewUrl = useRef<string | null>(null);

  useEffect(
    () => () => {
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    },
    [],
  );

  function previewFile(file: File | undefined) {
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    previewUrl.current = file ? URL.createObjectURL(file) : null;
    setPreviewSrc(previewUrl.current ?? media.src);
  }

  function selectFile(file: File | undefined, input: HTMLInputElement) {
    setFileError("");
    if (!file) {
      previewFile(undefined);
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      input.value = "";
      setFileError("Choose a JPG, PNG, or WebP image.");
      previewFile(undefined);
      return;
    }
    if (file.size > 4_000_000) {
      input.value = "";
      setFileError("Choose a photo smaller than 4 MB.");
      previewFile(undefined);
      return;
    }
    previewFile(file);
  }

  return (
    <article className="hub-media-card">
      <div
        className="hub-media-preview"
        role="img"
        aria-label={`Preview of ${definition.label}`}
        style={{
          aspectRatio: definition.aspectRatioCss,
          backgroundImage: `url(${JSON.stringify(previewSrc)})`,
          backgroundPosition: `${focalX}% ${focalY}%`,
        }}
      >
        <span>
          {media.isCustom
            ? "Custom photo"
            : media.isModified
              ? "Adjusted built-in"
              : "Built-in photo"}
        </span>
      </div>
      <div className="hub-media-card-heading">
        <div>
          <h4>{definition.label}</h4>
          <p>{definition.description}</p>
        </div>
        <span>{definition.aspectRatio}</span>
      </div>

      <form action={saveMediaSlot} className="hub-media-form">
        <input type="hidden" name="slotKey" value={definition.key} />
        <label className="hub-media-file">
          Replace photo
          <input
            type="file"
            name="photo"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) =>
              selectFile(event.target.files?.[0], event.currentTarget)
            }
            disabled={!storageConfigured}
          />
          <span>JPG, PNG, or WebP · up to 4 MB · {definition.recommendedSize}</span>
        </label>
        {fileError ? <p className="hub-media-file-error" role="alert">{fileError}</p> : null}
        <label>
          Alternative text
          <input name="alt" defaultValue={media.alt} required minLength={3} maxLength={240} />
        </label>
        <div className="hub-media-focal-grid">
          <label>
            Horizontal focus <span>{focalX}%</span>
            <input
              type="range"
              name="focalX"
              min="0"
              max="100"
              value={focalX}
              onChange={(event) => setFocalX(Number(event.target.value))}
            />
          </label>
          <label>
            Vertical focus <span>{focalY}%</span>
            <input
              type="range"
              name="focalY"
              min="0"
              max="100"
              value={focalY}
              onChange={(event) => setFocalY(Number(event.target.value))}
            />
          </label>
        </div>
        <div className="hub-media-actions">
          <button className="hub-save-button" type="submit" disabled={!storageConfigured}>
            Save photo slot
          </button>
          <button
            className="hub-secondary-button"
            type="submit"
            formAction={restoreMediaSlot}
            disabled={!storageConfigured || !media.hasPrevious}
          >
            Restore previous
          </button>
          <button
            className="hub-text-button"
            type="submit"
            formAction={resetMediaSlot}
            disabled={!storageConfigured || !media.isModified}
          >
            Use built-in photo
          </button>
        </div>
      </form>
    </article>
  );
}
