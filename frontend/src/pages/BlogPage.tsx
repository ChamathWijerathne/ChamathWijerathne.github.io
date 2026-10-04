import { Link } from 'react-router-dom'
import { usePosts } from '@/lib/data'
import { formatDate } from '@/lib/utils'

export default function BlogPage() {
  const { data: posts = [], isLoading } = usePosts()

  return (
    <div className="pt-32 pb-12">
      <div className="section-container max-w-3xl">
        <h1 className="section-title sm:text-5xl">Blog</h1>
        <p className="section-subtitle">Notes on Python, ML, GPU programming and working as an engineer in Finland.</p>

        {isLoading ? (
          <div className="space-y-4" aria-busy="true">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 rounded-md bg-line/40 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="border-y border-line py-10">
            <p>No posts published yet.</p>
            <p className="mt-2 text-muted">
              In the meantime, the <Link to="/projects" className="link">projects</Link> show what I&apos;ve been
              working on.
            </p>
          </div>
        ) : (
          <ul className="border-t border-line">
            {posts.map((post) => (
              <li key={post.id} className="border-b border-line">
                <Link to={`/blog/${post.slug}`} className="group block py-7">
                  <time className="text-sm text-muted" dateTime={post.created_at}>
                    {formatDate(post.created_at)}
                  </time>
                  <h2 className="mt-1 text-2xl font-bold group-hover:text-accent transition-colors">{post.title}</h2>
                  <p className="mt-2 text-muted line-clamp-2">{post.excerpt}</p>
                  {post.tags.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <li key={tag} className="tag">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
