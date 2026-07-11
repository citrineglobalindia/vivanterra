import LegalPage from "@/components/ui/LegalPage";

export default function Terms() {
  return (
    <LegalPage
      eyebrow="Policies"
      title="Terms of Use"
      intro="The terms on which this website is offered, and the limits of what it represents."
      seoDescription="Terms of use for vivanterra.in — permitted use, intellectual property, third-party links and limitation of liability."
      updated="July 2026"
    >
      <p>
        By accessing vivanterra.in you accept these terms. If you do not accept
        them, please do not use the site.
      </p>

      <h2>Use of this site</h2>
      <p>
        The site is provided for information about Vivanterra Real Estate and
        its residences. You may browse it, and print or download extracts for
        your own personal reference. You may not reproduce, republish, sell or
        exploit any part of it commercially, scrape it by automated means, or
        use it in any way that damages or interferes with its operation.
      </p>

      <h2>No offer or contract</h2>
      <p>
        Nothing on this site is an offer, an invitation to offer, or a contract.
        Details of residences — plans, areas, specifications, amenities, pricing
        and possession dates — are indicative and subject to change. No binding
        obligation arises until a written agreement is signed by both parties and
        duly registered where required by law. Please read the{" "}
        <a href="/disclaimer">Disclaimer</a> alongside these terms.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The Vivanterra name and mark, and all text, photography, renders, plans,
        layouts and design on this site, belong to Vivanterra Real Estate or its
        licensors and are protected by law. Nothing here grants you a licence to
        use them.
      </p>

      <h2>Third-party links</h2>
      <p>
        Where we link to another site — including Velociti and our social
        channels — we do so for convenience. We do not control those sites and
        are not responsible for their content or their handling of your data.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        The site is provided on an "as is" basis. To the extent permitted by
        law, we exclude liability for any loss arising from your reliance on
        information published here, or from the site being unavailable,
        interrupted, or containing errors. This does not limit any liability
        that cannot lawfully be limited.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of India. The courts at Bengaluru,
        Karnataka shall have exclusive jurisdiction over any dispute arising from
        them.
      </p>

      <h2>Changes</h2>
      <p>
        We may amend these terms from time to time. The version published here is
        the one that applies. Questions to{" "}
        <a href="mailto:hello@vivanterra.in">hello@vivanterra.in</a>.
      </p>
    </LegalPage>
  );
}
