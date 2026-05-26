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

## Admin panel

Lives at `/admin` (protected). Powered by Supabase Auth + a `vivanterra_enquiries` table; new enquiries from the public contact form are inserted by `/api/contact` and surfaced in the dashboard.

### One-time setup

1. **Add Vercel environment variables** — Vercel → Project Settings → Environment Variables. Paste in all four from `.env.example` (the two `VITE_*` are exposed to the browser, the two unprefixed ones are read by the serverless function only). Pull values from Supabase → Project Settings → API.
2. **Create your admin auth user** — Supabase dashboard → Authentication → Users → Add user → Create new user. Email = the one you'll sign in with. Set a strong password. Confirm the email.
3. **Confirm the email is allow-listed** — the migration seeds `citrineglobalindia@gmail.com` into the `vivanterra_admin_users` table. Add or replace with your own admin emails as needed:
   ```sql
   insert into vivanterra_admin_users (email, full_name)
   values ('you@example.com', 'Your Name');
   ```
4. **Redeploy** so Vercel picks up the env vars, then visit `/admin/login`.

### Adding more admins

A signed-in user is treated as an admin only if their email appears in `vivanterra_admin_users`. To grant access, create the auth user in the Supabase dashboard *and* insert their email into that table.

### Data model

- `vivanterra_admin_users(email, full_name, created_at)` — allow-list.
- `vivanterra_enquiries(id, name, email, phone, scope, budget, message, project_slug, source, status, notes, user_agent, ip_address, created_at, updated_at)` — leads. Status enum: `new`, `contacted`, `qualified`, `closed`, `spam`.
- RLS only allows read/update to authenticated users whose email is in the allow-list. Inserts are server-side via the service-role key.

### WhatsApp (current state)

Click-to-chat is wired into Nav, Footer, Concierge, the Projects page CTA, and every admin enquiry detail page (deep-links to `wa.me/918867589797`, and to the lead's phone when present). Programmatic WhatsApp notifications (auto-message on new enquiry) are Phase 2 — separate scope.
