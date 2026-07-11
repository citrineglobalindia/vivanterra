import { type ReactNode } from "react";
import Seo from "@/components/seo/Seo";
import PageShell from "@/components/ui/PageShell";

type Props = {
  eyebrow: string;
  title: string;
  intro: string;
  seoDescription: string;
  updated: string;
  children: ReactNode;
};

/**
 * Shared shell for the policy pages (Privacy, Terms, Disclaimer, RERA).
 * Uses the site's editorial PageShell so the type, cream ground and gold
 * accents match the rest of Vivanterra.
 */
export default function LegalPage({
  eyebrow,
  title,
  intro,
  seoDescription,
  updated,
  children,
}: Props) {
  return (
    <>
      <Seo title={title} description={seoDescription} />
      <PageShell eyebrow={eyebrow} title={title} intro={intro}>
        <div className="max-w-3xl">
          <p className="eyebrow text-gold mb-10">Last updated — {updated}</p>
          <div className="prose prose-neutral max-w-none prose-headings:font-display prose-headings:font-light prose-headings:text-ink prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-p:text-ink/75 prose-p:leading-relaxed prose-li:text-ink/75 prose-li:leading-relaxed prose-strong:text-ink prose-a:text-gold prose-a:no-underline hover:prose-a:underline">
            {children}
          </div>
        </div>
      </PageShell>
    </>
  );
}
