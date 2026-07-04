/**
 * Journal posts.
 *
 * Moved out of pages/Blogs.tsx so the detail page can import them too.
 * Each post has a `body: string[]` of paragraphs that BlogDetail renders
 * as prose.
 */

export type Category =
  | "Architecture"
  | "Craft"
  | "Studio Notes"
  | "News"
  | "Updates"
  | "Inside Vivanterra";

export type Post = {
  slug: string;
  title: string;
  dek: string;
  category: Category;
  author: string;
  date: string;
  readingTime: string;
  image: string;
  body: string[];
  featured?: boolean;
};

export const POSTS: Post[] = [
  {
    slug: "year-of-materials",
    title: "Inside the studio: a year of materials.",
    dek: "Twelve months of stone, brass and oak — our head of design walks through the year's discoveries and the houses they shaped.",
    category: "Craft",
    author: "Reema Iyer",
    date: "5 July 2026",
    readingTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=85",
    featured: true,
    body: [
      "We start each year with a small ritual. The whole design team gathers on a Saturday in January, and we lay out everything we worked with the previous year — the stone samples, the brass swatches, the leftover oak offcuts, the failed mock-ups — across two long trestle tables in the studio. We walk around them with coffee. We argue.",
      "It is, in the cleanest sense, the most useful day of our year. Choices that felt brave in March look obvious in December. Choices that felt safe at the time look — sometimes — a little timid in hindsight.",
      "This year's table held a lot of stone. Kota in three finishes, the warm grey green we now use almost as a default. A pale Makrana that surprised us in the bathrooms of Olive Court. A brown Forest marble we ordered for a single feature wall and ended up extending across an entire kitchen floor.",
      "The brass, as always, was the hardest to settle. We tried four finishes from three foundries. The matte hand-burnished one — the one nobody wanted at first — is the one we kept.",
      "Oak was the quiet hero. We changed our sealant in May, and the floors we laid after that have aged better in six months than the ones we laid in spring have in a year. It is a small thing. It is also the entire game.",
      "If there is a thread through the year, it is this: we have stopped pretending that a material 'just is.' Every material is a hundred decisions, made by a hundred people, before it reaches us. Our job is to choose well, and then to choose again.",
      "Onwards to 2026 — and to a table that, with luck, will look a little different next January.",
    ],
  },
  {
    slug: "aurelia-bay-tops-out",
    title: "Aurelia Bay tops out in Sadashiva Nagar.",
    dek: "The first of our 2027 deliveries reaches its full height ahead of schedule. A note from the site, mid-celebration.",
    category: "Studio Notes",
    author: "Karthik Rao",
    date: "March 2026",
    readingTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85",
    body: [
      "Aurelia Bay topped out on Thursday — six weeks ahead of the schedule we set ourselves a year ago, which is a sentence we do not often get to type.",
      "The site team gathered on the eighth floor at sunset. There was the usual short speech, a pause to remember everyone who had worked through last year's monsoon, and a long slow look out over the rooftops of Sadashiva Nagar — which from this height take on a quality you cannot really photograph.",
      "Toppings-out are strange occasions. The hard, visible work is done; the long, slow, invisible work of finishes is just beginning. We sometimes describe it as the moment a building stops being a structure and starts becoming a home.",
      "From here, we move into the finishes phase. Joinery installs begin in May. Stone-laying through the summer. The lift cars arrive in September; the lobbies are stitched together in October.",
      "First handovers begin Q1 2027. We will be back here many times before then.",
    ],
  },
  {
    slug: "founding-architect",
    title: "A conversation with our founding architect.",
    dek: "On patience, restraint and the future of the Bengaluru skyline. Aravind Menon, in conversation with our editorial lead.",
    category: "Architecture",
    author: "Sara D'Souza",
    date: "February 2026",
    readingTime: "12 min read",
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=85",
    body: [
      "We sat with Aravind Menon, our founding architect, on the small terrace outside his office. It was the kind of February morning where Bengaluru pretends, for an hour or two, to be a hill station.",
      "We had a long conversation. Here are the parts of it we are allowed to print.",
      "On patience: 'Every building we have made worth talking about took longer than we first promised. I have stopped fighting that. The honest deadline is the one the building tells you, not the one the brochure does.'",
      "On restraint: 'I have made the mistake, twice, of putting too much into a small house. You cannot un-make that mistake. So now I begin every project by listing everything we will not do.'",
      "On the skyline: 'Bengaluru will get taller. I do not think that is necessarily bad. I think it is bad if every new building is taller for no reason. Height should be a response to a site, not a posture.'",
      "On the studio: 'I am most proud of the people who have stayed. We do not move fast. The people who like that have stayed; the people who didn't have left, and that is fair. The studio is, at this point, mostly an argument I have been having with the same eight or nine people for ten years.'",
      "On what comes next: 'A house in Coorg. A school, perhaps. A small library in the city we have been talking about for two years. We will see.'",
    ],
  },
  {
    slug: "courtyard-as-thesis",
    title: "The courtyard, again — a small thesis.",
    dek: "Why every Vivanterra residence begins, in some form, with a void at its centre. Light, breeze, and the long Indian afternoon.",
    category: "Architecture",
    author: "Aravind Menon",
    date: "February 2026",
    readingTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    body: [
      "Every plan we draw begins, eventually, with a void.",
      "This is not a stylistic tic — though I admit it has, by now, become something close to a signature. It is a response to a climate and a habit. The Indian afternoon is long, slow, and bright. It needs a room with no roof to dissipate into.",
      "The courtyard does work that no other room can. It moves air. It draws light into the deep middle of the plan. It holds rain. It is the only place in the house from which you can see weather change.",
      "It is also — and we say this without apology — a beautiful waste of space. A modern apartment is, by most metrics, optimised. A courtyard is the part of the plan we did not optimise. That is its purpose.",
      "Every one of our buildings has one. They are different sizes. They do different jobs. Sandalwood Row's is a garden the whole row shares. Aurelia Bay's is a square open to the sky from the second floor up. Kalpavriksha's is, in the end, a tree.",
      "If you take only one thing from us, take this: leave a void.",
    ],
  },
  {
    slug: "investment-the-long-view",
    title: "The long view: a residence as compound interest.",
    dek: "Quiet thoughts on land, location and the kind of architecture that gains rather than loses meaning over time.",
    category: "Inside Vivanterra",
    author: "Vivek Pillai",
    date: "January 2026",
    readingTime: "9 min read",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
    body: [
      "A residence is, among many other things, a financial instrument. We do not pretend otherwise. We do, however, have an opinion on what makes one a good one.",
      "The opinion is this: the cheapest part of a residence to get right is the part you cannot change later — the land it stands on. The most expensive part to get wrong is the same.",
      "Everything else is, to a degree, recoverable. A kitchen can be redone. A bathroom can be replanned. A façade can be repainted, then repainted again. The plot, the orientation, the neighbours and the access — those are decided once.",
      "We have, over fifteen years, watched this play out cleanly. The residences that gained the most in value are not, in every case, the ones we are proudest of architecturally. They are, almost without exception, the ones on the best plots.",
      "If you take a residence as an investment, optimise the plot first. Optimise the building second. The order matters more than people admit.",
    ],
  },
  {
    slug: "bengaluru-twelfth-floor",
    title: "Bengaluru, from a twelfth-floor window.",
    dek: "Fifteen years of watching this city grow — what we've seen and what we hope to keep.",
    category: "News",
    author: "Aravind Menon",
    date: "January 2026",
    readingTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=85",
    body: [
      "My office is on the twelfth floor of a building that, when we moved in, was one of the taller buildings on its street. It is now, by some margin, one of the shorter ones.",
      "There is a particular sadness to watching a city skyline rise around you. It is also exhilarating, in the proper sense of the word — it makes you breathe a little quicker.",
      "Bengaluru has changed more in the fifteen years I have looked out at it than any other city I have lived in. Some of that change is good. Some of it I would, given a vote, reverse. The trees we have lost are the loss that stays with me longest.",
      "What I hope to keep is this: the porches. The verandas. The small terraces. The corner shop. The frangipani. The names of streets. The pace at which old people walk.",
      "What we build matters. What we keep matters more.",
    ],
  },
  {
    slug: "joinery-millimetre",
    title: "Joinery, to the millimetre.",
    dek: "A field note from our cabinetmaker's workshop — and what 'a hand-finished detail' actually costs to make.",
    category: "Craft",
    author: "Reema Iyer",
    date: "December 2025",
    readingTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=85",
    body: [
      "We spent a morning at the workshop of the cabinetmaker who has done our joinery for nine of the past ten projects. He works with five people, three of whom have been with him for over a decade.",
      "We were there to settle a single detail — the reveal on the drawer fronts of a kitchen we are finishing in March. Two millimetres versus three.",
      "The difference matters more than it sounds. Three reads as a shadow line. Two reads as a mistake. The eye, even an untrained eye, knows.",
      "It took an hour to decide. We are going with two and a half.",
    ],
  },
  {
    slug: "ten-houses-in",
    title: "Ten houses in, and what we got wrong.",
    dek: "A candid retrospective from our principal architect on the lessons that shaped the next decade of work.",
    category: "Studio Notes",
    author: "Aravind Menon",
    date: "December 2025",
    readingTime: "10 min read",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=85",
    body: [
      "We have, as of last week, handed over the keys to our tenth completed residence. It seemed a good occasion to write down — honestly, in public — what we have gotten wrong.",
      "We made the bathrooms in the second project too small. They are still too small. The clients, to their credit, have not complained. We have privately apologised.",
      "We over-specified storage in the fourth project. The owners have used about sixty percent of it. The other forty has become the kind of cupboard that quietly fills with things nobody can name.",
      "We used the wrong stone, twice. Once for a kitchen counter that has stained more than we predicted. Once for a stair where the colour, in afternoon light, does not do what the sample promised.",
      "We chose the wrong contractor on the sixth project. Halfway through, we changed. We should have changed three months earlier.",
      "We waited too long on the seventh to bring in the landscape architect. The garden is good. It would have been excellent.",
      "What we have learnt, ten houses in, is that the small mistakes matter the most. The big ones are visible enough that everyone helps you fix them. The small ones are the ones you have to remember to look for.",
    ],
  },
  {
    slug: "stone-from-rajasthan",
    title: "On choosing stone from Rajasthan.",
    dek: "Why we travel for the right block — and what we look for when we get there.",
    category: "Craft",
    author: "Reema Iyer",
    date: "November 2025",
    readingTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=85",
    body: [
      "Twice a year, we fly to Udaipur and drive out to the quarries. It would be cheaper, by some measure, to choose stone from a catalogue. We have tried that. It does not work.",
      "Stone is a photograph and a promise. The block we eventually buy never quite looks like the block in the photograph. The block we eventually lay never quite looks like the block we bought. Stone moves through hands; each pair of hands changes it slightly.",
      "We go to the quarry to see the block under the sun it grew in. We mark it with chalk. We do not always buy on the first trip; sometimes we have to come back.",
      "What we look for is harder to write down than it is to recognise. Consistency of vein. The right kind of opacity. A surface that takes a finish without losing its quietness. The absence of the wrong kind of glitter.",
      "It is, in the end, a feeling. Stone is one of the last materials we choose with our hands and not a spreadsheet.",
    ],
  },
];

export function getPosts(): Post[] {
  return POSTS;
}

export function getPostBySlug(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, n = 3): Post[] {
  const current = getPostBySlug(slug);
  if (!current) return [];
  const sameCategory = POSTS.filter(
    (p) => p.slug !== slug && p.category === current.category,
  );
  const others = POSTS.filter(
    (p) => p.slug !== slug && p.category !== current.category,
  );
  return [...sameCategory, ...others].slice(0, n);
}
