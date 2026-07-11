#!/usr/bin/env node
/**
 * Generates dist/sitemap.xml and dist/robots.txt after `vite build`.
 *
 * Runs in the postbuild npm script. Walks the same project + post data
 * the site uses, so the sitemap stays in sync without a manual step.
 */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "dist");
const SITE = process.env.SITE_URL || "https://vivanterra.vercel.app";

const today = new Date().toISOString().slice(0, 10);

/** Extract `slug:` values from a data file by parsing source text. */
async function extractSlugs(filePath) {
  const src = await readFile(filePath, "utf8");
  // Match slug: "value" lines inside the data array
  const slugs = [];
  const re = /slug:\s*["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(src))) slugs.push(m[1]);
  return slugs;
}

const projectSlugs = await extractSlugs(resolve(ROOT, "src/data/projects.ts"));
const postSlugs = await extractSlugs(resolve(ROOT, "src/data/posts.ts"));

const staticRoutes = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.7", changefreq: "monthly" },
  { path: "/projects", priority: "0.9", changefreq: "weekly" },
  { path: "/projects/ongoing", priority: "0.8", changefreq: "weekly" },
  { path: "/projects/upcoming", priority: "0.7", changefreq: "monthly" },
  { path: "/projects/completed", priority: "0.7", changefreq: "monthly" },
  { path: "/career", priority: "0.6", changefreq: "monthly" },
  { path: "/blogs", priority: "0.8", changefreq: "weekly" },
  { path: "/contact", priority: "0.7", changefreq: "yearly" },
  { path: "/velociti", priority: "0.6", changefreq: "monthly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
  { path: "/disclaimer", priority: "0.3", changefreq: "yearly" },
  { path: "/rera-disclaimer", priority: "0.3", changefreq: "yearly" },
];

const urls = [
  ...staticRoutes,
  ...projectSlugs.map((s) => ({
    path: `/projects/${s}`,
    priority: "0.8",
    changefreq: "monthly",
  })),
  ...postSlugs.map((s) => ({
    path: `/blogs/${s}`,
    priority: "0.6",
    changefreq: "monthly",
  })),
];

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map(
      (u) =>
        `  <url>\n` +
        `    <loc>${SITE}${u.path}</loc>\n` +
        `    <lastmod>${today}</lastmod>\n` +
        `    <changefreq>${u.changefreq}</changefreq>\n` +
        `    <priority>${u.priority}</priority>\n` +
        `  </url>`,
    )
    .join("\n") +
  `\n</urlset>\n`;

const robots =
  `User-agent: *\n` +
  `Allow: /\n` +
  `Disallow: /404\n` +
  `\n` +
  `Sitemap: ${SITE}/sitemap.xml\n`;

if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });
await writeFile(resolve(OUT_DIR, "sitemap.xml"), sitemap, "utf8");
await writeFile(resolve(OUT_DIR, "robots.txt"), robots, "utf8");

console.log(
  `[sitemap] wrote ${urls.length} URLs (${projectSlugs.length} projects, ${postSlugs.length} posts) to dist/sitemap.xml`,
);
console.log(`[sitemap] wrote dist/robots.txt`);
