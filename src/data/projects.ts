/**
 * Project catalogue.
 *
 * Hardcoded for now — abstract behind a getProjects() façade later if a CMS
 * is introduced. Image URLs use Unsplash placeholders to match the look of
 * the rest of the site.
 */

export type ProjectStatus = "Ongoing" | "Upcoming" | "Completed";

export type ProjectSpec = {
  label: string;
  value: string;
};

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  status: ProjectStatus;
  location: string;
  /** Hero / OG image. */
  hero: string;
  /** Gallery images for the carousel. First one may repeat the hero. */
  gallery: string[];
  /** Short summary used on listing cards. */
  summary: string;
  /** Longer body paragraphs for the detail page. */
  description: string[];
  /** Spec sheet shown on the detail page. */
  specs: ProjectSpec[];
  /** Optional possession / handover date for ongoing & upcoming projects. */
  possession?: string;
  /** Display price label (e.g. '₹ 4.5 Cr Onwards'). Falls back to 'Price on request'. */
  price?: string;
  /** Used when the listing wants to highlight one. */
  featured?: boolean;
};

const PROJECTS: Project[] = [
  {
    slug: "bare-bespoke-residence",
    title: "Bare & Bespoke Residence",
    tagline: "Eight residences above a quiet courtyard.",
    status: "Upcoming",
    location: "Yelahanka, Bengaluru",
    hero: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1800&q=85",
    ],
    summary:
      "Eight full-floor residences set around a central courtyard, topped out this season and finishing through 2027.",
    description: [
      "Bare & Bespoke Residence is a small, careful building on a leafy corner of Yelahanka — eight residences, one per floor, all opening onto a shared courtyard at the heart of the plan.",
      "Materials follow the courtyard's quiet: kota stone underfoot, brushed brass at the joinery, oak inside the cabinetwork. The penthouse adds a private terrace and a fourth bedroom.",
      "The building topped out ahead of schedule in March 2026 and is now in the long, slow phase of finishes. First handovers begin Q1 2027.",
    ],
    specs: [
      { label: "Typology", value: "Full-floor residences" },
      { label: "Units", value: "8 (incl. 1 penthouse)" },
      { label: "Configuration", value: "3 & 4 BHK" },
      { label: "Carpet area", value: "3,400 — 5,200 sq ft" },
      { label: "Floors", value: "G + 8" },
      { label: "Architect", value: "Aravind Menon, principal" },
    ],
    possession: "Q1 2027",
    featured: true,
    price: "₹ 8.5 Cr Onwards*"
  },
  {
    slug: "the-living-edit",
    title: "The Living Edit",
    tagline: "A six-storey building on a long, narrow plot.",
    status: "Upcoming",
    location: "Shivaram Karanth Layout, Bengaluru",
    hero: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1800&q=85",
    ],
    summary:
      "Twelve compact residences on a narrow Shivaram Karanth Layout plot, organised around a stepped western façade.",
    description: [
      "The Living Edit works hard on a 40-foot frontage. Twelve residences across six floors, each plan turned sideways to take its light from a stepped western façade that softens the afternoon sun.",
      "The ground floor opens to a stone-paved entry court with a single rain tree. Parking is tucked underground, leaving the street edge to the building's quietest face.",
    ],
    specs: [
      { label: "Typology", value: "Apartment residences" },
      { label: "Units", value: "12" },
      { label: "Configuration", value: "2 & 3 BHK" },
      { label: "Carpet area", value: "1,650 — 2,400 sq ft" },
      { label: "Floors", value: "B + G + 6" },
      { label: "Architect", value: "Studio in-house" },
    ],
    possession: "Q3 2027",
    price: "₹ 3.2 Cr Onwards*"
  },
  {
    slug: "sense-of-space",
    title: "Sense of Space",
    tagline: "Five row-houses sharing one long garden.",
    status: "Ongoing",
    location: "Sadashiva Nagar, Bengaluru",
    hero: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=1800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1800&q=85",
    ],
    summary:
      "Five three-storey row-houses sharing a long garden — a quiet rebuttal to the apartment-block default.",
    description: [
      "Sense of Space is what the brief became when we proposed houses, not flats. Five row-houses tuck against the eastern boundary of the site; the entire western edge becomes a long, shared garden with a single old jamun tree at its centre.",
      "Each house has its own front door from the street, its own staircase, its own roof.",
    ],
    specs: [
      { label: "Typology", value: "Row houses" },
      { label: "Units", value: "5" },
      { label: "Configuration", value: "4 BHK + study" },
      { label: "Carpet area", value: "4,100 sq ft each" },
      { label: "Floors", value: "G + 2" },
      { label: "Architect", value: "Aravind Menon, principal" },
    ],
    possession: "Q4 2027",
    price: "₹ 12 Cr Onwards*"
  },
  {
    slug: "bellevue-nest",
    title: "Bellevue Nest",
    tagline: "A mid-rise around a hundred-year-old tree.",
    status: "Completed",
    location: "Thimmegowdana Hosahalli, Bengaluru",
    hero: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1800&q=85",
    ],
    summary:
      "A ten-residence building wrapped around a protected hundred-year-old rain tree at the centre of the plot.",
    description: [
      "Bellevue Nest — 'the wish-giving tree' — is named for the rain tree at the centre of the plot. The plan steps back to leave it untouched. Every residence has at least one window onto its canopy.",
      "Design is complete; we break ground in late 2026.",
    ],
    specs: [
      { label: "Typology", value: "Apartment residences" },
      { label: "Units", value: "10" },
      { label: "Configuration", value: "3 BHK" },
      { label: "Carpet area", value: "2,800 — 3,200 sq ft" },
      { label: "Floors", value: "B + G + 5" },
      { label: "Architect", value: "Studio in-house" },
    ],
    price: "₹ 6.8 Cr Onwards*"
  },
  {
    slug: "elite-serenity",
    title: "Elite Serenity",
    tagline: "Twenty-four residences, delivered 2024.",
    status: "Completed",
    location: "Devanahalli, Bengaluru",
    hero: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85",
    ],
    summary:
      "Twenty-four residences across two wings, handed over in late 2024 and now fully occupied.",
    description: [
      "Elite Serenity was our largest delivery to date — twenty-four residences across two wings, with a shared lawn between them.",
      "Handed over in October 2024. The building is now fully occupied; the lawn was planted with the residents in attendance.",
    ],
    specs: [
      { label: "Typology", value: "Apartment residences" },
      { label: "Units", value: "24 (across 2 wings)" },
      { label: "Configuration", value: "2, 3 & 4 BHK" },
      { label: "Carpet area", value: "1,800 — 4,000 sq ft" },
      { label: "Floors", value: "B + G + 7" },
      { label: "Architect", value: "Studio in-house" },
    ],
    price: "On request"
  },
  {
    slug: "elite-pristine",
    title: "Elite Pristine",
    tagline: "Sixteen residences at the edge of the green belt.",
    status: "Completed",
    location: "Rajankunte, Bengaluru",
    hero: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1800&q=85",
    ],
    summary:
      "Sixteen residences on the northern green belt at Rajankunte — completed, handed over and fully occupied.",
    description: [
      "Elite Pristine sits where the city thins out into farmland. Sixteen residences, low to the ground, arranged so that every home looks onto open sky rather than onto its neighbour.",
      "The palette is deliberately plain — lime plaster, local stone, a deep timber soffit at the entrance. The planting was chosen for the water it does not need.",
      "Completed and handed over. The building is fully occupied.",
    ],
    specs: [
      { label: "Typology", value: "Apartment residences" },
      { label: "Units", value: "16" },
      { label: "Configuration", value: "2 & 3 BHK" },
      { label: "Carpet area", value: "1,500 — 2,600 sq ft" },
      { label: "Floors", value: "G + 4" },
      { label: "Architect", value: "Studio in-house" },
    ],
    price: "On request"
  },
];

