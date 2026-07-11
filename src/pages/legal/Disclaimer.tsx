import LegalPage from "@/components/ui/LegalPage";

export default function Disclaimer() {
  return (
    <LegalPage
      eyebrow="Policies"
      title="Disclaimer"
      intro="What the imagery, plans and figures on this site do — and do not — represent."
      seoDescription="Disclaimer for vivanterra.in — imagery, plans, areas, pricing and possession dates are indicative and subject to change without notice."
      updated="July 2026"
    >
      <p>
        This website and its contents are for general information only. They do
        not constitute an offer, an invitation, a solicitation or a legal
        commitment of any kind by Vivanterra Real Estate.
      </p>

      <h2>Imagery and renders</h2>
      <p>
        Photographs, renders, walkthroughs, elevations and interior views on this
        site are artistic impressions or stock imagery used for illustration.
        They are <strong>not</strong> a representation of the actual product, its
        finishes, its furniture or its surroundings. Landscaping, trees, skies,
        fixtures and furnishings shown are indicative and do not form part of any
        standard offering unless expressly stated in a written agreement.
      </p>

      <h2>Plans, areas and specifications</h2>
      <p>
        Floor plans, layouts, carpet areas, unit sizes and specifications are
        indicative, drawn to no fixed scale, and subject to change by the
        architect, the developer, or the sanctioning authority. Areas quoted may
        vary within permissible tolerances. Please refer to the sanctioned plans
        and the agreement for sale for the final, binding position.
      </p>

      <h2>Pricing and possession</h2>
      <p>
        Prices are indicative, exclusive of applicable taxes, statutory charges,
        registration and other levies unless expressly stated, and are subject to
        revision without notice. Possession dates are estimates and may change
        for reasons including regulatory approvals, force majeure, and site
        conditions.
      </p>

      <h2>Reliance</h2>
      <p>
        Prospective purchasers should satisfy themselves independently — by
        inspecting the sanctioned plans, the approvals, the title, and the RERA
        registration for the relevant project — before relying on anything
        published here or acting on it. Vivanterra Real Estate accepts no
        liability for any loss arising from reliance on the contents of this
        site.
      </p>

      <p>
        See also our <a href="/rera-disclaimer">RERA Disclaimer</a> and{" "}
        <a href="/terms">Terms of Use</a>.
      </p>
    </LegalPage>
  );
}
