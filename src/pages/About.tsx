import PageShell from "@/components/ui/PageShell";

export default function About() {
  return (
    <PageShell
      eyebrow="About — Velociti Real Estate"
      title={
        <>
          Building with <span className="italic text-gold">conviction.</span>
        </>
      }
      intro="Velociti Real Estate is a Bengaluru-based developer crafting residences that pair contemporary architecture with quiet, considered detail."
    />
  );
}
