import PageShell from "@/components/ui/PageShell";

interface Props {
  status: "Ongoing" | "Upcoming" | "Completed";
}

const COPY: Record<Props["status"], { intro: string; tagline: string }> = {
  Ongoing: {
    intro: "Sites currently under active construction.",
    tagline: "in motion.",
  },
  Upcoming: {
    intro: "New residences in design and pre-construction.",
    tagline: "in the making.",
  },
  Completed: {
    intro: "Delivered residences from our archive.",
    tagline: "delivered.",
  },
};

export default function ProjectsByStatus({ status }: Props) {
  const c = COPY[status];
  return (
    <PageShell
      eyebrow={`Projects — ${status}`}
      title={
        <>
          {status} <span className="italic text-gold">{c.tagline}</span>
        </>
      }
      intro={c.intro}
    />
  );
}
