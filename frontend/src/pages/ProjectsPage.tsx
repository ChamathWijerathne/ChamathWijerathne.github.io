import { useMemo, useState } from 'react'
import ProjectList from '@/components/ui/ProjectList'
import { useProjects } from '@/lib/data'
import { cn } from '@/lib/utils'

export default function ProjectsPage() {
  const [filter, setFilter] = useState<string>('All')
  const { data: projects = [], isLoading } = useProjects()

  // Most common technologies first, so the filter row stays useful.
  const filters = useMemo(() => {
    const counts = new Map<string, number>()
    projects.forEach((p) => p.tech_stack.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)))
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t).slice(0, 8)
    return ['All', ...top]
  }, [projects])

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.tech_stack.includes(filter))

  return (
    <div className="pt-32 pb-12">
      <div className="section-container">
        <h1 className="section-title sm:text-5xl">Projects</h1>
        <p className="section-subtitle">
          Computer vision, GPU programming, time-series and data work, plus production software from my day jobs.
        </p>

        {projects.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by technology">
            {filters.map((tech) => (
              <button
                key={tech}
                onClick={() => setFilter(tech)}
                aria-pressed={filter === tech}
                className={cn(
                  'px-3.5 py-1.5 rounded-md text-sm border transition-colors',
                  filter === tech
                    ? 'bg-ink border-ink text-paper'
                    : 'border-line text-muted hover:border-ink/40 hover:text-ink'
                )}
              >
                {tech}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4" aria-busy="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-md bg-line/40 animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <ProjectList projects={filtered} />
        ) : (
          <p className="text-muted py-16">
            No projects use {filter}.{' '}
            <button className="link" onClick={() => setFilter('All')}>
              Show all projects
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
