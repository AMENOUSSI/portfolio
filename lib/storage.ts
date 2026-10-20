import "server-only";
import { randomUUID } from "node:crypto";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

/*
 * Project images live in the Neon Object Storage bucket declared in neon.ts
 * (public_read: anyone can read, only the server can write).
 *
 * Credentials: `neon env pull` writes AWS_* variables locally, but Vercel
 * reserves the AWS_* names for its own runtime, so production uses STORAGE_*.
 * The AWS_* fallback is skipped on Vercel so its runtime credentials are never
 * picked up by mistake.
 */

const BUCKET = "portfolio-images";

export const MAX_IMAGE_BYTES = 3.5 * 1024 * 1024;

const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

/** Certificates may also be PDFs. */
const DOCUMENT_EXTENSIONS: Record<string, string> = { ...IMAGE_EXTENSIONS, "application/pdf": "pdf" };

/** Thrown when the STORAGE_* variables are missing in this environment. */
export class StorageNotConfiguredError extends Error {}

function setting(name: string, awsName: string): string {
  const value = process.env[`STORAGE_${name}`] ?? (process.env.VERCEL ? undefined : process.env[awsName]);
  if (!value) throw new StorageNotConfiguredError(`STORAGE_${name} is not set`);
  return value;
}

let client: S3Client | undefined;

function storage() {
  const endpoint = setting("ENDPOINT", "AWS_ENDPOINT_URL_S3").replace(/\/$/, "");
  client ??= new S3Client({
    endpoint,
    region: setting("REGION", "AWS_REGION"),
    credentials: {
      accessKeyId: setting("ACCESS_KEY_ID", "AWS_ACCESS_KEY_ID"),
      secretAccessKey: setting("SECRET_ACCESS_KEY", "AWS_SECRET_ACCESS_KEY"),
    },
    forcePathStyle: true, // required by Neon
  });
  return { client, publicBase: `${endpoint}/${BUCKET}/` };
}

/** Returns an error message for an unusable image, or null when it can be uploaded. */
export function checkImage(file: File): string | null {
  if (!IMAGE_EXTENSIONS[file.type]) return "Format accepté : JPEG, PNG, WebP ou AVIF";
  if (file.size > MAX_IMAGE_BYTES) return "Image trop lourde : 3,5 Mo maximum";
  return null;
}

/** Same as checkImage, but PDFs are accepted too (certificates). */
export function checkDocument(file: File): string | null {
  if (!DOCUMENT_EXTENSIONS[file.type]) return "Format accepté : PDF, JPEG, PNG, WebP ou AVIF";
  if (file.size > MAX_IMAGE_BYTES) return "Fichier trop lourd : 3,5 Mo maximum";
  return null;
}

/** Uploads a checked file under `<folder>/` (e.g. "projects/my-slug") and returns its public URL. */
export async function uploadFile(file: File, folder: string): Promise<string> {
  const { client, publicBase } = storage();
  // A new key per upload: CDN and browser caches can then keep each file forever.
  const key = `${folder}/${randomUUID()}.${DOCUMENT_EXTENSIONS[file.type]}`;
  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return publicBase + key;
}

export type UploadFailure = { error: string; reason: "config" | "failed" };

export const UPLOAD_ERRORS: Record<UploadFailure["reason"], string> = {
  config: "Le stockage de fichiers n'est pas configuré sur le serveur (variables STORAGE_* manquantes).",
  failed: "L'envoi du fichier a échoué. Réessayez dans un instant.",
};

/** Like uploadFile, but returns a message for the admin form instead of throwing. */
export async function tryUploadFile(file: File, folder: string): Promise<{ url: string } | UploadFailure> {
  try {
    return { url: await uploadFile(file, folder) };
  } catch (error) {
    console.error("Image upload failed", error);
    const reason = error instanceof StorageNotConfiguredError ? "config" : "failed";
    return { error: UPLOAD_ERRORS[reason], reason };
  }
}

/** Deletes a file previously uploaded here; ignores other URLs and failures. */
export async function deleteStoredFile(url: string | null | undefined): Promise<void> {
  if (!url) return;
  try {
    const { client, publicBase } = storage();
    if (!url.startsWith(publicBase)) return;
    await client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: url.slice(publicBase.length) }));
  } catch (error) {
    console.error("Could not delete stored image", error);
  }
}
