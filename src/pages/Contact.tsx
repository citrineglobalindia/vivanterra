import PageShell from "@/components/ui/PageShell";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <PageShell
      eyebrow="Contact"
      title={
        <>
          Begin a <span className="italic text-gold">conversation.</span>
        </>
      }
      intro="Tell us about the residence you're imagining. We typically respond within one business day."
    >
      <div className="grid md:grid-cols-12 gap-12 md:gap-20">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="md:col-span-7 space-y-8"
          onSubmit={(e) => e.preventDefault()}
        >
          {[
            { label: "Name", type: "text", name: "name" },
            { label: "Email", type: "email", name: "email" },
            { label: "Phone", type: "tel", name: "phone" },
            { label: "Project of interest", type: "text", name: "project" },
          ].map((f) => (
            <div key={f.name}>
              <label className="eyebrow text-muted-soft block mb-3">{f.label}</label>
              <input
                type={f.type}
                name={f.name}
                className="w-full bg-transparent border-0 border-b border-ink/20 focus:border-ink py-3 text-lg text-ink outline-none transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="eyebrow text-muted-soft block mb-3">Message</label>
            <textarea
              rows={4}
              name="message"
              className="w-full bg-transparent border-0 border-b border-ink/20 focus:border-ink py-3 text-lg text-ink outline-none transition-colors resize-none"
            />
          </div>
          <button type="submit" className="btn btn-dark">
            Send enquiry
          </button>
        </motion.form>

        <div className="md:col-span-4 md:col-start-9 space-y-10">
          <div>
            <div className="eyebrow text-muted-soft mb-3">Studio</div>
            <p className="text-ink leading-relaxed">
              4th Floor, Cassini Towers,
              <br />
              Upper Palace Orchids,
              <br />
              13th Cross Rd, Sadashiva Nagar,
              <br />
              Bengaluru 560080
            </p>
          </div>
          <div>
            <div className="eyebrow text-muted-soft mb-3">Direct</div>
            <p className="text-ink">+91 99866 66774</p>
            <p className="text-ink">hello@velociti.com</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
