import Seo from "@/components/seo/Seo";
import PageShell from "@/components/ui/PageShell";
import ProjectListing from "@/components/projects/ProjectListing";
import ProjectsGuide from "@/components/projects/ProjectsGuide";

export default function Projects() {
  return (
    <>
      <Seo
        title="Residences for sale in Bengaluru"
        description="Vivanterra residences across Bengaluru — wellness-first apartments and full-floor homes in Sadashiva Nagar, Indiranagar, Jayanagar, Cooke Town and more. Ongoing, upcoming and completed projects."
      />
      <PageShell
        eyebrow="Residences — Bengaluru"
        title={
          <>
            Vivanterra residences{" "}
            <span className="italic text-gold">in Bengaluru.</span>
          </>
        }
        intro="Wellness-first apartments and full-floor residences across the city's most considered neighbourhoods — from Sadashiva Nagar to Richmond Town. Filter by stage below, or scroll on for the guide."
      >
        <ProjectListing initialFilter="All" />
        <ProjectsGuide />
      </PageShell>
    </>
  );
}
