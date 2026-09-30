import { getSupabase } from "@/lib/supabase";

export const MEDIA_BUCKET = "vivanterra-media";
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // matches the bucket limit
export const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
];

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

/** Human-readable reason this file can't be uploaded, or null when it can. */
export function validateImage(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return `${file.type || "That file type"} isn't supported. Use JPG, PNG, WebP, AVIF, GIF or SVG.`;
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return `That image is ${(file.size / 1024 / 1024).toFixed(1)} MB — the limit is 10 MB.`;
  }
  return null;
}

/**
 * Uploads to the media bucket and returns the public URL.
 * `folder` keeps things tidy: projects/, blogs/, news/, gallery/.
 */
export async function uploadImage(file: File, folder = "misc"): Promise<string> {
  const problem = validateImage(file);
  if (problem) throw new Error(problem);

  const ext = EXT[file.type] ?? "bin";
  const name = `${Date.now().toString(36)}-${slugify(file.name) || "image"}.${ext}`;
  const path = `${folder}/${name}`;

  const sb = getSupabase();
  const { error } = await sb.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type,
  });
  if (error) {
    // The most common cause by far is not being signed in as an admin.
    throw new Error(
      /row-level security|Unauthorized/i.test(error.message)
        ? "Upload refused — your account isn't on the admin allowlist."
        : error.message,
    );
  }

  const { data } = sb.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Removes a previously uploaded file. Ignores anything not in our bucket. */
export async function deleteUploaded(url: string): Promise<void> {
  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
  const i = url.indexOf(marker);
  if (i === -1) return;
  const path = decodeURIComponent(url.slice(i + marker.length));
  await getSupabase().storage.from(MEDIA_BUCKET).remove([path]);
}

export const isUploadedUrl = (url: string) =>
  url.includes(`/storage/v1/object/public/${MEDIA_BUCKET}/`);
