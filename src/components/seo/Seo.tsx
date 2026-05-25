import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://vivanterra.vercel.app";
const SITE_NAME = "Vivanterra Real Estate";
const DEFAULT_OG_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ad31e80f-c935-4971-a0a5-960006fba79d/id-preview-43416704--2da3d882-ba20-44cc-9fbb-d4a21c72ed31.lovable.app-1777963200325.png";

export type SeoProps = {
  /** The page <title>. Will be suffixed with " — Vivanterra" unless `bare` is true. */
  title: string;
  /** Meta + OG description (1–2 sentences). */
  description: string;
  /** Optional OG image override (full URL). */
  image?: string;
  /** Optional canonical path override (defaults to current location). */
  path?: string;
  /** Mark the page type for OG (default: "website"; use "article" for blog posts). */
  type?: "website" | "article";
  /** If true, render `title` exactly — don't append the brand. */
  bare?: boolean;
  /** Optional JSON-LD structured data object. */
  jsonLd?: Record<string, unknown>;
};

/**
 * Per-page SEO. Sits inside any route component.
 */
export default function Seo({
  title,
  description,
  image,
  path,
  type = "website",
  bare = false,
  jsonLd,
}: SeoProps) {
  const location = useLocation();
  const canonical = `${SITE_URL}${path ?? location.pathname}`;
  const fullTitle = bare ? title : `${title} — ${SITE_NAME}`;
  const og = image ?? DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={og} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={og} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
