# Vivanterra

Marketing site for **Vivanterra Real Estate** — small, careful residences in Bengaluru.

Production: <https://vivanterra.vercel.app>

## Stack

- **Vite** + **React 18** + **TypeScript** (SWC)
- **Tailwind CSS** with custom design tokens (`tailwind.config.ts`, `src/index.css`)
- **shadcn/ui** primitives in `src/components/ui/*`
- **react-router-dom v6** for client-side routing
- **react-hook-form** + **zod** for form validation
- **framer-motion**, **GSAP**, **Lenis**, **Swiper** for animation and gallery
- **Vitest** + **@testing-library/react** for unit / render tests
- Deployed to **Vercel** (auto-deploy from `main`)

## Routes

| Path | Page | Notes |
| ---- | ---- | ----- |
| `/` | `pages/Index.tsx` | Home — Hero, Residences, Standard, WhyCity, Press, News, CTA |
| `/about` | `pages/About.tsx` | Studio story |
| `/projects` | `pages/Projects.tsx` | Three-card hub linking to status pages |
| `/projects/ongoing\|upcoming\|completed` | `pages/ProjectsByStatus.tsx` | Project grid filtered by status |
| `/projects/:slug` | `pages/ProjectDetail.tsx` | Hero, gallery, specs, inline enquiry form, related projects |
| `/velocity` | `pages/Velocity.tsx` | The delivery standard — four pillars, six stages |
| `/career` | `pages/Career.tsx` | Open roles |
| `/blogs` | `pages/Blogs.tsx` | Journal — Featured + filtered grid |
| `/blogs/:slug` | `pages/BlogDetail.tsx` | Article with body, byline, related posts |
| `/contact` | `pages/Contact.tsx` | Enquiry form — supports `?project=<slug>` and `?scope=<scope>` |

## Content

Hardcoded for now — `getProjects()` / `getPostBySlug()` etc. are the seams to swap a CMS in later without touching pages.

- `src/data/projects.ts` — 8 projects across Ongoing / Upcoming / Completed
- `src/data/posts.ts` — 9 journal essays with full body content

## Contact form

Posts a JSON enquiry via `src/lib/contact.ts` → `submitContactEnquiry()`.

Set the endpoint in `.env.local`:

```
VITE_CONTACT_ENDPOINT=https://your-collector.example.com/contact
```

Anything that accepts a JSON `POST` works — a Vercel / Netlify / Cloudflare function, Formspree, Web3Forms, an internal API. If the variable is unset (e.g. local dev with no backend), the helper logs the payload to the console and returns a "mock success" so the form is still demonstrable.

The submitted JSON shape:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "phone": "+91 99866 66774",
  "scope": "residence",
  "budget": "5-10",
  "message": "I'd like to learn more about Aurelia Bay.",
  "projectSlug": "aurelia-bay",
  "source": "vivanterra-website",
  "submittedAt": "2026-05-25T10:30:00.000Z"
}
```

## Development

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build into dist/
npm run preview      # serve the production build locally
npm test             # run all vitest suites once
npm run test:watch   # vitest in watch mode
npm run lint         # eslint
```

## Deployment

Pushing to `main` triggers an auto-deploy on Vercel. There's a `vercel.json` at the repo root with the SPA rewrite. Set environment variables (`VITE_CONTACT_ENDPOINT`, etc.) in Vercel → Settings → Environment Variables.

## Tests

```bash
npm test
```

- `src/test/contact.test.ts` — `submitContactEnquiry()` helper (endpoint resolution, timeout, network errors, honeypot)
- `src/test/detail-pages.test.tsx` — ProjectDetail + BlogDetail render correctly for known slugs and redirect to `NotFound` for unknown slugs
