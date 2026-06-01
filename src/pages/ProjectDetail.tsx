import { useParams, Link, Navigate } from "react-router-dom";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
  ArrowLeft,
  ArrowUpRight,
  Loader2,
  MapPin,
  Send,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Seo from "@/components/seo/Seo";
import PageShell from "@/components/ui/PageShell";
import Reveal from "@/components/ui/Reveal";
import { getRelatedProjects, type Project } from "@/data/projects";
import { useProject } from "@/lib/use-projects";
import { submitContactEnquiry, type ContactEnquiry } from "@/lib/contact";

const inlineSchema = z.object({
  name: z.string().trim().min(2, "Please share your name"),
  email: z.string().trim().email("A valid email, please"),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || /^[+\d\s\-()]{7,20}$/.test(v),
      "Check the phone number",
    ),
  message: z.string().trim().min(10, "A few more words help us reply better"),
});
type InlineValues = z.infer<typeof inlineSchema>;

export default function ProjectDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { project, loading, notFound } = useProject(slug);

  if (notFound) {
    return <Navigate to="/404" replace />;
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <Loader2 className="animate-spin text-ink/40" size={28} />
      </div>
    );
  }

  void loading;
  const related = getRelatedProjects(project.slug, 3);

  return (
    <>
      <Seo
        title={project.title}
        description={`${project.tagline} ${project.summary}`}
        image={project.hero}
        path={`/projects/${project.slug}`}
      />
    <PageShell
      eyebrow={`Project — ${project.status}`}
      title={
        <>
          {project.title}{" "}
          <span className="italic text-gold font-light normal-case">
            — {project.location.split(",")[0]}.
          </span>
        </>
      }
      intro={project.tagline}
    >
      {/* Back link */}
      <Reveal>
        <Link
          to={`/projects/${project.status.toLowerCase()}`}
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-muted-soft hover:text-gold transition-colors"
        >
          <ArrowLeft size={14} />
          {project.status} projects
        </Link>
      </Reveal>

      {/* Gallery */}
      <section className="mt-12 md:mt-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-sm bg-ink/5">
            <Swiper
              modules={[Pagination, Keyboard]}
              spaceBetween={0}
              slidesPerView={1}
              keyboard={{ enabled: true }}
              pagination={{ clickable: true }}
              className="aspect-[16/10]"
            >
              {project.gallery.map((src, idx) => (
                <SwiperSlide key={src + idx}>
                  <img
                    src={src}
                    alt={`${project.title} — image ${idx + 1}`}
                    loading={idx === 0 ? "eager" : "lazy"}
                    className="h-full w-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </Reveal>
      </section>

      {/* Specs + description */}
      <section className="mt-20 md:mt-28 grid lg:grid-cols-12 gap-12 lg:gap-16">
        <Reveal className="lg:col-span-7">
          <div className="eyebrow text-gold mb-5">About the project</div>
          <h2
            className="font-display text-ink uppercase mb-8"
            style={{
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {project.tagline}
          </h2>
          <div className="space-y-5 text-ink/80 leading-relaxed text-[16px] md:text-[17px]">
            {project.description.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </Reveal>

        <Reveal className="lg:col-span-5" delay={0.1}>
          <SpecCard project={project} />
        </Reveal>
      </section>

      {/* Enquiry */}
      <section className="mt-24 md:mt-32" id="enquire">
        <Reveal>
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="eyebrow text-gold mb-5">Enquire</div>
              <h2
                className="font-display text-ink uppercase"
                style={{
                  fontSize: "clamp(28px, 3.4vw, 44px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                Begin a quiet conversation about {project.title}.
              </h2>
              <p className="mt-6 text-muted-soft leading-relaxed">
                Send a short note and we'll arrange a private walk-through
                with the architect. Every enquiry is read by our concierge.
              </p>
              <Link
                to={`/contact?project=${project.slug}`}
                className="inline-flex items-center gap-1 mt-8 text-[12px] tracking-[0.18em] uppercase font-medium text-ink hover:text-gold transition-colors nav-link"
              >
                Or visit the studio
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="lg:col-span-7">
              <InlineEnquiryForm project={project} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-24 md:mt-32">
          <div className="hairline-dark mb-10 md:mb-16" />
          <div className="flex items-center gap-3 mb-10">
            <span className="h-px w-10 bg-gold" />
            <span className="eyebrow text-muted-soft">More from the studio</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {related.map((p, i) => (
              <motion.article
                key={p.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.06,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
                className="group"
              >
                <Link to={`/projects/${p.slug}`} className="block">
                  <div className="relative img-zoom aspect-[4/5] overflow-hidden rounded-sm bg-ink/5 mb-5">
                    <img
                      src={p.hero}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                    />
                    <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-paper/90 backdrop-blur-sm text-ink px-3 py-1 text-[10px] tracking-[0.18em] font-medium uppercase rounded-full">
                      {p.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] tracking-[0.16em] uppercase text-muted-soft mb-2">
                    <MapPin size={11} className="opacity-60" />
                    <span>{p.location}</span>
                  </div>
                  <h3 className="font-display text-ink text-xl group-hover:text-gold transition-colors">
                    {p.title}
                  </h3>
                </Link>
              </motion.article>
            ))}
          </div>
        </section>
      )}
    </PageShell>
    </>
  );
}

/* ───────── Bits ───────── */

function SpecCard({ project }: { project: Project }) {
  return (
    <div
      className="relative overflow-hidden bg-ink text-paper rounded-sm p-8 md:p-10"
      style={{
        boxShadow:
          "0 30px 80px -30px rgba(78,115,83,0.6), 0 0 0 1px rgba(196,169,106,0.18)",
      }}
    >
      <div
        aria-hidden
        className="absolute -top-1/4 -right-1/4 w-[80%] h-[80%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(196,169,106,0.18) 0%, rgba(196,169,106,0) 70%)",
          filter: "blur(40px)",
        }}
      />
      <div className="relative">
        <div className="eyebrow text-gold mb-4">Specifications</div>
        <h3
          className="font-display uppercase mb-6"
          style={{
            fontSize: "clamp(22px, 2.6vw, 30px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          {project.title}
        </h3>

        <dl className="divide-y divide-paper/15">
          {project.specs.map((s) => (
            <div
              key={s.label}
              className="flex items-baseline justify-between gap-4 py-3.5"
            >
              <dt className="text-paper/55 text-[11px] tracking-[0.18em] uppercase">
                {s.label}
              </dt>
              <dd className="text-paper text-sm text-right">{s.value}</dd>
            </div>
          ))}
          {project.possession && (
            <div className="flex items-baseline justify-between gap-4 py-3.5">
              <dt className="text-paper/55 text-[11px] tracking-[0.18em] uppercase">
                Possession
              </dt>
              <dd className="text-gold text-sm text-right tabular-nums">
                {project.possession}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-7 flex items-start gap-3 text-paper/85 text-sm">
          <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
          <span>{project.location}</span>
        </div>
      </div>
    </div>
  );
}

function InlineEnquiryForm({ project }: { project: Project }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InlineValues>({
    resolver: zodResolver(inlineSchema),
    defaultValues: {
      message: `I'd like to learn more about ${project.title}.`,
    },
    mode: "onTouched",
  });
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [done, setDone] = useState(false);

  const onSubmit = async (values: InlineValues) => {
    const payload: ContactEnquiry = {
      ...(values as InlineValues),
      scope: "residence",
      projectSlug: project.slug,
    } as ContactEnquiry;
    const result = await submitContactEnquiry(payload, {
      honeypot: honeypotRef.current?.value,
    });

    if ("reason" in result) {
      const description =
        result.reason === "timeout"
          ? "The request took too long. Please try again in a moment."
          : result.reason === "server"
            ? `We couldn't deliver your enquiry (${result.status ?? "error"}). Please try /contact or email hello@vivanterra.in.`
            : "We couldn't reach our servers. Please check your connection and try again.";
      toast.error("Enquiry not sent", { description });
      return;
    }

    toast.success("Enquiry received", {
      description: result.mock
        ? "We've logged your message — a concierge will reach out shortly."
        : "We typically respond within one business day.",
    });
    reset({
      message: `I'd like to learn more about ${project.title}.`,
    } as InlineValues);
    if (honeypotRef.current) honeypotRef.current.value = "";
    setDone(true);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 bg-paper border border-line-dark rounded-sm p-7 md:p-9"
    >
      {/* Honeypot */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden"
      >
        <label htmlFor={`hp-${project.slug}`}>Company (leave blank)</label>
        <input
          ref={honeypotRef}
          id={`hp-${project.slug}`}
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field error={errors.name?.message}>
          <input
            type="text"
            autoComplete="name"
            placeholder="Your name"
            className={inputCls}
            {...register("name")}
          />
        </Field>
        <Field error={errors.email?.message}>
          <input
            type="email"
            autoComplete="email"
            placeholder="Email"
            className={inputCls}
            {...register("email")}
          />
        </Field>
      </div>

      <Field error={errors.phone?.message}>
        <input
          type="tel"
          autoComplete="tel"
          placeholder="Phone (optional)"
          className={inputCls}
          {...register("phone")}
        />
      </Field>

      <Field error={errors.message?.message}>
        <textarea
          rows={4}
          placeholder="A short note about the residence you're imagining…"
          className={`${inputCls} resize-none`}
          {...register("message")}
        />
      </Field>

      <div className="flex items-center justify-between gap-4 pt-1">
        <span className="text-[11px] tracking-[0.16em] uppercase text-muted-soft">
          Re: {project.title}
        </span>
        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative inline-flex items-center justify-center gap-2 h-12 px-6 bg-gold text-ink font-semibold text-[11px] tracking-[0.20em] uppercase rounded-sm overflow-hidden transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Sending
            </>
          ) : (
            <>
              Send enquiry
              <Send size={12} />
            </>
          )}
        </button>
      </div>

      {done && (
        <p className="text-sm text-muted-soft italic">
          Thank you — we'll be in touch shortly.
        </p>
      )}
    </form>
  );
}

const inputCls =
  "w-full bg-[rgba(78,115,83,0.04)] border border-line-dark rounded-md px-4 py-3 text-[15px] text-ink placeholder:text-ink/45 outline-none focus:border-gold focus:bg-paper transition-colors";

function Field({
  error,
  children,
}: {
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
      {error && (
        <p className="mt-1.5 text-[12px] tracking-wide text-[hsl(var(--destructive))] pl-1">
          {error}
        </p>
      )}
    </div>
  );
}
