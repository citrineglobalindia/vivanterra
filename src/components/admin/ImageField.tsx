import { useRef, useState } from "react";
import { ImageUp, Link2, Loader2, Trash2, UploadCloud } from "lucide-react";
import { ACCEPTED_TYPES, isUploadedUrl, uploadImage, validateImage } from "@/lib/upload";

const inputCls =
  "w-full bg-[rgba(78,115,83,0.04)] border border-line-dark rounded-md px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink/40 outline-none focus:border-gold focus:bg-paper transition-colors";

type Props = {
  value: string;
  onChange: (url: string) => void;
  /** Bucket sub-folder: projects, blogs, news, gallery… */
  folder?: string;
  label?: string;
  /** Preview box aspect ratio. */
  aspect?: string;
  compact?: boolean;
};

/**
 * Image picker for the admin panel: drop a file, choose one, or paste a URL.
 * Uploads land in the media bucket and the public URL is written back.
 */
export default function ImageField({
  value,
  onChange,
  folder = "misc",
  label = "Image",
  aspect = "aspect-[16/10]",
  compact = false,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [showUrl, setShowUrl] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    const problem = validateImage(file);
    if (problem) return setError(problem);
    setBusy(true);
    try {
      onChange(await uploadImage(file, folder));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="block text-[11px] tracking-[0.12em] uppercase text-ink/55 mb-1.5">{label}</span>

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {value ? (
        <div className="space-y-2">
          <div className={`relative ${aspect} rounded-md overflow-hidden bg-ink/5 border border-line-dark`}>
            <img src={value} alt="" className="h-full w-full object-cover" />
            {busy && (
              <div className="absolute inset-0 bg-ink/50 flex items-center justify-center text-paper">
                <Loader2 className="animate-spin" size={20} />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-line-dark text-ink/70 hover:border-gold hover:text-gold text-[10px] tracking-[0.16em] uppercase disabled:opacity-50"
            >
              <ImageUp size={13} /> Replace
            </button>
            <button
              type="button"
              onClick={() => setShowUrl((s) => !s)}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-line-dark text-ink/70 hover:border-gold hover:text-gold text-[10px] tracking-[0.16em] uppercase"
            >
              <Link2 size={13} /> URL
            </button>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setError(null);
              }}
              disabled={busy}
              className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-[hsl(var(--destructive))]/35 text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))]/5 disabled:opacity-50"
              title="Remove"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => !busy && fileRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileRef.current?.click();
          }}
          className={`flex flex-col items-center justify-center gap-2 rounded-md border border-dashed cursor-pointer transition-colors ${
            compact ? "py-6" : "py-10"
          } ${dragging ? "border-gold bg-gold/5" : "border-line-dark hover:border-gold/60 bg-[rgba(78,115,83,0.03)]"}`}
        >
          {busy ? (
            <>
              <Loader2 className="animate-spin text-ink/50" size={20} />
              <span className="text-[12px] text-ink/55">Uploading…</span>
            </>
          ) : (
            <>
              <UploadCloud className="text-ink/40" size={compact ? 18 : 24} />
              <span className="text-[12px] text-ink/60">
                Drop an image, or <span className="text-gold">browse</span>
              </span>
              <span className="text-[10px] text-ink/40">JPG, PNG, WebP, AVIF or SVG — up to 10 MB</span>
            </>
          )}
        </div>
      )}

      {(showUrl || (!value && !busy)) && (
        <input
          className={`${inputCls} mt-2`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="…or paste an image URL"
        />
      )}

      {value && isUploadedUrl(value) && (
        <span className="block mt-1.5 text-[11px] text-ink/45">Stored in your media library.</span>
      )}

      {error && (
        <div className="mt-2 text-[12px] text-[hsl(var(--destructive))]">{error}</div>
      )}
    </div>
  );
}