export function getProjects(status?: ProjectStatus): Project[] {
  return status ? PROJECTS.filter((p) => p.status === status) : PROJECTS;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getRelatedProjects(slug: string, n = 3): Project[] {
  const current = getProjectBySlug(slug);
  if (!current) return [];
  const sameStatus = PROJECTS.filter(
    (p) => p.slug !== slug && p.status === current.status,
  );
  const others = PROJECTS.filter(
    (p) => p.slug !== slug && p.status !== current.status,
  );
  return [...sameStatus, ...others].slice(0, n);
}


/** Pulls "Configuration" from a project's spec sheet (e.g. "3 & 4 BHK"). */
export function getProjectConfig(project: Project): string | undefined {
  return project.specs.find((s) => s.label === "Configuration")?.value;
}

/** Pulls "Carpet area" from a project's spec sheet. */
export function getProjectArea(project: Project): string | undefined {
  return project.specs.find((s) => s.label === "Carpet area")?.value;
}

/** Pulls "Typology" from a project's spec sheet (e.g. "Full-floor residences"). */
export function getProjectTypology(project: Project): string | undefined {
  return project.specs.find((s) => s.label === "Typology")?.value;
}

/** Display label for the project's price — falls back to "Price on request". */
export function getProjectPriceLabel(project: Project): string {
  return project.price ?? "Price on request";
}
