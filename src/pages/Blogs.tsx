import PageShell from "@/components/ui/PageShell";

export default function Blogs() {
  return (
    <PageShell
      eyebrow="Journal"
      title={
        <>
          Notes from <span className="italic text-gold">the studio.</span>
        </>
      }
      intro="Essays, field notes and progress reports from our projects across India."
    />
  );
}
