import "server-only";

import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { getNovaDataConfig } from "@/lib/nova-data";

const bucket = "site-media";
const maximumFileSize = 4_000_000;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function storageClient() {
  const config = getNovaDataConfig();
  if (!config) throw new Error("NOVA data storage is not configured.");

  return createClient(config.url, config.key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function ensureMediaBucket() {
  const client = storageClient();
  const { data: buckets, error: listError } = await client.storage.listBuckets();
  if (listError) throw new Error("The site-photo bucket could not be checked.");

  const existing = buckets.find((item) => item.id === bucket);
  const options = {
    public: true,
    fileSizeLimit: maximumFileSize,
    allowedMimeTypes: [...allowedTypes],
  };

  if (!existing) {
    const { error } = await client.storage.createBucket(bucket, options);
    if (error) throw new Error("The site-photo bucket could not be created.");
    return;
  }

  const { error } = await client.storage.updateBucket(bucket, options);
  if (error) throw new Error("The site-photo bucket settings could not be updated.");
}

function validSignature(bytes: Uint8Array, type: string) {
  if (type === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (type === "image/png") {
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    );
  }
  if (type === "image/webp") {
    return (
      String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
    );
  }
  return false;
}

export async function uploadSitePhoto(slotKey: string, file: File) {
  if (!allowedTypes.has(file.type)) {
    throw new Error("Use a JPG, PNG, or WebP image.");
  }
  if (!file.size || file.size > maximumFileSize) {
    throw new Error("The photo must be smaller than 4 MB.");
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!validSignature(bytes, file.type)) {
    throw new Error("The selected file is not a valid image.");
  }

  await ensureMediaBucket();

  const extension =
    file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
  const storagePath = `${slotKey.replaceAll(".", "/")}/${randomUUID()}.${extension}`;
  const client = storageClient();
  const { error } = await client.storage.from(bucket).upload(storagePath, bytes, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });

  if (error) throw new Error("The photo could not be uploaded.");

  const { data } = client.storage.from(bucket).getPublicUrl(storagePath);

  return {
    storagePath,
    publicUrl: data.publicUrl,
  };
}
