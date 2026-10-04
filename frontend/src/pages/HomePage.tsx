import { Link } from 'react-router-dom'
import { Download, MapPin } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa6'
import QuantizedSignal from '@/components/ui/QuantizedSignal'
import ProjectList from '@/components/ui/ProjectList'
import { useProjects } from '@/lib/data'
import { EDUCATION, EXPERIENCE, PROFILE, SKILL_GROUPS } from '@/content/profile'

export default function HomePage() {
  const { data: projects = [] } = useProjects()
  const featured = (projects.some((p) => p.featured) ? projects.filter((p) => p.featured) : projects).slice(0, 3)

  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-32 sm:pt-40 pb-16">
        <div className="section-container">
          <h1 className="font-display font-bold text-[clamp(2.75rem,9vw,6.5rem)] leading-[0.95] tracking-[-0.035em]">
            {PROFILE.name}
          </h1>
          <p className="mt-8 text-xl sm:text-2xl leading-snug max-w-[34ch] text-ink">{PROFILE.headline}</p>
          <p className="mt-5 flex items-start gap-2 text-muted max-w-prose">
            <MapPin size={18} className="mt-1 shrink-0 text-signal" aria-hidden />
            <span>
              {PROFILE.location}. {PROFILE.availability}
            </span>
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/projects" className="btn-primary">
              See my projects
            </Link>
            {PROFILE.cvUrl && (
              <a href={PROFILE.cvUrl} download className="btn-secondary">
                <Download size={16} aria-hidden /> Download CV
              </a>
            )}
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <FaLinkedin size={16} aria-hidden /> LinkedIn
            </a>
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <FaGithub size={16} aria-hidden /> GitHub
            </a>
          </div>

          <QuantizedSignal />
        </div>
      </section>

      {/* ── Selected work ── */}
      <section className="py-16" aria-labelledby="work">
        <div className="section-container">
          <div className="flex items-end justify-between gap-6 mb-8">
            <h2 id="work" className="section-title mb-0">
              Selected work
            </h2>
            <Link to="/projects" className="link text-[0.95rem] shrink-0">
              All projects
            </Link>
          </div>
          <ProjectList projects={featured} />
        </div>
      </section>

      {/* ── Experience ── */}
      <section id="experience" className="py-16" aria-labelledby="experience-title">
        <div className="section-container">
          <h2 id="experience-title" className="section-title">
            Experience
          </h2>
          <p className="section-subtitle">
            Over twelve years across security software, e-commerce, enterprise integration and government systems,
            in Sri Lanka and Finland.
          </p>

          <ol className="relative border-l-2 border-line ml-1.5">
            {EXPERIENCE.map((job) => (
              <li key={job.org} className="relative pl-8 pb-12 last:pb-0">
                <span
                  className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-paper border-[3px] border-signal"
                  aria-hidden
                />
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <h3 className="text-xl font-bold">{job.org}</h3>
                  <span className="text-muted">{job.place}</span>
                </div>
                <p className="mt-0.5 font-medium">
                  {job.role}
                  {job.period && <span className="text-muted font-normal">, {job.period}</span>}
                </p>
                <p className="mt-3 text-muted max-w-prose">{job.summary}</p>
                {job.highlights.length > 0 && (
                  <ul className="mt-3 space-y-1.5 max-w-prose list-disc pl-5 marker:text-signal">
                    {job.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                )}
                <p className="mt-3 text-sm text-muted">{job.stack.join(', ')}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Education ── */}
      <section className="py-16" aria-labelledby="education">
        <div className="section-container">
          <h2 id="education" className="section-title mb-8">
            Education and certification
          </h2>
          <dl className="grid sm:grid-cols-3 gap-8">
            {EDUCATION.map((e) => (
              <div key={e.title} className="border-t-2 border-ink pt-4">
                <dt className="font-display font-bold text-lg leading-snug">{e.title}</dt>
                <dd className="mt-1 font-medium">{e.org}</dd>
                <dd className="mt-2 text-muted text-[0.95rem]">{e.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Skills ── */}
      <section className="py-16" aria-labelledby="skills">
        <div className="section-container">
          <h2 id="skills" className="section-title mb-8">
            Tools I work with
          </h2>
          <dl className="divide-y divide-line border-y border-line">
            {SKILL_GROUPS.map((g) => (
              <div key={g.label} className="grid sm:grid-cols-[12rem_1fr] gap-2 py-4">
                <dt className="font-medium">{g.label}</dt>
                <dd className="text-muted">{g.items.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="py-16">
        <div className="section-container">
          <div className="bg-ink text-paper rounded-lg px-6 py-10 sm:px-10 sm:py-12 grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <h2 className="text-3xl font-bold text-paper">Hiring for ML, data or software?</h2>
              <p className="mt-3 text-paper/75 max-w-prose">
                Tell me about the role and the team. I&apos;m based in Espoo and available to start soon.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-paper text-ink font-medium hover:bg-signal hover:text-paper transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
