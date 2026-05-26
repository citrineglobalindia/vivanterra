import Seo from "@/components/seo/Seo";
import PageShell from "@/components/ui/PageShell";
import ProjectListing from "@/components/projects/ProjectListing";
import type { ProjectStatus } from "@/data/projects";

interface Props {
  status: ProjectStatus;
}

const COPY: Record<ProjectStatus, { intro: string; tagline: string }> = {
  Ongoing: {
    intro:
      "Sites currently under active construction across our most considered Bengaluru addresses.",
    tagline: "in motion.",
  },
  Upcoming: {
    intro:
      "New residences in design and pre-construction — early access for clients who like to plan ahead.",
    tagline: "in the making.",
  },
  Completed: {
    intro: "Delivered residences from our Bengaluru archive — already lived in.",
    tagline: "delivered.",
  },
};

export default function ProjectsByStatus({ status }: Props) {
  const c = COPY[status];
  return (
    <>
      <Seo
        title={`${status} Projects in Bengaluru`}
        description={`Vivanterra ${status.toLowerCase()} residential projects in Bengaluru — ${c.intro}`}
      />
      <PageShell
        eyebrow={`Residences — ${status}`}
        title={
          <>
            {status} <span className="italic text-gold">{c.tagline}</span>
          </>
        }
        intro={c.intro}
      >
        <ProjectListing initialFilter={status} />
      </PageShell>
    </>
  );
}
