import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { FaGithub } from 'react-icons/fa6'
import ReactMarkdown from 'react-markdown'
import { useProject } from '@/lib/data'

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { project, isLoading } = useProject(slug)

  if (isLoading) {
    return (
      <div className="pt-32 pb-20">
        <div className="section-container max-w-3xl space-y-4 animate-pulse" aria-busy="true">
          <div className="h-10 bg-line/50 rounded w-2/3" />
          <div className="h-5 bg-line/50 rounded w-full" />
          <div className="h-5 bg-line/50 rounded w-5/6" />
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="pt-32 pb-20">
        <div className="section-container max-w-3xl">
          <h1 className="section-title">Project not found</h1>
          <p className="text-muted mb-8">This project may have been renamed or removed.</p>
          <Link to="/projects" className="btn-primary">
            Browse all projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-28 pb-12">
      <article className="section-container max-w-3xl">
        <Link to="/projects" className="inline-flex items-center gap-2 text-muted hover:text-ink text-sm mb-10">
          <ArrowLeft size={14} aria-hidden /> All projects
        </Link>

        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">{project.title}</h1>
        <p className="mt-4 text-xl text-muted">{project.description}</p>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
          {project.tech_stack.map((t) => (
            <li key={t} className="tag">
              {t}
            </li>
          ))}
        </ul>

        {(project.github_url || project.live_url) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                <FaGithub size={16} aria-hidden /> View code
              </a>
            )}
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <ExternalLink size={16} aria-hidden /> Open live demo
              </a>
            )}
          </div>
        )}

        {project.image_url && (
          <img src={project.image_url} alt="" className="mt-10 w-full rounded-lg border border-line" />
        )}

        {project.long_description && (
          <div className="mt-10 prose prose-lg max-w-none prose-headings:font-display prose-a:text-accent prose-strong:text-ink text-ink prose-p:text-ink prose-li:text-ink prose-code:text-signal prose-code:before:content-none prose-code:after:content-none">
            <ReactMarkdown>{project.long_description}</ReactMarkdown>
          </div>
        )}
      </article>
    </div>
  )
}
