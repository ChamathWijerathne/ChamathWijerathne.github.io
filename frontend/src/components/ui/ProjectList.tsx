import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { FaGithub } from 'react-icons/fa6'
import { type Project } from '@/types'

export default function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ul className="border-t border-line">
      {projects.map((p) => (
        <li key={p.slug} className="border-b border-line">
          <div className="group relative grid md:grid-cols-[1fr_auto] gap-x-10 gap-y-3 py-7">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold">
                <Link
                  to={`/projects/${p.slug}`}
                  className="after:absolute after:inset-0 group-hover:text-accent transition-colors"
                >
                  {p.title}
                </Link>
              </h3>
              <p className="mt-2 text-muted max-w-prose">{p.description}</p>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
                {p.tech_stack.slice(0, 5).map((t) => (
                  <li key={t} className="tag">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex md:flex-col items-center md:items-end gap-3 text-muted">
              <ArrowUpRight
                size={22}
                className="hidden md:block group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition"
                aria-hidden
              />
              {p.github_url && (
                <a
                  href={p.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 inline-flex items-center gap-1.5 text-sm hover:text-ink"
                >
                  <FaGithub size={15} /> Code
                </a>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
